"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
      data: task,
      disabled: isOverlay, // Disable sortable logic if it's just a visual overlay
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
      <Card
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        elevation={0}
        className={`card card-compact bg-base-100! shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 group ${isDragging ? "opacity-50 ring-4 ring-primary ring-inset" : ""} active:scale-95`}
        aria-label={`Task: ${task.title}`}
      >
        <CardContent className="card-body gap-4 p-5!">
          <div className="flex justify-between items-start">
            <div
              className={`badge badge-sm font-black text-[9px] uppercase tracking-tighter ${getPriorityBadgeClass(task.priority)}`}
            >
              {task.priority || "Normal"}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
              {onEdit && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
                >
                  <EditIcon sx={{ fontSize: 16 }} className="text-accent" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                >
                  <DeleteIcon sx={{ fontSize: 16 }} className="text-error"/>
                </IconButton>
              )}
            </div>
          </div>

          <div>
            <Typography
              component="h3"
              className="font-extrabold text-base text-base-content leading-tight p-0"
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography
                variant="body2"
                className="text-base-content/50 text-xs line-clamp-2 mt-2 leading-relaxed font-medium"
              >
                {task.description}
              </Typography>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {task.assignee && (
              <div className="badge badge-outline badge-md text-[10px] font-bold h-6 border-base-content/10">
                <span className="opacity-30 mr-1 text-[8px]">BY</span>
                {task.assignee}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-base-content/5 text-[9px] text-base-content/30 font-black uppercase tracking-widest">
            <Typography variant="caption" className="text-inherit font-inherit">
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : ""}
            </Typography>
            {task.updatedAt && (
              <span className="flex items-center gap-1 text-success lowercase italic">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Live
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
