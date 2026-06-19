"use client";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import type { Toast, ToastType } from "../../hooks/useToast";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={14} className="text-green-400" />,
  error:   <AlertCircle size={14} className="text-red-400" />,
  info:    <Info size={14} className="text-black" />,
};

const borders: Record<ToastType, string> = {
  success: "border-green-500/30",
  error:   "border-red-500/30",
  info:    "border-black/40",
};

export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-300 flex flex-col gap-2 w-72">
      {toasts.map(t => (
        <div key={t.id}
          className={`anim-fade-up flex items-start gap-3 border px-4 py-3 ${borders[t.type]}`}>
          <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
          <p className="flex-1 font-body text-sm leading-snug">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="opacity-40 hover:opacity-100 transition-opacity shrink-0 mt-0.5">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}