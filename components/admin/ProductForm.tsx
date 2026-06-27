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

  // Media — single ordered list, mixed images + videos
  mediaItems: MediaItem[];
  setMediaItems: (items: MediaItem[]) => void;
  setSizeChartFile: (file: File | null) => void;

  // Submit
  handleSubmit: () => void;
  saving: boolean;
  error: string;

  mode?: "add" | "edit";
}

// media data shape
export type MediaType = "image" | "video";

export type MediaItem =
  | { kind: "existing"; id: string; url: string; type: MediaType }
  | { kind: "new"; tempId: string; file: File; type: MediaType; preview: string };


// Shared style tokens

const fieldInput =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors text-black placeholder:text-gray-400";

const fieldLabel =
  "block text-[14px] font-mono tracking-widest text-gray-600 uppercase mb-1";

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
  props: Pick<ProductFormProps, "mediaItems" | "setMediaItems" | "setSizeChartFile">,
) {
  const { mediaItems, setMediaItems } = props;

  const [chartPreview, setChartPreview] = useState<string>("");
  const [chartName, setChartName] = useState<string>("");

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const chartInputRef = useRef<HTMLInputElement>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  function handleNewMedia(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;

    const newItems: MediaItem[] = incoming.map((file) => ({
      kind: "new",
      tempId: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      type: file.type.startsWith("video") ? "video" : "image",
      preview: URL.createObjectURL(file),
    }));

    setMediaItems([...mediaItems, ...newItems]);
    e.target.value = "";
  }

  function removeMedia(index: number) {
    const item = mediaItems[index];
    if (item.kind === "new") URL.revokeObjectURL(item.preview);
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  }

  function onDrop(i: number) {
    if (dragIndex === null) return;
    const next = [...mediaItems];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    setMediaItems(next);
    setDragIndex(null);
    setDragOver(null);
  }

  function handleSizeChart(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    props.setSizeChartFile(file);
    setChartName(file?.name ?? "");
    setChartPreview(file ? URL.createObjectURL(file) : "");
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Unified media */}
      <div>
        <label className={fieldLabel}>
          Media
          <span className="normal-case tracking-normal ml-1 text-gray-300">
            (drag to reorder — this order is shown to customers)
          </span>
        </label>

        <button
          type="button"
          onClick={() => mediaInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors text-center gap-2 mb-3"
        >
          <Upload size={18} className="text-gray-300" />
          <span className="text-xs text-gray-400 font-mono tracking-wide">
            Tap to add photos & videos · JPG, PNG, WEBP, MP4, MOV
          </span>
          <span className="text-[10px] text-gray-300 font-mono">
            Multiple picks accumulate
          </span>
        </button>
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleNewMedia}
          className="hidden"
        />

        {mediaItems.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {mediaItems.map((item, i) => {
              const src = item.kind === "existing" ? item.url : item.preview;
              return (
                <div
                  key={item.kind === "existing" ? item.id : item.tempId}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(i);
                  }}
                  onDrop={() => onDrop(i)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOver(null);
                  }}
                  className={cn(
                    "relative group w-24 h-24 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all duration-150 bg-gray-50",
                    dragOver === i ? "border-gray-900 scale-105" : "border-gray-200",
                  )}
                >
                  {item.type === "video" ? (
                    <video
                      src={src}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  )}

                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono rounded px-1 leading-4">
                    {i + 1}
                  </div>
                  {item.type === "video" && (
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono rounded px-1 leading-4">
                      VIDEO
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[9px] font-mono text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    DRAG
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Size chart — unchanged, stays separate since it's not part of the gallery */}
      <div>
        <label className={fieldLabel}>Size Chart</label>
        <button
          type="button"
          onClick={() => chartInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors text-center gap-2"
        >
          {chartPreview ? (
            <img src={chartPreview} alt="Size chart" className="max-h-32 object-contain rounded" />
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
