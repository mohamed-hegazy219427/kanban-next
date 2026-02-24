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
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = qc.getQueryData(["tasks"]);

      // Optimistically update to the new value
      // This is a simplified version; in a real app, you'd find and replace the specific task
      // across all relevant infinite query pages.
      return { previousTasks };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        qc.setQueryData(["tasks"], context.previousTasks);
      }
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
