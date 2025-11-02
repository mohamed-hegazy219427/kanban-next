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
import TaskCard from "../TaskCard";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  column: "backlog" | "in-progress" | "review" | "done";
  title: string;
  search?: string;
}

const columnColors: Record<Props["column"], string> = {
  backlog: "#F9FAFB",
  "in-progress": "#FEF3C7",
  review: "#E0F2FE",
  done: "#DCFCE7",
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
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const { setNodeRef, isOver } = useDroppable({ id: column });
  const highlight = isOver ? "#D1E9FF" : columnColors[column];

  const handleCreate = async () => {
    if (!form.title.trim()) return alert("Task title is required!");
    await createTask.mutateAsync({
      title: form.title,
      description: form.description,
      column,
      createdAt: new Date().toISOString(),
    });
    setOpenCreate(false);
  };

  const handleEditOpen = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description || "" });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editTask) return;
    await updateTask.mutateAsync({
      ...editTask,
      title: form.title,
      description: form.description,
      updatedAt: new Date().toISOString(),
    });
    setOpenEdit(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync(id);
    }
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
            onDelete={() => handleDelete(task.id)}
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
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>
          Create Task
          <IconButton
            aria-label="close"
            onClick={() => setOpenCreate(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 mt-2">
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>
          Edit Task
          <IconButton
            aria-label="close"
            onClick={() => setOpenEdit(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 mt-2">
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
