"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  Task,
} from "@/hooks/useTasks";
import TaskCard from "./TaskCard";
import { Button, CircularProgress, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskDialog from "./CreateTaskDialog";
import EditTaskDialog from "./EditTaskDialog";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  column: "backlog" | "in-progress" | "review" | "done";
  title: string;
  search?: string;
}

const columnColors: Record<Props["column"], string> = {
  backlog: "#66D9EF",
  "in-progress": "#FFC107",
  review: "#FF9900",
  done: "#00E676",
};

export default function KanbanColumn({ column, title, search = "" }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTasks(column, search);
  const tasks = data?.pages.flatMap((p) => p.items) ?? [];

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // keep your existing delete handler, but trigger confirm
 
  const [editTask, setEditTask] = useState<Task | null>(null);

  const { setNodeRef, isOver } = useDroppable({ id: column });
  const highlight = isOver ? "#D1E9FF" : columnColors[column];

  const handleCreate = async (payload: {
    title: string;
    description: string;
  }) => {
    await createTask.mutateAsync({
      title: payload.title,
      description: payload.description,
      column,
      createdAt: new Date().toISOString(),
    });
  };

  const handleEditOpen = (task: Task) => {
    setEditTask(task);
    setOpenEdit(true);
  };

  const handleEditSave = async (payload: {
    title: string;
    description: string;
  }) => {
    if (!editTask) return;
    await updateTask.mutateAsync({
      ...editTask,
      title: payload.title,
      description: payload.description,
      updatedAt: new Date().toISOString(),
    });
    setOpenEdit(false);
  };


   const askDelete = async (task: Task) => {
     setTaskToDelete(task);
     setOpenConfirm(true);
    //  await deleteTask.mutateAsync(task.id);

   };

   const handleConfirmDelete = async () => {
     if (!taskToDelete) return;
     await deleteTask.mutateAsync(taskToDelete.id);
     setOpenConfirm(false);
     setTaskToDelete(null);
   };
  

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">Error loading tasks</div>
    );

  return (
    <div
      ref={setNodeRef}
      className="border rounded-2xl p-4 flex flex-col h-full transition-colors duration-200"
      style={{ backgroundColor: highlight }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <IconButton size="small" onClick={() => setOpenCreate(true)}>
          <AddIcon />
        </IconButton>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => handleEditOpen(task)}
            onDelete={() => askDelete(task)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        {hasNextPage ? (
          <Button
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? <CircularProgress size={20} /> : "Load More"}
          </Button>
        ) : (
          <p className="text-sm text-gray-400">No more tasks</p>
        )}
      </div>

      {/* Create Dialog */}
      <CreateTaskDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
      />

      {/* Edit Dialog */}
      <EditTaskDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        task={editTask}
        onEdit={handleEditSave}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openConfirm}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to delete the task "${taskToDelete.title}"? This action cannot be undone.`
            : "Delete this task?"
        }
        onCancel={() => {
          setOpenConfirm(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
