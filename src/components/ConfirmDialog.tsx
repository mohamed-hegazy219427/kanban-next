"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        className: "bg-base-100 rounded-3xl shadow-2xl border border-base-300",
        style: { borderRadius: "1.5rem" },
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-base-200/50 px-6 py-4">
        <Typography
          component="span"
          className="text-xl font-black text-base-content tracking-tight"
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:bg-base-300"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="px-6 py-8 bg-base-100 text-center">
        <Typography className="text-base-content/70 font-medium leading-relaxed">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions className="px-6 py-4 bg-base-200/30 gap-3 border-t border-base-200">
        <Button
          onClick={onCancel}
          className="btn btn-ghost border-transparent hover:bg-base-300 font-black uppercase text-xs tracking-widest px-6"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="btn btn-error shadow-lg shadow-error/20 font-black uppercase text-xs tracking-widest px-8"
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
