"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Check,
  Upload,
} from "lucide-react";

//  Types

export interface SpecRow {
  label: string;
  value: string;
}

export interface VariantRow {
  color: string;
  size: string;
  sku: string;
  stock: string;
  price: string;
}

export interface ProductFormProps {
  // Basic info
  listTitle: string;
  setListTitle: (v: string) => void;
  detailTitle: string;
  setDetailTitle: (v: string) => void;
  slogan: string;
  setSlogan: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;

  // Categorisation
  gender: string;
  setGender: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  subcategory: string;
  setSubcategory: (v: string) => void;

  // Pricing
  mrp: string;
  setMrp: (v: string) => void;
  sellingPrice: string;
  setSellingPrice: (v: string) => void;

  // Policies
  isReturnable: boolean;
  setIsReturnable: (v: boolean) => void;
  isExchangeable: boolean;
  setIsExchangeable: (v: boolean) => void;
  exchangeWindowDays: string;
  setExchangeWindowDays: (v: string) => void;

  // Tags / keywords
  tags: string;
  setTags: (v: string) => void;
  keywords: string;
  setKeywords: (v: string) => void;

  // Specs
  specs: SpecRow[];
  addSpecRow: () => void;
  removeSpecRow: (i: number) => void;
  updateSpecRow: (i: number, field: keyof SpecRow, value: string) => void;

  // Variants
  variants: VariantRow[];
  addVariantRow: () => void;
  removeVariantRow: (i: number) => void;
  updateVariantRow: (i: number, field: keyof VariantRow, value: string) => void;

  // Add to ProductFormProps interface
  existingImages?: { id: string; url: string }[];
  onRemoveExistingImage?: (id: string) => Promise<void>;
  onReorderExistingImages?: (images: { id: string; url: string }[]) => void;

  // Media
  setImageFiles: (files: File[]) => void;
  setSizeChartFile: (file: File | null) => void;
  setVideoFiles: (files: File[]) => void;

  // Submit
  handleSubmit: () => void;
  saving: boolean;
  error: string;

  mode?: "add" | "edit";
}

// Shared style tokens

const fieldInput =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors text-black placeholder:text-gray-400";

const fieldLabel =
  "block text-[11px] font-mono tracking-widest text-gray-400 uppercase mb-1";

//  Mobile step config

const STEPS = ["Basics", "Details", "Variants", "Media"] as const;

// Section components

function BasicsSection(
  props: Pick<
    ProductFormProps,
    | "listTitle"
    | "setListTitle"
    | "detailTitle"
    | "setDetailTitle"
    | "slogan"
    | "setSlogan"
    | "description"
    | "setDescription"
    | "brand"
    | "setBrand"
  >,
) {
  return (
    <div className="space-y-4">
      <div>
        <label className={fieldLabel}>
          List Title <span className="text-red-400">*</span>
          <span className="normal-case tracking-normal ml-1 text-gray-300">
            (shown in grids)
          </span>
        </label>
        <input
          value={props.listTitle}
          onChange={(e) => props.setListTitle(e.target.value)}
          className={fieldInput}
        />
      </div>
      <div>
        <label className={fieldLabel}>
          Detail Title
          <span className="normal-case tracking-normal ml-1 text-gray-300">
            (shown on product page)
          </span>
        </label>
        <input
          value={props.detailTitle}
          onChange={(e) => props.setDetailTitle(e.target.value)}
          className={fieldInput}
        />
      </div>
      <div>
        <label className={fieldLabel}>Slogan</label>
        <input
          value={props.slogan}
          onChange={(e) => props.setSlogan(e.target.value)}
          className={fieldInput}
        />
      </div>
      <div>
        <label className={fieldLabel}>Description</label>
        <textarea
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          rows={3}
          className={fieldInput}
        />
      </div>
      <div>
        <label className={fieldLabel}>Brand</label>
        <input
          value={props.brand}
          onChange={(e) => props.setBrand(e.target.value)}
          className={fieldInput}
        />
      </div>
    </div>
  );
}

function DetailsSection(
  props: Pick<
    ProductFormProps,
    | "gender"
    | "setGender"
    | "category"
    | "setCategory"
    | "subcategory"
    | "setSubcategory"
    | "mrp"
    | "setMrp"
    | "sellingPrice"
    | "setSellingPrice"
    | "isReturnable"
    | "setIsReturnable"
    | "isExchangeable"
    | "setIsExchangeable"
    | "exchangeWindowDays"
    | "setExchangeWindowDays"
    | "tags"
    | "setTags"
    | "keywords"
    | "setKeywords"
    | "specs"
    | "addSpecRow"
    | "removeSpecRow"
    | "updateSpecRow"
  >,
) {
  return (
    <div className="space-y-4">
      {/* Category row */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={fieldLabel}>Gender</label>
          <select
            value={props.gender}
            onChange={(e) => props.setGender(e.target.value)}
            className={fieldInput}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <div>
          <label className={fieldLabel}>Category</label>
          <select
            value={props.category}
            onChange={(e) => props.setCategory(e.target.value)}
            className={fieldInput}
          >
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
            <option value="footwear">Footwear</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label className={fieldLabel}>Subcategory</label>
          <input
            placeholder="shirt, jeans…"
            value={props.subcategory}
            onChange={(e) => props.setSubcategory(e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>

      {/* Pricing row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={fieldLabel}>
            MRP (₹) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={props.mrp}
            onChange={(e) => props.setMrp(e.target.value)}
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>
            Selling Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={props.sellingPrice}
            onChange={(e) => props.setSellingPrice(e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>

      {/* Policies */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={props.isReturnable}
            onChange={(e) => props.setIsReturnable(e.target.checked)}
            className="rounded"
          />
          Returnable
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={props.isExchangeable}
            onChange={(e) => props.setIsExchangeable(e.target.checked)}
            className="rounded"
          />
          Exchangeable
        </label>
        {props.isExchangeable && (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={props.exchangeWindowDays}
              onChange={(e) => props.setExchangeWindowDays(e.target.value)}
              placeholder="7"
              className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-black outline-none focus:border-gray-900 transition-colors"
            />
            <span className="text-xs text-gray-400">days</span>
          </div>
        )}
      </div>

      {/* Tags & Keywords */}
      <div>
        <label className={fieldLabel}>
          Tags{" "}
          <span className="normal-case tracking-normal text-gray-300">
            (comma separated)
          </span>
        </label>
        <input
          placeholder="new, bestseller"
          value={props.tags}
          onChange={(e) => props.setTags(e.target.value)}
          className={fieldInput}
        />
      </div>
      <div>
        <label className={fieldLabel}>
          Keywords{" "}
          <span className="normal-case tracking-normal text-gray-300">
            (comma separated, optional)
          </span>
        </label>
        <input
          placeholder="oversized, streetwear, loose fit"
          value={props.keywords}
          onChange={(e) => props.setKeywords(e.target.value)}
          className={fieldInput}
        />
      </div>

      {/* Specs */}
      <div>
        <label className={fieldLabel}>Specs</label>
        <div className="space-y-2">
          {props.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Fabric"
                value={spec.label}
                onChange={(e) =>
                  props.updateSpecRow(i, "label", e.target.value)
                }
                className={cn(fieldInput, "flex-1")}
              />
              <input
                placeholder="Cotton"
                value={spec.value}
                onChange={(e) =>
                  props.updateSpecRow(i, "value", e.target.value)
                }
                className={cn(fieldInput, "flex-1")}
              />
              <button
                onClick={() => props.removeSpecRow(i)}
                className="text-gray-300 hover:text-red-500 transition-colors px-1 shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={props.addSpecRow}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors font-mono tracking-wide"
          >
            <Plus size={12} /> Add spec
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantsSection(
  props: Pick<
    ProductFormProps,
    "variants" | "addVariantRow" | "removeVariantRow" | "updateVariantRow"
  >,
) {
  return (
    <div>
      <label className={fieldLabel}>
        Variants <span className="text-red-400">*</span>
        <span className="normal-case tracking-normal ml-1 text-gray-300">
          (color / size / stock)
        </span>
      </label>

      {/* Desktop column headers */}
      <div className="hidden md:grid grid-cols-[1fr_80px_1fr_80px_110px_28px] gap-2 mb-1.5 px-0.5">
        {["Color", "Size", "SKU", "Stock", "Price override", ""].map((h) => (
          <span
            key={h}
            className="text-[10px] font-mono tracking-widest text-gray-400 uppercase"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="space-y-2">
        {props.variants.map((v, i) => (
          <div key={i}>
            {/* Mobile card */}
            <div className="md:hidden border border-gray-100 rounded-xl p-3 bg-gray-50 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                  Color
                </span>
                <input
                  value={v.color}
                  onChange={(e) =>
                    props.updateVariantRow(i, "color", e.target.value)
                  }
                  placeholder="Black"
                  className={fieldInput}
                />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                  Size
                </span>
                <input
                  value={v.size}
                  onChange={(e) =>
                    props.updateVariantRow(i, "size", e.target.value)
                  }
                  placeholder="M"
                  className={fieldInput}
                />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                  SKU
                </span>
                <input
                  value={v.sku}
                  onChange={(e) =>
                    props.updateVariantRow(i, "sku", e.target.value)
                  }
                  placeholder="SKU-001"
                  className={fieldInput}
                />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                  Stock
                </span>
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) =>
                    props.updateVariantRow(i, "stock", e.target.value)
                  }
                  placeholder="0"
                  className={fieldInput}
                />
              </div>
              <div className="col-span-2 flex gap-2 items-end">
                <div className="flex-1">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                    Price override
                  </span>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      props.updateVariantRow(i, "price", e.target.value)
                    }
                    placeholder="Optional"
                    className={fieldInput}
                  />
                </div>
                <button
                  onClick={() => props.removeVariantRow(i)}
                  className="text-gray-300 hover:text-red-500 transition-colors pb-2"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[1fr_80px_1fr_80px_110px_28px] gap-2 items-center">
              <input
                value={v.color}
                onChange={(e) =>
                  props.updateVariantRow(i, "color", e.target.value)
                }
                placeholder="Black"
                className={fieldInput}
              />
              <input
                value={v.size}
                onChange={(e) =>
                  props.updateVariantRow(i, "size", e.target.value)
                }
                placeholder="M"
                className={fieldInput}
              />
              <input
                value={v.sku}
                onChange={(e) =>
                  props.updateVariantRow(i, "sku", e.target.value)
                }
                placeholder="SKU-001"
                className={fieldInput}
              />
              <input
                type="number"
                value={v.stock}
                onChange={(e) =>
                  props.updateVariantRow(i, "stock", e.target.value)
                }
                placeholder="0"
                className={fieldInput}
              />
              <input
                type="number"
                value={v.price}
                onChange={(e) =>
                  props.updateVariantRow(i, "price", e.target.value)
                }
                placeholder="Optional"
                className={fieldInput}
              />
              <button
                onClick={() => props.removeVariantRow(i)}
                className="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={props.addVariantRow}
        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors font-mono tracking-wide"
      >
        <Plus size={12} /> Add variant
      </button>
    </div>
  );
}

function MediaSection(
  props: Pick<
    ProductFormProps,
    | "setImageFiles"
    | "setSizeChartFile"
    | "setVideoFiles"
    | "existingImages"
    | "onRemoveExistingImage"
    | "onReorderExistingImages"
  >,
) {
  const [newImagePreviews, setNewImagePreviews] = useState<
    { file: File; preview: string }[]
  >([]);
  const [videoPreviews, setVideoPreviews] = useState<
    { file: File; preview: string }[]
  >([]);
  const [chartPreview, setChartPreview] = useState<string>("");
  const [chartName, setChartName] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const chartInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<"existing" | "new" | null>(null);

  function handleNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;

    const next = [
      ...newImagePreviews,
      ...incoming.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ];
    setNewImagePreviews(next);
    props.setImageFiles(next.map((p) => p.file)); // outside any updater
    e.target.value = "";
  }

  function handleVideos(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;

    const next = [
      ...videoPreviews,
      ...incoming.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ];
    setVideoPreviews(next);
    props.setVideoFiles(next.map((p) => p.file)); // outside
    e.target.value = "";
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(newImagePreviews[index].preview);
    const next = newImagePreviews.filter((_, i) => i !== index);
    setNewImagePreviews(next);
    props.setImageFiles(next.map((p) => p.file)); // outside
  }

  function removeNewVideo(index: number) {
    URL.revokeObjectURL(videoPreviews[index].preview);
    const next = videoPreviews.filter((_, i) => i !== index);
    setVideoPreviews(next);
    props.setVideoFiles(next.map((p) => p.file)); // outside
  }

  function onNewDrop(i: number) {
    if (dragIndex === null || dragSource !== "new") return;
    const next = [...newImagePreviews];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    setNewImagePreviews(next);
    props.setImageFiles(next.map((p) => p.file)); // outside
    setDragIndex(null);
    setDragOver(null);
    setDragSource(null);
  }

  function handleSizeChart(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    props.setSizeChartFile(file);
    setChartName(file?.name ?? "");
    setChartPreview(file ? URL.createObjectURL(file) : "");
    e.target.value = "";
  }

  // Drag handlers for existing images
  function onExistingDragStart(i: number) {
    setDragIndex(i);
    setDragSource("existing");
  }
  function onExistingDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDragOver(i);
  }
  function onExistingDrop(i: number) {
    if (dragIndex === null || dragSource !== "existing") return;
    const imgs = [...(props.existingImages ?? [])];
    const [moved] = imgs.splice(dragIndex, 1);
    imgs.splice(i, 0, moved);
    props.onReorderExistingImages?.(imgs);
    setDragIndex(null);
    setDragOver(null);
    setDragSource(null);
  }

  // Drag handlers for new images
  function onNewDragStart(i: number) {
    setDragIndex(i);
    setDragSource("new");
  }
  function onNewDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDragOver(i);
  }

  return (
    <div className="space-y-6">
      {/* Existing images (edit mode)  */}
      {props.existingImages && props.existingImages.length > 0 && (
        <div>
          <label className={fieldLabel}>
            Current Images
            <span className="normal-case tracking-normal ml-1 text-gray-300">
              (drag to reorder)
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            {props.existingImages.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => onExistingDragStart(i)}
                onDragOver={(e) => onExistingDragOver(e, i)}
                onDrop={() => onExistingDrop(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOver(null);
                }}
                className={cn(
                  "relative group w-24 h-24 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all duration-150",
                  dragOver === i && dragSource === "existing"
                    ? "border-gray-900 scale-105"
                    : "border-gray-200",
                )}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono rounded px-1 leading-4">
                  {i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => props.onRemoveExistingImage?.(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[9px] font-mono text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  DRAG
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product images */}
      <div>
        <label className={fieldLabel}>
          {props.existingImages?.length ? "Add More Images" : "Product Images"}
        </label>

        {/* Button instead of label wrapper — fixes mobile */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors text-center gap-2 mb-3"
        >
          <Upload size={18} className="text-gray-300" />
          <span className="text-xs text-gray-400 font-mono tracking-wide">
            Tap to add images · JPG, PNG, WEBP
          </span>
          <span className="text-[10px] text-gray-300 font-mono">
            Multiple picks accumulate
          </span>
        </button>
        {/* Hidden input, NOT inside a label */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleNewImages}
          className="hidden"
        />

        {newImagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {newImagePreviews.map((item, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => onNewDragStart(i)}
                onDragOver={(e) => onNewDragOver(e, i)}
                onDrop={() => onNewDrop(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOver(null);
                }}
                className={cn(
                  "relative group w-24 h-24 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all duration-150",
                  dragOver === i && dragSource === "new"
                    ? "border-gray-900 scale-105"
                    : "border-gray-200",
                )}
              >
                <img
                  src={item.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono rounded px-1 leading-4">
                  {i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[9px] font-mono text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  DRAG
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Size chart  */}
      <div>
        <label className={fieldLabel}>Size Chart</label>
        <button
          type="button"
          onClick={() => chartInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors text-center gap-2"
        >
          {chartPreview ? (
            <img
              src={chartPreview}
              alt="Size chart"
              className="max-h-32 object-contain rounded"
            />
          ) : (
            <>
              <Upload size={18} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-mono tracking-wide">
                {chartName || "Tap to upload · Optional"}
              </span>
            </>
          )}
        </button>
        <input
          ref={chartInputRef}
          type="file"
          accept="image/*"
          onChange={handleSizeChart}
          className="hidden"
        />
        {chartPreview && (
          <button
            type="button"
            onClick={() => {
              props.setSizeChartFile(null);
              setChartPreview("");
              setChartName("");
            }}
            className="mt-1.5 text-xs text-red-400 hover:text-red-600 font-mono"
          >
            Remove size chart
          </button>
        )}
      </div>

      {/* Videos  */}
      <div>
        <label className={fieldLabel}>Product Videos</label>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors text-center gap-2 mb-3"
        >
          <Upload size={18} className="text-gray-300" />
          <span className="text-xs text-gray-400 font-mono tracking-wide">
            Tap to add videos · MP4, MOV — optional
          </span>
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideos}
          className="hidden"
        />

        {videoPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {videoPreviews.map((item, i) => (
              <div
                key={i}
                className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50"
              >
                <video
                  src={item.preview}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) =>
                    (e.currentTarget as HTMLVideoElement).play()
                  }
                  onMouseLeave={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    v.pause();
                    v.currentTime = 0;
                  }}
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono rounded px-1 leading-4">
                  {i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeNewVideo(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Desktop accordion wrapper

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {open ? (
          <ChevronDown size={15} className="text-gray-400" />
        ) : (
          <ChevronRight size={15} className="text-gray-400" />
        )}
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

// Main export

export function ProductForm(props: ProductFormProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const stepContent = [
    <BasicsSection key="basics" {...props} />,
    <DetailsSection key="details" {...props} />,
    <VariantsSection key="variants" {...props} />,
    <MediaSection key="media" {...props} />,
  ];

  // Mobile: step wizard

  if (isMobile) {
    return (
      <div className="min-h-dvh flex flex-col bg-white">
        {/* Sticky step header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 pt-5 pb-4">
          <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-3">
            Step {step + 1} of {STEPS.length}
          </p>
          <div className="flex gap-1.5 mb-3">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  i < step
                    ? "bg-gray-900"
                    : i === step
                      ? "bg-gray-500"
                      : "bg-gray-200",
                )}
              />
            ))}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{STEPS[step]}</h2>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {stepContent[step]}
          {props.error && step === STEPS.length - 1 && (
            <p className="text-xs text-red-500 mt-4">{props.error}</p>
          )}
        </div>

        {/* Sticky bottom nav */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={props.handleSubmit}
              disabled={props.saving}
              className="flex-1 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 hover:bg-gray-800 transition-colors"
            >
              {props.saving ? "Saving…" : "Add Product"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Desktop: accordion

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-900">Add Product</h1>
        <button
          onClick={props.handleSubmit}
          disabled={props.saving}
          className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Check size={14} />
          {props.saving ? "Saving…" : "Add Product"}
        </button>
      </div>

      {props.error && (
        <p className="text-xs text-red-500 mb-5">{props.error}</p>
      )}

      <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 px-6">
        <AccordionSection title="Basic Info" defaultOpen>
          <BasicsSection {...props} />
        </AccordionSection>
        <AccordionSection title="Details & Pricing">
          <DetailsSection {...props} />
        </AccordionSection>
        <AccordionSection title="Variants">
          <VariantsSection {...props} />
        </AccordionSection>
        <AccordionSection title="Media">
          <MediaSection {...props} />
        </AccordionSection>
      </div>
    </div>
  );
}
