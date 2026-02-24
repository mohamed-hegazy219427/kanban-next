"use client";

import { useMemo } from "react";
import { api } from "@/lib/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";

const PAGE_SIZE = 10;

export function useTasks(column: string, search = "") {
  const fetcher = async ({ pageParam = 1 }: { pageParam?: number }) => {
    // Determine which pagination param to use.
    // my-json-server and older json-server use _limit, v1.x uses _per_page.
    const params = new URLSearchParams({
      _page: String(pageParam),
      _per_page: String(PAGE_SIZE),
      _limit: String(PAGE_SIZE),
      _sort: "order",
      column,
    });

    const res = await api.get<any>(`/tasks?${params.toString()}`);

    // CRITICAL: Log response to help identify structure in production
    console.log(`[useTasks] Response for ${column}:`, {
      status: res.status,
      isObject: typeof res.data === "object" && res.data !== null,
      isArray: Array.isArray(res.data),
      hasDataProp: res.data && "data" in res.data,
      data: res.data,
    });

    let items: Task[] = [];
    let total = 0;

    // Format A: { data: Task[], items: number } (json-server v1.x or user's provided sample)
    if (
      res.data &&
      typeof res.data === "object" &&
      "data" in res.data &&
      Array.isArray(res.data.data)
    ) {
      items = res.data.data;
      total = res.data.items || res.data.total || items.length;
    }
    // Format B: Task[] (Standard REST / older json-server / my-json-server)
    else if (Array.isArray(res.data)) {
      items = res.data;
      const totalCountHeader = res.headers["x-total-count"];
      total = totalCountHeader ? parseInt(totalCountHeader, 10) : items.length;
    }
    // Fallback: Unexpected format
    else {
      console.error(
        `[useTasks] Unexpected API response format for ${column}:`,
        res.data,
      );
      items = [];
      total = 0;
    }

    return {
      items,
      nextPage: pageParam * PAGE_SIZE < total ? pageParam + 1 : undefined,
      total,
    };
  };

  const query = useInfiniteQuery({
    queryKey: ["tasks", column],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Client-side filtering by title (json-server beta doesn't support server-side search with pagination)
  const filteredData = useMemo(() => {
    if (!query.data?.pages || !search) return query.data;
    const lowerSearch = search.toLowerCase();
    return {
      ...query.data,
      pages: query.data.pages.map((page) => ({
        ...page,
        items: (page.items || []).filter((task) =>
          task?.title?.toLowerCase().includes(lowerSearch),
        ),
      })),
    };
  }, [query.data, search]);

  return {
    ...query,
    data: filteredData,
  };
}

// ========== Mutations ==========

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (newTask: CreateTaskPayload) => api.post("/tasks", newTask),
    onSuccess: (res) => {
      const createdTask = res.data;
      const queryKey = ["tasks", createdTask.column];

      qc.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        const [firstPage, ...restPages] = oldData.pages;
        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              items: [createdTask, ...firstPage.items],
              total: (firstPage.total || 0) + 1,
            },
            ...restPages,
          ],
        };
      });

      qc.invalidateQueries({ queryKey: ["tasks"], refetchType: "none" });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: UpdateTaskPayload) =>
      api.patch(`/tasks/${task.id}`, task),
    onMutate: async (updatedTask) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });

      const queryKey = ["tasks"];
      const previousData = qc.getQueriesData({ queryKey });

      // 1. Find the "full" task data from the entire cache BEFORE starting individual query updates
      let fullTask: Task | null = null;
      previousData.forEach(([_, data]: [any, any]) => {
        if (!data?.pages) return;
        data.pages.forEach((page: any) => {
          const found = (page.items || []).find(
            (item: Task) => String(item.id) === String(updatedTask.id),
          );
          if (found) fullTask = found;
        });
      });

      // 2. Apply optimistic updates by iterating over each relevant query explicitly
      // This avoids the issue where the 'query' object might be undefined in setQueriesData callback
      previousData.forEach(([key, oldData]) => {
        const currentQueryColumn = key[1];
        if (!currentQueryColumn) return;

        qc.setQueryData(key, (old: any) => {
          if (!old?.pages) return old;

          // REMOVE logic: If the task moved to a different column, remove it from the old one
          if (updatedTask.column && updatedTask.column !== currentQueryColumn) {
            let removed = false;
            const newPages = old.pages.map((page: any) => {
              const filteredItems = (page.items || []).filter(
                (item: Task) => String(item.id) !== String(updatedTask.id),
              );
              if (filteredItems.length < (page.items || []).length)
                removed = true;
              return { ...page, items: filteredItems };
            });

            if (!removed) return old;

            return {
              ...old,
              pages: newPages.map((page: any, idx: number) =>
                idx === 0
                  ? { ...page, total: Math.max(0, (page.total || 0) - 1) }
                  : page,
              ),
            };
          }

          // ADD or UPDATE logic: If this is the target column or the task's current column
          const isTargetMatch = updatedTask.column === currentQueryColumn;
          const isPersistedMatch =
            !updatedTask.column && fullTask?.column === currentQueryColumn;

          if (isTargetMatch || isPersistedMatch) {
            const isTaskInThisQuery = taskFoundInThisQuery(old, updatedTask.id);

            const newPages = old.pages.map((page: any, index: number) => {
              let items = [...(page.items || [])];
              const taskIndex = items.findIndex(
                (item: Task) => String(item.id) === String(updatedTask.id),
              );

              if (taskIndex !== -1) {
                items[taskIndex] = { ...items[taskIndex], ...updatedTask };
              } else if (index === 0 && fullTask) {
                // Only add to the first page if it's not here yet
                items.push({ ...fullTask, ...updatedTask });
              }

              items.sort((a, b) => (a.order || 0) - (b.order || 0));

              return {
                ...page,
                items,
                total:
                  index === 0 && !isTaskInThisQuery
                    ? (page.total || 0) + 1
                    : page.total,
              };
            });
            return { ...old, pages: newPages };
          }
          return old;
        });
      });

      return { previousData };
    },
    onSuccess: (res) => {
      const serverTask = res.data;
      if (!serverTask) return;

      qc.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: (page.items || []).map((item: Task) =>
              String(item.id) === String(serverTask.id)
                ? { ...item, ...serverTask }
                : item,
            ),
          })),
        };
      });

      qc.invalidateQueries({ queryKey: ["tasks"], refetchType: "none" });
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) =>
          qc.setQueryData(key, data),
        );
      }
    },
  });
}

function taskFoundInThisQuery(data: any, id: number | string) {
  return data?.pages?.some((page: any) =>
    (page.items || []).some((item: any) => String(item.id) === String(id)),
  );
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.delete(`/tasks/${id}`),
    onSuccess: (_, id) => {
      qc.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          items: (page.items || []).filter(
            (item: Task) => String(item.id) !== String(id),
          ),
        }));

        const removed = oldData.pages.some(
          (page: any, idx: number) =>
            (page.items || []).length > newPages[idx].items.length,
        );

        if (!removed) return oldData;

        return {
          ...oldData,
          pages: newPages.map((page: any, idx: number) =>
            idx === 0
              ? { ...page, total: Math.max(0, (page.total || 0) - 1) }
              : page,
          ),
        };
      });

      qc.invalidateQueries({ queryKey: ["tasks"], refetchType: "none" });
    },
  });
}
