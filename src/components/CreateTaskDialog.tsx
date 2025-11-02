"use client";

import TaskFormDialog from "./TaskFormDialog";

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    description: string;
  }) => Promise<void> | void;
};

export default function CreateTaskDialog({
  open,
  onClose,
  onCreate,
}: CreateTaskDialogProps) {
  const handleSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    await onCreate(values);
    onClose();
  };

  return (
    <TaskFormDialog
      open={open}
      onClose={onClose}
      initial={{ title: "", description: "" }}
      onSubmit={handleSubmit}
      title="Create Task"
    />
  );
}
