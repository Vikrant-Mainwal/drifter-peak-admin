"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  loading?: boolean;
  children: ReactNode;

  variant?: "primary" | "outline" | "accent" | "ghost";

  size?: "sm" | "md" | "lg";

  onClick?: () => void;

  className?: string;

  disabled?: boolean;

  type?: "button" | "submit";

  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-black text-white hover:opacity-90",

  outline:
    "border border-gray-300 bg-white text-black hover:bg-gray-100",

  accent:
    "bg-gray-100 text-black hover:bg-gray-200",

  ghost:
    "bg-transparent text-black hover:bg-gray-100",
};

const sizeClasses = {
  sm:
    "px-3 py-2 text-xs",

  md:
    "px-4 py-3 text-sm",

  lg:
    "px-6 py-4 text-base",
};

export function Button({
  loading = false,

  children,

  variant = "primary",

  size = "md",

  onClick,

  className,

  disabled = false,

  type = "button",

  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}

      onClick={onClick}

      disabled={disabled || loading}

      className={cn(
        "btn-press inline-flex items-center justify-center",

        "font-display uppercase tracking-[0.15em]",

        "transition-all duration-200",

        "disabled:cursor-not-allowed disabled:opacity-40",

        variantClasses[variant],

        sizeClasses[size],

        fullWidth && "w-full",

        className
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}