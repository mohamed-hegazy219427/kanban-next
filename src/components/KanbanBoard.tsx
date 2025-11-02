"use client";

import { useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Task, useUpdateTask } from "@/hooks/useTasks";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import SearchBar from "./SearchBar";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export default function KanbanBoard() {
  const { search } = useSearchQuery();
  const updateTask = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return setActiveTask(null);

    const task = active.data.current as Task;
    const newColumn = over.id as "backlog" | "in-progress" | "review" | "done";
    const validColumns = ["backlog", "in-progress", "review", "done"] as const;

    if (!task || !validColumns.includes(newColumn)) return;

    if (task.column !== newColumn) {
      await updateTask.mutateAsync({
        ...task,
        column: newColumn,
        updatedAt: new Date().toISOString(),
      });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <Container  maxWidth={"xl"} className="py-6">
        <Paper
          elevation={0}
          className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl"
        >
          <Typography
            variant="h4"
            fontWeight="700"
            className="text-gray-800 mb-2"
          >
            📋 Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your tasks efficiently with drag & drop functionality
          </Typography>
        </Paper>

        <SearchBar />

        <Grid container spacing={3} className="mt-2">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KanbanColumn column="backlog" title="📝 Backlog" search={search} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KanbanColumn
              column="in-progress"
              title="🚀 In Progress"
              search={search}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KanbanColumn column="review" title="👀 Review" search={search} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KanbanColumn column="done" title="✅ Done" search={search} />
          </Grid>
        </Grid>
      </Container>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
