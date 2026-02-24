"use client";

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
    const params = new URLSearchParams({
      _page: String(pageParam),
      _per_page: String(PAGE_SIZE), // v1.0.0-beta.3 uses _per_page
      _sort: "order",
      column,
    });

    if (search) params.set("q", search);

    // json-server 1.0.0-beta.3 returns { data: Task[], items: number, ... }
    const res = await api.get<{ data: Task[]; items: number }>(
      `/tasks?${params.toString()}`,
    );

    const { data: items, items: total } = res.data;

    return {
      items,
      nextPage: pageParam * PAGE_SIZE < total ? pageParam + 1 : undefined,
      total,
    };
  };

  return useInfiniteQuery({
    queryKey: ["tasks", column, search],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

// ========== Mutations ==========

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (newTask: CreateTaskPayload) => api.post("/tasks", newTask),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: UpdateTaskPayload) => api.put(`/tasks/${task.id}`, task),
    onMutate: async (updatedTask) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });

      const queryKey = ["tasks"];
      const previousData = qc.getQueriesData({ queryKey });

      // 1. Find the "full" task data from the cache before any changes
      let fullTask: Task | null = null;
      previousData.forEach(([_, data]: [any, any]) => {
        if (!data) return;
        data.pages.forEach((page: any) => {
          const found = page.items.find(
            (item: Task) => item.id === updatedTask.id,
          );
          if (found) fullTask = found;
        });
      });

      if (!fullTask) return { previousData };

      // 2. Apply optimistic updates with full data preservation
      qc.setQueriesData({ queryKey }, (oldData: any, variables: any) => {
        if (!oldData) return oldData;
        const currentQueryColumn = variables[1];

        // REMOVE logic
        if (updatedTask.column && updatedTask.column !== currentQueryColumn) {
          let removed = false;
          const newPages = oldData.pages.map((page: any) => {
            const filteredItems = page.items.filter(
              (item: Task) => item.id !== updatedTask.id,
            );
            if (filteredItems.length < page.items.length) removed = true;
            return {
              ...page,
              items: filteredItems,
            };
          });

          if (!removed) return oldData;

          return {
            ...oldData,
            pages: newPages.map((page: any, idx: number) =>
              idx === 0
                ? { ...page, total: Math.max(0, page.total - 1) }
                : page,
            ),
          };
        }

        // ADD or UPDATE logic
        if (
          updatedTask.column === currentQueryColumn ||
          (!updatedTask.column && fullTask?.column === currentQueryColumn)
        ) {
          const isTaskInThisQuery = taskFoundInThisQuery(
            oldData,
            updatedTask.id,
          );

          const newPages = oldData.pages.map((page: any, index: number) => {
            let items = [...page.items];
            const taskIndex = items.findIndex(
              (item: Task) => item.id === updatedTask.id,
            );

            if (taskIndex !== -1) {
              items[taskIndex] = { ...items[taskIndex], ...updatedTask };
            } else if (index === 0) {
              items.push({ ...fullTask, ...updatedTask });
            }

            items.sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
              ...page,
              items,
              total:
                index === 0 && !isTaskInThisQuery ? page.total + 1 : page.total,
            };
          });
          return { ...oldData, pages: newPages };
        }
        return oldData;
      });

      return { previousData };
    },
    onSuccess: () => {
      // Invalidation happens silently in background for ultimate smoothness
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

function taskFoundInThisQuery(data: any, id: number) {
  return data.pages.some((page: any) =>
    page.items.some((item: any) => item.id === id),
  );
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
