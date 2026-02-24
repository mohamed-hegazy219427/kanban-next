"use client";

import React, { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "Do you want to proceed?",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="modal modal-bottom sm:modal-middle bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-md p-0 bg-base-200 rounded-4xl shadow-2xl border border-base-content/5 overflow-hidden flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-base-100 px-8 py-6 border-b border-base-content/10">
          <h2 className="text-2xl font-black text-base-content tracking-tighter">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 opacity-60"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-10 py-6 bg-base-200 text-center">
          <p className="text-base-content font-bold text-xl leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 px-8 py-10 bg-base-200 border-t border-base-content/10">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost hover:bg-base-content/20 font-black capitalize text-[11px] tracking-[0.4em] px-8 transition-all text-base-content/40 hover:text-base-content"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-ghost hover:bg-base-content/20 font-black capitalize text-[11px] tracking-[0.4em] px-8 transition-all text-error"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
