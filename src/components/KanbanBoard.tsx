"use client";

import { useState, useMemo } from "react";
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
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskData = active.data.current as Task;
    if (!activeTaskData) {
      setActiveTask(null);
      return;
    }

    const overId = String(over.id);
    const overData = over.data.current;

    let targetColumn: TaskColumn | null = null;
    if (["backlog", "in-progress", "review", "done"].includes(overId)) {
      targetColumn = overId as TaskColumn;
    } else if (overData && "column" in overData) {
      targetColumn = overData.column as TaskColumn;
    }

    if (!targetColumn) {
      setActiveTask(null);
      return;
    }

    if (activeTaskData.column !== targetColumn || active.id !== overId) {
      const newOrder =
        overData && "order" in overData
          ? (overData.order as number)
          : activeTaskData.order;
      updateTask.mutate({
        ...activeTaskData,
        column: targetColumn,
        order: newOrder,
        updatedAt: new Date().toISOString(),
      });
    }

    setActiveTask(null);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    const activeData = active.data.current as Task;
    const overData = over.data.current;

    if (!activeData) return;

    let targetColumn: TaskColumn | null = null;
    if (["backlog", "in-progress", "review", "done"].includes(overId)) {
      targetColumn = overId as TaskColumn;
    } else if (overData && "column" in overData) {
      targetColumn = overData.column as TaskColumn;
    }

    if (!targetColumn) return;

    if (activeData.column !== targetColumn) {
      const newOrder =
        overData && "order" in overData ? (overData.order as number) : 0;
      updateTask.mutate({
        ...activeData,
        column: targetColumn,
        order: newOrder,
        updatedAt: new Date().toISOString(),
      });
      active.data.current.column = targetColumn;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="min-h-screen bg-base-100/50">
        <div className="max-w-[1700px] mx-auto py-12 px-6 sm:px-10 lg:px-16">
          <header className="mb-14 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
            <div className="flex-1">
              <h1 className="text-6xl font-black text-base-content tracking-tighter mb-4">
                Project{" "}
                <span className="text-primary underline decoration-primary/20 underline-offset-8">
                  Board
                </span>
              </h1>
              <p className="text-base-content/50 text-xl max-w-2xl font-semibold leading-relaxed">
                High-performance task orchestration with DaisyUI themes and
                persistent sorting precision.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-base-200 p-3 rounded-3xl shadow-inner border border-base-300">
              <div className="w-full md:w-96">
                <SearchBar />
              </div>
              <div className="divider divider-horizontal hidden md:flex m-0 opacity-20"></div>
              <ThemeSelector />
            </div>
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
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="z-100 opacity-90 scale-105 pointer-events-none">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
