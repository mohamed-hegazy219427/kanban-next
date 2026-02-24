"use client";

import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";

type Values = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  tags: string;
};

type TaskFormDialogProps = {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Values>;
  onSubmit: (values: Values) => void;
  title: string;
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string(),
  priority: Yup.string().oneOf(["low", "medium", "high"]).required(),
  assignee: Yup.string().trim().required("Assignee is required"),
  tags: Yup.string(),
});

export default function TaskFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  title,
}: TaskFormDialogProps) {
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

  const initialValues: Values = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    priority: (initial?.priority as any) ?? "medium",
    assignee: initial?.assignee ?? "",
    tags: initial?.tags ?? "",
  };

  const handleSubmit = (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>,
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="modal modal-bottom sm:modal-middle bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-2xl p-0 bg-base-200 border border-base-content/10 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="flex justify-between items-center bg-base-100 px-10 py-8 border-b border-base-content/10 shrink-0">
          <h2 className="text-3xl font-black text-base-content tracking-tighter">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-12 py-12 bg-base-100 scrollbar-thin scrollbar-thumb-base-content/10 scrollbar-track-transparent">
                <div className="flex flex-col gap-8 pb-4">
                  <div className="form-control w-full group">
                    <label className="label p-0 mb-3 transition-opacity opacity-60 group-focus-within:opacity-100">
                      <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                        Classification / Title
                      </span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="What are we focusing on?"
                      value={values.title}
                      onChange={handleChange}
                      className="input input-bordered input-lg w-full font-black focus:input-primary focus:outline-offset-0 transition-all text-2xl h-20 bg-base-100 border-base-content/10 rounded-2xl px-8 placeholder:text-base-content/20"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-control w-full group">
                      <label className="label p-0 mb-3 transition-opacity opacity-60 group-focus-within:opacity-100">
                        <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                          Priority Level
                        </span>
                      </label>
                      <select
                        name="priority"
                        value={values.priority}
                        onChange={handleChange}
                        className="select select-bordered select-lg w-full font-bold focus:select-primary focus:outline-offset-0 transition-all bg-base-100 border-base-content/10 rounded-2xl px-8"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div className="form-control w-full group">
                      <label className="label p-0 mb-3 transition-opacity opacity-60 group-focus-within:opacity-100">
                        <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                          Responsible Party
                        </span>
                      </label>
                      <input
                        name="assignee"
                        type="text"
                        placeholder="Who is driving this?"
                        value={values.assignee}
                        onChange={handleChange}
                        className="input input-bordered input-lg w-full font-bold focus:input-primary focus:outline-offset-0 transition-all bg-base-100 border-base-content/10 rounded-2xl px-8 placeholder:text-base-content/20"
                      />
                      <ErrorMessage
                        name="assignee"
                        component="div"
                        className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-4"
                      />
                    </div>
                  </div>

                  <div className="form-control w-full group">
                    <label className="label p-0 mb-3 transition-opacity opacity-60 group-focus-within:opacity-100">
                      <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                        Tags / Labels (Comma separated)
                      </span>
                    </label>
                    <input
                      name="tags"
                      type="text"
                      placeholder="frontend, bug, high-priority..."
                      value={values.tags}
                      onChange={handleChange}
                      className="input input-bordered input-lg w-full font-bold focus:input-primary focus:outline-offset-0 transition-all bg-base-100 border-base-content/10 rounded-2xl px-8 placeholder:text-base-content/20"
                    />
                  </div>

                  <div className="form-control w-full group">
                    <label className="label p-0 mb-3 transition-opacity opacity-60 group-focus-within:opacity-100">
                      <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                        Core Specifications / Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Provide context, constraints, or sub-tasks..."
                      value={values.description}
                      onChange={handleChange}
                      className="textarea textarea-bordered textarea-lg w-full font-bold focus:textarea-primary focus:outline-offset-0 transition-all text-lg py-6 bg-base-100 border-base-content/10 rounded-2xl min-h-[180px] px-8 placeholder:text-base-content/20"
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Actions Footer */}
              <div className="flex justify-end gap-4 px-10 py-10 bg-base-200/50 border-t border-base-content/10 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost hover:bg-base-content/5 font-black uppercase text-[11px] tracking-[0.4em] px-10 transition-all text-base-content/40 hover:text-base-content"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary shadow-xl font-black uppercase text-[11px] tracking-[0.4em] px-12 hover:scale-[1.02] active:scale-95 transition-all text-primary-content"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <span className="loading loading-spinner loading-xs"></span>
                      <span>Synchronizing...</span>
                    </span>
                  ) : (
                    "Confirm & Commit"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </dialog>
  );
}
