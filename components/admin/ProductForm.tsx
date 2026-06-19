"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

import {
  PRODUCT_FORM_FIELDS,
  type ProductInsert,
  type FormField,
} from "../../types/product.types";

interface ProductFormProps {
  initialValues?: Partial<ProductInsert>;
  onSubmit: (data: ProductInsert) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

function FieldLabel({
  label,
  required,
  error,
}: {
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label
      className={cn(
        "mb-2 block font-mono text-[10px] tracking-[0.25em]",
        error ? "text-red-500" : "text-gray-500"
      )}
    >
      {label}
      {required && " *"}
      {error && ` — ${error}`}
    </label>
  );
}

function RenderField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField;
  value: unknown;
  onChange: (val: unknown) => void;
  error?: string;
}) {
  switch (field.type) {
    case "text":
    case "number":
      return (
        <Input
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          required={field.required}
          error={error}
          onChange={(e) =>
            onChange(
              field.type === "number"
                ? Number(e.target.value)
                : e.target.value
            )
          }
        />
      );

    case "textarea":
      return (
        <div>
          <FieldLabel
            label={field.label}
            required={field.required}
            error={error}
          />

          <textarea
            rows={4}
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full rounded-md border px-3 py-2 text-sm outline-none transition",
              "border-gray-300 focus:border-black",
              error && "border-red-500"
            )}
          />
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center justify-between py-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500">
            {field.label}
          </span>

          <button
            type="button"
            onClick={() => onChange(!value)}
            className={cn(
              "relative h-6 w-11 rounded-full border transition-all",
              value
                ? "border-black bg-black"
                : "border-gray-300 bg-gray-100"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                value ? "left-5" : "left-0.5"
              )}
            />
          </button>
        </div>
      );

    case "multiselect":
      return (
        <div>
          <FieldLabel
            label={field.label}
            required={field.required}
            error={error}
          />

          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const selected =
                Array.isArray(value) &&
                (value as string[]).includes(opt);

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const arr = Array.isArray(value)
                      ? [...(value as string[])]
                      : [];

                    onChange(
                      selected
                        ? arr.filter((v) => v !== opt)
                        : [...arr, opt]
                    );
                  }}
                  className={cn(
                    "h-12 w-12 border font-mono text-sm transition-all",
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "image":
      return (
        <div>
          <FieldLabel
            label={field.label}
            required={field.required}
            error={error}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
            onChange={(e) => {
              const files = e.target.files;

              if (!files) return;

              const fileArray = Array.from(files).slice(0, 3);

              onChange(fileArray);
            }}
          />

          <div className="mt-3 flex gap-3">
            {Array.isArray(value) &&
              value.map((item: any, i: number) => {
                if (!item) return null;

                const src =
                  item instanceof File
                    ? URL.createObjectURL(item)
                    : item;

                return (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 rounded-md border border-gray-300 object-cover"
                  />
                );
              })}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function ProductForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [values, setValues] =
    useState<Partial<ProductInsert>>(initialValues);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductInsert, string>>
  >({});

  const set = (key: keyof ProductInsert, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    PRODUCT_FORM_FIELDS.forEach((field) => {
      if (!field.required) return;

      const value = values[field.name as keyof ProductInsert];

      const empty =
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (empty) {
        newErrors[field.name as keyof ProductInsert] =
          "Required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values as ProductInsert);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {PRODUCT_FORM_FIELDS.map((field) => (
          <div
            key={field.name}
            className={
              field.span === "full"
                ? "md:col-span-2"
                : ""
            }
          >
            <RenderField
              field={field}
              value={
                values[field.name as keyof ProductInsert]
              }
              onChange={(value) =>
                set(field.name as keyof ProductInsert, value)
              }
              error={
                errors[field.name as keyof ProductInsert]
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          fullWidth
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}