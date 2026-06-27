"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

interface ProductRow {
  id: string;
  list_title: string;
  brand: string | null;
  category: string;
  gender: string;
  mrp: number;
  selling_price: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminProductListPage() {
  const supabase = createClient();
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminThenLoad();
  }, []);

  async function checkAdminThenLoad() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      router.push("/login?error=not_admin");
      return;
    }

    setIsAdmin(true);
    setCheckingAdmin(false);
    loadProducts();
  }

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, list_title, brand, category, gender, mrp, selling_price, is_active, created_at",
      )
      .order("created_at", { ascending: false });

    if (!error) setProducts(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (
      !confirm(`Delete "${title}"? This also removes its variants and images.`)
    )
      return;

    setDeletingId(id);
    setError("");
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDeletingId(null);

    if (error) return setError(error.message);
    setProducts(products.filter((p) => p.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id);

    if (!error) {
      setProducts(
        products.map((p) => (p.id === id ? { ...p, is_active: !current } : p)),
      );
    }
  }

  if (checkingAdmin)
    return <div className="p-8 text-sm text-gray-500">Checking access…</div>;
  if (!isAdmin) return null;
  if (loading)
    return <div className="p-8 text-sm text-gray-500">Loading products…</div>;

  return (
    <div className="mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <a
          href="/products/new"
          className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Add Product
        </a>
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No products yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-y-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="py-2">Title</th>
                <th className="py-2">Brand</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900 font-medium">
                    {product.list_title}
                  </td>
                  <td className="py-3 text-gray-600">{product.brand || "—"}</td>
                  <td className="py-3 text-gray-600 capitalize">
                    {product.gender} / {product.category}
                  </td>
                  <td className="py-3 text-gray-900">
                    ₹{product.selling_price}
                    {product.selling_price < product.mrp && (
                      <span className="text-gray-400 line-through ml-1">
                        ₹{product.mrp}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() =>
                        toggleActive(product.id, product.is_active)
                      }
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href={`/products/edit/${product.id}`}
                      className="text-xs text-gray-600 underline mr-3"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() =>
                        handleDelete(product.id, product.list_title)
                      }
                      disabled={deletingId === product.id}
                      className="text-xs text-red-600 underline disabled:opacity-40"
                    >
                      {deletingId === product.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
