"use client";

import TaskFormDialog from "./TaskFormDialog";
import { Task } from "@/types";

type EditTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onEdit: (payload: {
    id: number;
    title: string;
    description: string;
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
  }) => {
    if (!task) return;
    await onEdit({
      id: task.id,
      title: values.title,
      description: values.description,
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
      }}
      onSubmit={handleSubmit}
      title="Edit Task"
    />
  );
}
