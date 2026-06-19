"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProductForm } from "../../../../components/admin/ProductForm";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "../../../../components/ui/Toast";
import { FormSkeleton } from "../../../../components/ui/Skeleton";
import type { Product, ProductInsert } from "@/types/product.types";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const isNew = id === "new";
  const router = useRouter();
  const { toasts, show, dismiss } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    setProduct(null);

    setLoading(false);
  }, [isNew]);

  const handleSubmit = async (data: any) => {
    setSaving(true);

    try {
      console.log(data);

      show(isNew ? "Product created!" : "Product updated!", "success");

      setTimeout(() => {
        router.push("/products");
      }, 800);
    } catch {
      show("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card padding="lg" className="max-w-3xl bg-white">
        <CardHeader>
          <CardTitle>{isNew ? "Add Product" : "Edit Product"}</CardTitle>
        </CardHeader>
        {loading ? (
          <FormSkeleton />
        ) : (
          <ProductForm
            initialValues={product ?? {}}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel={isNew ? "Create Product" : "Save Changes"}
          />
        )}
      </Card>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
