import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "danger"
  | "warning";

const styles: Record<BadgeVariant, string> = {
  default: "border-black text-white",
  accent: "bg-white text-black",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 font-mono text-[9px] tracking-[0.2em]",
        styles[variant]
      )}
    >
      {children}
    </span>
  );
}