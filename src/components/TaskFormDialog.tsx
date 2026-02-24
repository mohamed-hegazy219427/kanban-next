"use client";

import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Values = {
  title: string;
  description: string;
};

type TaskFormDialogProps = {
  open: boolean;
  onClose: () => void;
  initial?: Values;
  onSubmit: (values: Values) => void;
  title: string;
  // Optional: pass any additional props if needed
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string(),
});

export default function TaskFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  title,
}: TaskFormDialogProps) {
  const initialValues: Values = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
  };

  const handleSubmit = (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>,
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          className: "backdrop-blur-md bg-base-content/5",
        },
      }}
      PaperProps={{
        className:
          "bg-base-100/95 backdrop-blur-3xl rounded-[2.5rem]! shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border border-base-content/5 overflow-hidden",
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-base-content/5 px-10 py-8">
        <Typography
          component="span"
          className="text-3xl font-black text-base-content tracking-tighter"
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors"
        >
          <CloseIcon sx={{ fontSize: 24, opacity: 0.6 }} />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form>
            <DialogContent className="flex flex-col gap-10 px-12 py-14 bg-transparent">
              <Box className="form-control w-full group">
                <label className="label p-0 mb-3 transition-opacity group-focus-within:opacity-100 opacity-50">
                  <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                    Classification / Title
                  </span>
                </label>
                <TextField
                  name="title"
                  fullWidth
                  placeholder="The objective of this task..."
                  value={values.title}
                  onChange={handleChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    className:
                      "input! input-bordered! input-lg! w-full! font-black focus:input-primary! focus:outline-offset-0! transition-all text-2xl h-18 bg-base-100! border-base-content/10! rounded-2xl! px-6 placeholder:text-base-content/20!",
                  }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-6 animate-in fade-in slide-in-from-top-1"
                />
              </Box>

              <Box className="form-control w-full group">
                <label className="label p-0 mb-3 transition-opacity group-focus-within:opacity-100 opacity-50">
                  <span className="label-text font-black text-[11px] uppercase tracking-[0.5em] text-base-content">
                    Core Specifications
                  </span>
                </label>
                <TextField
                  name="description"
                  fullWidth
                  multiline
                  minRows={6}
                  placeholder="Provide context, constraints, or sub-tasks..."
                  value={values.description}
                  onChange={handleChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    className:
                      "textarea! textarea-bordered! textarea-lg! w-full! font-bold focus:textarea-primary! focus:outline-offset-0! transition-all text-lg py-6 bg-base-100! border-base-content/10! rounded-2xl! min-h-[220px] px-6 placeholder:text-base-content/20!",
                  }}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-6 animate-in fade-in slide-in-from-top-1"
                />
              </Box>
            </DialogContent>

            <DialogActions className="px-10 py-10 gap-4 border-t border-base-content/5 backdrop-blur-md">
              <Button
                onClick={onClose}
                className="btn btn-ghost hover:bg-base-content/10 font-black uppercase text-[11px] tracking-[0.3em] px-10 transition-all text-base-content/50"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary shadow-[0_20px_40px_-10px_rgba(var(--p),0.5)] font-black uppercase text-[11px] tracking-[0.3em] px-12 hover:scale-[1.02] active:scale-95 transition-all text-primary-content"
              >
                {isSubmitting ? (
                  <Box className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-xs"></span>
                    <span>Synchronizing...</span>
                  </Box>
                ) : (
                  "Confirm & Commit"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
