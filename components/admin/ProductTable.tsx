"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import { Column, Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { ConfirmModal } from "../ui/Modal";
import { ProductTableSkeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";

import { formatPrice } from "../../lib/utils";

import type { Product } from "../../types/product.types";

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function ProductTable({
  products,
  loading = false,
  onDelete,
}: ProductTableProps) {
  const [query, setQuery] = useState("");

  const [confirmId, setConfirmId] =
    useState<string | null>(null);

  const filtered = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleDelete = async () => {
    if (!confirmId) return;

    await onDelete(confirmId);

    setConfirmId(null);
  };

  if (loading) {
    return <ProductTableSkeleton />;
  }

  const columns: Column<Product>[] = [
    {
      key: "image",

      header: "IMG",

      width: "80px",

      render: (product) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              N/A
            </div>
          )}
        </div>
      ),
    },

    {
      key: "name",

      header: "PRODUCT",

      render: (product) => (
        <div>
          <p className="font-display text-base uppercase text-black">
            {product.name}
          </p>

          {product.stock > 0 && (
            <Badge variant="accent">
              LIMITED
            </Badge>
          )}
        </div>
      ),
    },

    {
      key: "category",

      header: "CATEGORY",

      render: (product) => (
        <span className="font-mono text-xs uppercase text-gray-500">
          {product.category ?? "-"}
        </span>
      ),
    },

    {
      key: "price",

      header: "PRICE",

      render: (product) => (
        <div>
          <p className="font-display text-base text-black">
            {formatPrice(product.price)}
          </p>

          <p className="font-mono text-[10px] text-gray-400 line-through">
            {formatPrice(product.price)}
          </p>
        </div>
      ),
    },

    {
      key: "stock",

      header: "STOCK",

      render: (product) => (
        <Badge>{product.stock}</Badge>
      ),
    },

    {
      key: "actions",

      header: "ACTIONS",

      width: "100px",

      render: (product) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/products/${product.id}`}
            className="text-gray-500 transition hover:text-black"
          >
            <Pencil size={14} />
          </Link>

          <button
            onClick={() => setConfirmId(product.id)}
            className="text-gray-500 transition hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Top section */}

      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            className="pl-9"
          />
        </div>

        <Link href="/products/new">
          <Button size="sm">
            + Add Product
          </Button>
        </Link>
      </div>

      {/* Table */}

      <Table<Product>
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No products found"
      />

      {/* Delete modal */}

      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="This cannot be undone. The product will be permanently removed."
        danger
      />
    </>
  );
}