"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/client";
import { ProductForm } from "../../../../../components/admin/ProductForm";
import type {
  SpecRow,
  VariantRow,
  MediaItem,
} from "../../../../../components/admin/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const router = useRouter();
  const { id } = use(params);

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Basic info
  const [listTitle, setListTitle] = useState("");
  const [detailTitle, setDetailTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");

  // Categorisation
  const [gender, setGender] = useState("men");
  const [category, setCategory] = useState("topwear");
  const [subcategory, setSubcategory] = useState("");

  // Pricing
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Policies
  const [isReturnable, setIsReturnable] = useState(true);
  const [isExchangeable, setIsExchangeable] = useState(true);
  const [exchangeWindowDays, setExchangeWindowDays] = useState("7");

  // Tags / keywords
  const [tags, setTags] = useState("");
  const [keywords, setKeywords] = useState("");

  // Specs & variants
  const [specs, setSpecs] = useState<SpecRow[]>([{ label: "", value: "" }]);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Media — single ordered list, mixed images + videos
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [sizeChartFile, setSizeChartFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminThenLoad();
  }, []);

  async function checkAdminThenLoad() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) return router.push("/login?error=not_admin");

    setIsAdmin(true);
    setCheckingAdmin(false);
    loadProduct();
  }

  async function loadProduct() {
    setLoadingProduct(true);

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError || !product) {
      setError("Product not found");
      setLoadingProduct(false);
      return;
    }

    setListTitle(product.list_title ?? "");
    setDetailTitle(product.detail_title ?? "");
    setSlogan(product.slogan ?? "");
    setDescription(product.description ?? "");
    setBrand(product.brand ?? "");
    setGender(product.gender);
    setCategory(product.category);
    setSubcategory(product.subcategory ?? "");
    setMrp(String(product.mrp));
    setSellingPrice(String(product.selling_price));
    setIsReturnable(product.is_returnable);
    setIsExchangeable(product.is_exchangeable);
    setExchangeWindowDays(String(product.exchange_window_days ?? 7));
    setTags((product.tags ?? []).join(", "));
    setKeywords((product.keywords ?? []).join(", "));

    if (product.specs) {
      const rows = Object.entries(product.specs).map(([label, value]) => ({
        label,
        value: String(value),
      }));
      setSpecs(rows.length ? rows : [{ label: "", value: "" }]);
    }

    const { data: variantData } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id);

    setVariants(
      (variantData ?? []).map((v) => ({
        id: v.id,
        color: v.color ?? "",
        size: v.size ?? "",
        sku: v.sku ?? "",
        stock: String(v.stock),
        price: v.price ? String(v.price) : "",
      })),
    );

    // Load existing images + videos together, in saved order
    const { data: mediaData } = await supabase
      .from("product_media")
      .select("id, url, media_type, sort_order")
      .eq("product_id", id)
      .in("media_type", ["image", "video"])
      .order("sort_order", { ascending: true });

    setMediaItems(
      (mediaData ?? []).map((m) => ({
        kind: "existing" as const,
        id: m.id,
        url: m.url,
        type: m.media_type as "image" | "video",
      })),
    );

    setLoadingProduct(false);
  }

  // Spec helpers
  function updateSpecRow(i: number, field: keyof SpecRow, value: string) {
    const updated = [...specs];
    updated[i][field] = value;
    setSpecs(updated);
  }
  function addSpecRow() {
    setSpecs([...specs, { label: "", value: "" }]);
  }
  function removeSpecRow(i: number) {
    setSpecs(specs.filter((_, idx) => idx !== i));
  }

  // Variant helpers
  function updateVariantRow(i: number, field: keyof VariantRow, value: string) {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  }
  function addVariantRow() {
    setVariants([
      ...variants,
      { color: "", size: "", sku: "", stock: "", price: "" },
    ]);
  }
  function removeVariantRow(i: number) {
    setVariants(variants.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    setError("");
    if (!listTitle.trim() || !mrp || !sellingPrice) {
      setError("List title, MRP, and selling price are required");
      return;
    }
    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      setError("Selling price cannot be greater than MRP");
      return;
    }

    setSaving(true);

    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.label.trim()) specsObj[s.label.trim()] = s.value.trim();
    });

    // 1. Update product
    const { error: updateError } = await supabase
      .from("products")
      .update({
        list_title: listTitle,
        detail_title: detailTitle || null,
        slogan: slogan || null,
        description: description || null,
        specs: Object.keys(specsObj).length ? specsObj : null,
        brand: brand || null,
        gender,
        category,
        subcategory: subcategory || null,
        mrp: parseFloat(mrp),
        selling_price: parseFloat(sellingPrice),
        is_returnable: isReturnable,
        is_exchangeable: isExchangeable,
        exchange_window_days: isExchangeable
          ? parseInt(exchangeWindowDays || "0", 10)
          : null,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : null,
        keywords: keywords
          ? keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : null,
      })
      .eq("id", id);

    if (updateError) {
      setSaving(false);
      return setError(updateError.message);
    }

    // 2. Upsert variants
    for (const v of variants) {
      if (!v.color && !v.size) continue;
      const payload = {
        product_id: id,
        sku: v.sku || null,
        color: v.color || null,
        size: v.size || null,
        stock: parseInt(v.stock || "0", 10),
        price: v.price ? parseFloat(v.price) : null,
      };
      if ((v as any).id) {
        await supabase
          .from("product_variants")
          .update(payload)
          .eq("id", (v as any).id);
      } else {
        await supabase.from("product_variants").insert(payload);
      }
    }

    // 3. Resolve media: upload any new files, keep existing urls, preserve order
    const resolvedMedia: { url: string; media_type: "image" | "video"; sort_order: number }[] = [];

    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i];

      if (item.kind === "existing") {
        resolvedMedia.push({ url: item.url, media_type: item.type, sort_order: i });
        continue;
      }

      const filePath = `${id}/${item.type}_${Date.now()}_${item.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, item.file);
      if (uploadError) continue;

      const { data: urlData } = supabase.storage.from("products").getPublicUrl(filePath);
      resolvedMedia.push({ url: urlData.publicUrl, media_type: item.type, sort_order: i });
    }

    await supabase
      .from("product_media")
      .delete()
      .eq("product_id", id)
      .in("media_type", ["image", "video"]);

    if (resolvedMedia.length > 0) {
      await supabase.from("product_media").insert(
        resolvedMedia.map((m) => ({
          product_id: id,
          media_type: m.media_type,
          url: m.url,
          sort_order: m.sort_order,
        })),
      );
    }

    // 4. Upload size chart if provided
    // 4. Upload size chart if a new one was provided
    if (sizeChartFile) {
      const filePath = `${id}/size_chart_${Date.now()}_${sizeChartFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, sizeChartFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        await supabase
          .from("products")
          .update({ size_chart_url: urlData.publicUrl })
          .eq("id", id);
      }
    }

    setSaving(false);
    router.push("/products");
  }

  if (checkingAdmin || loadingProduct) {
    return <div className="p-8 text-sm text-gray-500">Loading…</div>;
  }
  if (!isAdmin) return null;

  return (
    <ProductForm
      // Basic info
      listTitle={listTitle}
      setListTitle={setListTitle}
      detailTitle={detailTitle}
      setDetailTitle={setDetailTitle}
      slogan={slogan}
      setSlogan={setSlogan}
      description={description}
      setDescription={setDescription}
      brand={brand}
      setBrand={setBrand}
      // Categorisation
      gender={gender}
      setGender={setGender}
      category={category}
      setCategory={setCategory}
      subcategory={subcategory}
      setSubcategory={setSubcategory}
      // Pricing
      mrp={mrp}
      setMrp={setMrp}
      sellingPrice={sellingPrice}
      setSellingPrice={setSellingPrice}
      // Policies
      isReturnable={isReturnable}
      setIsReturnable={setIsReturnable}
      isExchangeable={isExchangeable}
      setIsExchangeable={setIsExchangeable}
      exchangeWindowDays={exchangeWindowDays}
      setExchangeWindowDays={setExchangeWindowDays}
      // Tags
      tags={tags}
      setTags={setTags}
      keywords={keywords}
      setKeywords={setKeywords}
      // Specs
      specs={specs}
      addSpecRow={addSpecRow}
      removeSpecRow={removeSpecRow}
      updateSpecRow={updateSpecRow}
      // Variants
      variants={variants}
      addVariantRow={addVariantRow}
      removeVariantRow={removeVariantRow}
      updateVariantRow={updateVariantRow}
      // Media
      // Media
      mediaItems={mediaItems}
      setMediaItems={setMediaItems}
      setSizeChartFile={setSizeChartFile}
      // Submit
      handleSubmit={handleSubmit}
      saving={saving}
      error={error}
      mode="edit"
    />
  );
}
