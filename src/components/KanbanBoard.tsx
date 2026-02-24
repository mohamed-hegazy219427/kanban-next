"use client";

import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
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
import { useUpdateTask } from "@/hooks/useTasks";
import { Task, TaskColumn } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import SearchBar from "./SearchBar";
import ThemeSelector from "./ThemeSelector";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export default function KanbanBoard() {
  const { search } = useSearchQuery();
  const updateTask = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskData = active.data.current as Task;
    const overId = over.id;

    // Detect target column: it's either the overId itself (if dropping on an empty column)
    // or the column of the task we dropped over.
    const overData = over.data.current;
    const targetColumn = (
      overData && "column" in overData ? overData.column : overId
    ) as TaskColumn;

    // 1. Handle moving between columns
    if (activeTaskData.column !== targetColumn) {
      // Basic move to end of column or specific spot
      // For cross-column, we default to the end or the overTask's order if possible
      const newOrder =
        overData && "order" in overData
          ? (overData.order as number)
          : activeTaskData.order;

      await updateTask.mutateAsync({
        ...activeTaskData,
        column: targetColumn,
        order: newOrder,
        updatedAt: new Date().toISOString(),
      });
    }
    // 2. Handle reordering within the same column
    else if (active.id !== overId) {
      const overTaskData = overData as Task;
      if (overTaskData && activeTaskData.column === overTaskData.column) {
        await updateTask.mutateAsync({
          ...activeTaskData,
          order: overTaskData.order,
          updatedAt: new Date().toISOString(),
        });
      }
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
      <Box className="min-h-screen bg-base-100/50">
        <Container
          maxWidth={false}
          className="max-w-[1700px] mx-auto py-12 px-6 sm:px-10 lg:px-16"
        >
          <header className="mb-14 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
            <div className="flex-1">
              <Typography
                component="h1"
                className="text-6xl font-black text-base-content tracking-tighter mb-4 p-0"
              >
                Project{" "}
                <span className="text-primary underline decoration-primary/20 underline-offset-8">
                  Board
                </span>
              </Typography>
              <Typography className="text-base-content/50 text-xl max-w-2xl font-semibold leading-relaxed p-0">
                High-performance task orchestration with DaisyUI themes and
                persistent sorting precision.
              </Typography>
            </div>

            <Box className="flex flex-col md:flex-row items-center gap-4 bg-base-200 p-3 rounded-3xl shadow-inner border border-base-300">
              <div className="w-full md:w-96">
                <SearchBar />
              </div>
              <div className="divider divider-horizontal hidden md:flex m-0 opacity-20"></div>
              <ThemeSelector />
            </Box>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            <KanbanColumn column="backlog" title="📝 Backlog" search={search} />
            <KanbanColumn
              column="in-progress"
              title="🚀 In Progress"
              search={search}
            />
            <KanbanColumn column="review" title="👀 Review" search={search} />
            <KanbanColumn column="done" title="✅ Done" search={search} />
          </div>
        </Container>
      </Box>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-95 scale-105 transition-transform duration-200">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
