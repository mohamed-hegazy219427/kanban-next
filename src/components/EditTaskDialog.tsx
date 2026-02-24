"use client";

import TaskFormDialog from "./TaskFormDialog";
import { Task } from "@/types";

type EditTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onEdit: (payload: {
    id: number | string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    assignee: string;
    tags: string;
  }) => Promise<void> | void;
};

export default function EditTaskDialog({
  open,
  onClose,
  task,
  onEdit,
}: EditTaskDialogProps) {
  const handleSubmit = async (values: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    assignee: string;
    tags: string;
  }) => {
    if (!task) return;
    await onEdit({
      id: task.id,
      title: values.title,
      description: values.description,
      priority: values.priority,
      assignee: values.assignee,
      tags: values.tags,
    });
    onClose();
  };

  return (
    <TaskFormDialog
      open={open}
      onClose={onClose}
      initial={{
        title: task?.title ?? "",
        description: task?.description ?? "",
        priority: task?.priority ?? "medium",
        assignee: task?.assignee ?? "",
        tags: task?.tags ?? "",
      }}
      onSubmit={handleSubmit}
      title="Edit Task"
    />
  );
}
