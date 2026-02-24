"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import React from "react";

interface Props {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  isOverlay?: boolean;
}

const TaskCard = React.memo(
  ({ task, onEdit, onDelete, isOverlay = false }: Props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: String(task.id),
      data: {
        type: "Task",
        task,
      },
      disabled: isOverlay,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
      cursor: isOverlay ? "grabbing" : "grab",
    };

    const getPriorityBadgeClass = (priority?: string) => {
      switch (priority?.toLowerCase()) {
        case "high":
          return "badge-error";
        case "medium":
          return "badge-warning";
        case "low":
          return "badge-success";
        default:
          return "badge-ghost";
      }
    };

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={`card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 group ${isDragging ? "opacity-50 ring-4 ring-primary ring-inset" : ""} active:scale-95`}
        aria-label={`Task: ${task.title}`}
      >
        <div className="card-body gap-4 p-5">
          <div className="flex justify-between items-start">
            <div
              className={`badge badge-sm font-black text-[9px] uppercase tracking-tighter ${getPriorityBadgeClass(task.priority)}`}
            >
              {task.priority || "Normal"}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
                >
                  {/* Edit Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-accent"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                >
                  {/* Delete Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-error"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-base text-base-content leading-tight">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-base-content/50 text-xs line-clamp-2 mt-2 leading-relaxed font-medium">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {task.assignee && (
              <div className="badge badge-outline badge-md text-[10px] font-bold h-6 border-base-content/10">
                <span className="opacity-30 mr-1 text-[8px]">BY</span>
                {task.assignee}
              </div>
            )}
            {task.tags &&
              task.tags.split(",").map((tag, idx) => {
                const trimmedTag = tag.trim();
                if (!trimmedTag) return null;
                return (
                  <div
                    key={idx}
                    className="badge badge-neutral badge-outline badge-xs px-1 text-[8px] opacity-40 uppercase font-black tracking-widest"
                  >
                    # {trimmedTag}
                  </div>
                );
              })}
          </div>

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-base-content/5 text-[9px] text-base-content/30 font-black uppercase tracking-widest">
            <span>
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : ""}
            </span>
            {task.updatedAt && (
              <span className="flex items-center gap-1 text-success lowercase italic">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Live
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
