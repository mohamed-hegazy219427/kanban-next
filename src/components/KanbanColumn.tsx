"use client";

import { useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { Task } from "@/types";
import TaskCard from "./TaskCard";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskDialog from "./CreateTaskDialog";
import EditTaskDialog from "./EditTaskDialog";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  column: "backlog" | "in-progress" | "review" | "done";
  title: string;
  search?: string;
}

export default function KanbanColumn({ column, title, search = "" }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTasks(column, search);

  // Flatten tasks from infinite query pages
  const tasks = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const taskIds = useMemo(() => tasks.map((t) => String(t.id)), [tasks]);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const { setNodeRef, isOver } = useDroppable({ id: column });

  const handleCreate = async (payload: {
    title: string;
    description: string;
  }) => {
    await createTask.mutateAsync({
      title: payload.title,
      description: payload.description,
      column,
      order: tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) + 1 : 0,
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
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    await deleteTask.mutateAsync(taskToDelete.id);
    setOpenConfirm(false);
    setTaskToDelete(null);
  };

  if (isError)
    return (
      <Box className="alert alert-error shadow-lg rounded-2xl flex flex-col items-center text-center p-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-8 w-8 mb-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-bold">Error loading tasks</span>
        <Button
          className="btn btn-sm btn-outline mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              className="skeleton h-32 w-full rounded-xl"
            />
          ))}
        </div>
      );
    }

    return (
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard
            key={`task-${task.id}`}
            task={task}
            onEdit={() => handleEditOpen(task)}
            onDelete={() => askDelete(task)}
          />
        ))}
      </SortableContext>
    );
  };

  const getHeaderColorClass = () => {
    switch (column) {
      case "backlog":
        return "border-blue-500";
      case "in-progress":
        return "border-warning";
      case "review":
        return "border-secondary";
      case "done":
        return "border-success";
      default:
        return "border-base-300";
    }
  };

  return (
    <Box
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-2xl bg-base-200/40 border-t-4 ${getHeaderColorClass()} shadow-sm transition-all duration-300 ${isOver ? "bg-base-300/60 ring-2 ring-primary/20" : ""}`}
    >
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center gap-3">
          <Typography
            component="h2"
            className="font-black text-xl text-base-content tracking-tight flex items-center gap-2 m-0 p-0"
          >
            {title}
            <div className="badge badge-neutral badge-sm font-bold opacity-70">
              {tasks.length}
            </div>
          </Typography>
        </div>
        <IconButton
          onClick={() => setOpenCreate(true)}
          className="btn btn-circle btn-xs btn-primary shadow-md hover:scale-110 transition-transform p-0!"
          sx={{ minWidth: 24, padding: 0 }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </div>

      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide min-h-[300px]">
        {tasks.length === 0 && !isLoading ? (
          <Box className="flex flex-col items-center justify-center p-12 opacity-20 text-center grayscale py-20">
            <div className="w-16 h-16 border-4 border-dashed border-base-content rounded-full mb-4 animate-pulse"></div>
            <p className="text-xs font-black uppercase tracking-widest">
              No Tasks
            </p>
          </Box>
        ) : (
          renderContent()
        )}
      </div>

      {hasNextPage && (
        <div className="p-4 pt-0 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn btn-ghost btn-xs w-full text-primary font-bold hover:bg-primary/10"
          >
            {isFetchingNextPage ? (
              <CircularProgress size={12} className="text-primary mr-2" />
            ) : null}
            LOAD MORE
          </Button>
        </div>
      )}

      <CreateTaskDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
      />

      <EditTaskDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        task={editTask}
        onEdit={handleEditSave}
      />

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
    </Box>
  );
}
