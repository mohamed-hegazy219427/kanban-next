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
      <DialogTitle className="flex justify-between items-center border-b border-base-content/5 px-8 py-6">
        <Typography
          component="span"
          className="text-2xl font-black text-base-content tracking-tighter"
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors"
        >
          <CloseIcon sx={{ fontSize: 20, opacity: 0.6 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="px-10 py-12 bg-transparent text-center">
        <Typography className="text-base-content font-bold text-xl leading-relaxed">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions className="px-8 py-8 gap-4 border-t border-base-content/5 backdrop-blur-md justify-center">
        <Button
          onClick={onCancel}
          className="btn btn-ghost hover:bg-base-content/10 font-black uppercase text-[11px] tracking-[0.3em] px-8 transition-all text-base-content/50"
        >
          Discard
        </Button>
        <Button
          onClick={onConfirm}
          className="btn btn-error shadow-[0_20px_40px_-10px_rgba(var(--er),0.5)] font-black uppercase text-[11px] tracking-[0.3em] px-10 hover:scale-[1.02] active:scale-95 transition-all text-error-content"
        >
          Confirm Termination
        </Button>
      </DialogActions>
    </Dialog>
  );
}
