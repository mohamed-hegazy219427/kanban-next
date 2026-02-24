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
      PaperProps={{
        className: "bg-base-100 rounded-3xl shadow-2xl border border-base-300",
        style: { borderRadius: "1.5rem" },
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-base-200/50 px-8 py-6">
        <Typography
          component="span"
          className="text-2xl font-black text-base-content tracking-tight"
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:bg-base-300"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
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
            <DialogContent className="flex flex-col gap-10 px-12 py-12 bg-base-100">
              <Box className="form-control w-full group">
                <label className="label transition-all group-focus-within:opacity-100 opacity-40 mb-1">
                  <span className="label-text font-black text-[10px] uppercase tracking-[0.4em] text-base-content">
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
                      "input input-lg input-bordered w-full font-black focus:input-primary transition-all text-2xl h-18 bg-base-100 border-2 rounded-[1.5rem] group-v-focus-within:ring-8 group-v-focus-within:ring-primary/5 px-6",
                  }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-6 animate-in fade-in slide-in-from-top-1"
                />
              </Box>

              <Box className="form-control w-full group">
                <label className="label transition-all group-focus-within:opacity-100 opacity-40 mb-1">
                  <span className="label-text font-black text-[10px] uppercase tracking-[0.4em] text-base-content">
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
                      "textarea textarea-lg textarea-bordered w-full font-bold focus:textarea-primary transition-all text-lg py-6 bg-base-100 border-2 rounded-[1.5rem] min-h-[200px] group-v-focus-within:ring-8 group-v-focus-within:ring-primary/5 px-6",
                  }}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-3 text-[10px] font-black uppercase text-error tracking-[0.2em] pl-6 animate-in fade-in slide-in-from-top-1"
                />
              </Box>
            </DialogContent>

            <DialogActions className="px-10 py-8 bg-base-200/50 gap-4 border-t border-base-300">
              <Button
                onClick={onClose}
                className="btn btn-ghost hover:bg-base-300 font-extrabold uppercase text-xs tracking-[0.2em] px-8"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary shadow-xl shadow-primary/30 font-extrabold uppercase text-xs tracking-[0.2em] px-10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <Box className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-xs"></span>
                    <span>Syncing...</span>
                  </Box>
                ) : (
                  "Confirm & Save"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
