"use client";

import { api } from "@/lib/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export interface Task {
  id: number;
  title: string;
  description?: string;
  column: "backlog" | "in-progress" | "review" | "done";
  priority?: "low" | "medium" | "high";
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PAGE_SIZE = 10;

export function useTasks(column: string, search = "") {
  const fetcher = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const params = new URLSearchParams({
      _page: String(pageParam),
      _limit: String(PAGE_SIZE),
      column,
    });

    if (search) params.set("q", search);

    const res = await api.get<Task[]>(`/tasks?${params.toString()}`);
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    const total = Number(res.headers["x-total-count"] || 0);

    return {
      items: res.data,
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
    mutationFn: (newTask: Partial<Task>) => api.post("/tasks", newTask),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => api.put(`/tasks/${task.id}`, task),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
