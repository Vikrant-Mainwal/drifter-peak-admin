import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block font-mono text-[10px] tracking-[0.25em] mb-2">
          {label}{props.required && " *"}{error ? ` — ${error}` : ""}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "dp-input w-full transition-all duration-200 p-2 rounded outline-none text-md",
          error && "border-[var(--red)]",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1 font-mono text-[9px] tracking-[0.15em]">{hint}</p>
      )}
    </div>
  )
);
Input.displayName = "Input";