"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Task } from "@/hooks/useTasks";

interface Props {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: task,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="px-4 py-3 shadow-sm hover:shadow-md transition rounded-md bg-white/95 backdrop-blur-sm"
      aria-label={`Task: ${task.title}`}
    >
      <CardContent className="flex flex-col gap-3">
        {/* Header: Title + actions */}
        <div className="flex items-start justify-between gap-2">
          <Typography
            variant="h6"
            component="div"
            fontWeight={700}
            className="truncate"
            style={{ maxWidth: "68%" }} // slightly tighter to keep actions visible
          >
            {task.title}
          </Typography>

          <div className="flex items-center gap-2">
            {onEdit && (
              <IconButton
                aria-label="edit"
                size="small"
                onClick={onEdit}
                className="p-1.5"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                aria-label="delete"
                size="small"
                onClick={onDelete}
                className="p-1.5"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </div>

        {/* Description (optional) */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            className="whitespace-pre-wrap"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {task.description}
          </Typography>
        )}

        {/* Meta row: assignee + priority */}
        <div className="flex items-center gap-3 mt-1">
          {task.assignee && (
            <span
              className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700
                     shadow-sm"
              title={`Assignee: ${task.assignee}`}
            >
              <span className="sr-only">Assignee:</span>
              {task.assignee}
            </span>
          )}

          {task.priority && (
            <span
              className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.15)", // amber tint
                color: "#9A6B1A",
                border: "1px solid rgba(245, 158, 11, 0.25)",
              }}
              title={`Priority: ${task.priority}`}
            >
              {task.priority}
            </span>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between mt-1">
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: task.createdAt ? "inline" : "none" }}
          >
            Created:{" "}
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString()
              : ""}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: task.updatedAt ? "inline" : "none" }}
          >
            Updated:{" "}
            {task.updatedAt
              ? new Date(task.updatedAt).toLocaleDateString()
              : ""}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
