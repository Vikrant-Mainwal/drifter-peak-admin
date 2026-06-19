"use client";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}


export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full border anim-fade-up">
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h3 className="font-display text-2xl uppercase">{title}</h3>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Confirm dialog built on Modal
export function ConfirmModal({
  open, onClose, onConfirm, title, message, danger
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="font-body text-base mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose}
          className="btn-press font-mono text-xs tracking-[0.2em] border px-5 py-2.5 hover:opacity-70">
          CANCEL
        </button>
        <button onClick={() => { onConfirm(); onClose(); }}
          className="btn-press font-mono text-xs tracking-[0.2em] px-5 py-2.5">
          CONFIRM
        </button>
      </div>
    </Modal>
  );
}