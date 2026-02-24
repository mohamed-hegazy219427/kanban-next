export type TaskColumn = "backlog" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description?: string;
  column: TaskColumn;
  priority?: TaskPriority;
  assignee?: string;
  order: number; // Added for in-column sorting persistence
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  column: TaskColumn;
  priority?: TaskPriority;
  assignee?: string;
  order: number;
}

export interface UpdateTaskPayload extends Partial<Task> {
  id: number;
}
