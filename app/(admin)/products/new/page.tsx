"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";
import { ProductForm } from "../../../../components/admin/ProductForm";
import type {
  SpecRow,
  VariantRow,
  MediaItem,
} from "../../../../components/admin/ProductForm";

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();

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
  const [variants, setVariants] = useState<VariantRow[]>([
    { color: "", size: "", sku: "", stock: "", price: "" },
  ]);

  // Media — single ordered list, mixed images + videos
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [sizeChartFile, setSizeChartFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    // 1. Insert product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
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
        is_active: false, // starts hidden until ready
      })
      .select("id")
      .single();

    if (insertError || !newProduct) {
      setSaving(false);
      return setError(insertError?.message ?? "Failed to create product");
    }

    const productId = newProduct.id;

    // 2. Insert variants
    const validVariants = variants.filter((v) => v.color || v.size);
    if (validVariants.length > 0) {
      await supabase.from("product_variants").insert(
        validVariants.map((v) => ({
          product_id: productId,
          sku: v.sku || null,
          color: v.color || null,
          size: v.size || null,
          stock: parseInt(v.stock || "0", 10),
          price: v.price ? parseFloat(v.price) : null,
        })),
      );
    }

    // 3. Upload media in order — every item here is "new" on create
    const resolvedMedia: {
      url: string;
      media_type: "image" | "video";
      sort_order: number;
    }[] = [];

    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i];
      if (item.kind !== "new") continue;

      const filePath = `${productId}/${item.type}_${Date.now()}_${item.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, item.file);
      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);
      resolvedMedia.push({
        url: urlData.publicUrl,
        media_type: item.type,
        sort_order: i,
      });
    }

    if (resolvedMedia.length > 0) {
      await supabase.from("product_media").insert(
        resolvedMedia.map((m) => ({
          product_id: productId,
          media_type: m.media_type,
          url: m.url,
          sort_order: m.sort_order,
        })),
      );
    }

    // 4. Upload size chart and attach to the new product
    if (sizeChartFile) {
      const filePath = `${productId}/size_chart_${Date.now()}_${sizeChartFile.name}`;
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
          .eq("id", productId);
      }
    }

    setSaving(false);
    router.push("/products");
  }

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
      // Media — empty list to start, nothing "existing" on create
      mediaItems={mediaItems}
      setMediaItems={setMediaItems}
      setSizeChartFile={setSizeChartFile}
      // Submit
      handleSubmit={handleSubmit}
      saving={saving}
      error={error}
      mode="add"
    />
  );
}
