"use client";

import { useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
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
  const qc = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task;
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeData = active.data.current?.task as Task;
    const overData = over.data.current;

    if (!activeData) return;

    const activeColumn = activeData.column;
    let overColumn: TaskColumn | null = null;

    if (["backlog", "in-progress", "review", "done"].includes(overId)) {
      overColumn = overId as TaskColumn;
    } else if (overData && "task" in overData && overData.task.column) {
      overColumn = overData.task.column as TaskColumn;
    }

    if (!overColumn || activeColumn === overColumn) return;

    // PERFORM IMMEDIATE CROSS-COLUMN MOVE IN CACHE for "snapping"
    qc.setQueryData(["tasks", activeColumn], (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((p: any) => ({
          ...p,
          items: (p.items || []).filter(
            (item: Task) => String(item.id) !== activeId,
          ),
          total: Math.max(0, (p.total || 0) - 1),
        })),
      };
    });

    qc.setQueryData(["tasks", overColumn], (old: any) => {
      if (!old?.pages || old.pages.length === 0) return old;
      const [firstPage, ...restPages] = old.pages;

      // Determine position in new column
      const newItems = [...(firstPage.items || [])];
      const isOverATask = ![
        "backlog",
        "in-progress",
        "review",
        "done",
      ].includes(overId);

      const overIndex = isOverATask
        ? newItems.findIndex((i) => String(i.id) === overId)
        : -1;

      const updatedActiveData = { ...activeData, column: overColumn };

      if (overIndex !== -1) {
        newItems.splice(overIndex, 0, updatedActiveData);
      } else {
        newItems.push(updatedActiveData);
      }

      // Update active data reference for subsequent dragOver events
      if (active.data.current) {
        active.data.current.task = updatedActiveData;
      }

      return {
        ...old,
        pages: [
          {
            ...firstPage,
            items: newItems,
            total: (firstPage.total || 0) + 1,
          },
          ...restPages,
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskData = active.data.current?.task as Task;
    if (!activeTaskData) {
      setActiveTask(null);
      return;
    }

    const overId = String(over.id);
    const overData = over.data.current?.task as Task;
    const isColumnDrop = ["backlog", "in-progress", "review", "done"].includes(
      overId,
    );

    const targetColumn = isColumnDrop
      ? (overId as TaskColumn)
      : overData.column;

    // CALCULATE PRECISE ORDER
    // We need the items in the target column to find the neighbor orders
    const columnData: any = qc.getQueryData(["tasks", targetColumn]);
    const columnTasks =
      columnData?.pages.flatMap((p: any) => p.items || []) || [];

    let newOrder = activeTaskData.order;

    if (isColumnDrop) {
      // Put at the end of the column
      const maxOrder =
        columnTasks.length > 0
          ? Math.max(...columnTasks.map((t: Task) => t.order))
          : 0;
      newOrder = maxOrder + 1;
    } else {
      const overIndex = columnTasks.findIndex(
        (t: Task) => String(t.id) === overId,
      );
      if (overIndex !== -1) {
        const currentOver = columnTasks[overIndex];

        if (overIndex === 0) {
          // Top of list
          newOrder = currentOver.order - 1;
        } else if (overIndex === columnTasks.length - 1) {
          // If we dropped on the last item, we put it after it
          newOrder = currentOver.order + 1;
        } else {
          // Midpoint between previous and current
          newOrder = (columnTasks[overIndex - 1].order + currentOver.order) / 2;
        }
      }
    }

    // Always trigger mutation to ensure server sync and cache reconciliation
    updateTask.mutate({
      ...activeTaskData,
      column: targetColumn,
      order: newOrder,
      updatedAt: new Date().toISOString(),
    });

    setActiveTask(null);
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
