"use client";
import { useEffect, useState } from "react";
import { ProductTable } from "../../../components/admin/ProductTable";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/ui/Toast";
import type { Product } from "../../../types/product.types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, show, dismiss } = useToast();

  useEffect(() => {
    setProducts([
      {
        id: "1",
        name: "Oversized T-Shirt",
        price: 999,
        stock: 10,
      },
      {
        id: "2",
        name: "Summer Shirt",
        price: 1299,
        stock: 15,
      },
    ]);

    setLoading(false);
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
  setProducts((p) => p.filter((x) => x.id !== id));

  show("Product deleted", "success");
};

  return (
    <>
      <ProductTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
      />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
