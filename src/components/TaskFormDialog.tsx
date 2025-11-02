"use client";

import { Formik, Form,  ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  IconButton,
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
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
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
            <DialogContent className="flex flex-col gap-3 mt-2">
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={values.title}
                onChange={handleChange}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-xs text-red-500"
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                minRows={2}
                value={values.description}
                onChange={handleChange}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-xs text-red-500"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
