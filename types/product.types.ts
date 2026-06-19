// product.types.ts

export interface Product {
  id: string;

  name: string;

  price: number;

  stock: number;

  category?: string;

  description?: string;

  images?: string[];
}

export type ProductInsert = Omit<Product, "id">;

export type ProductUpdate = Partial<ProductInsert>;

// ----------------------------
// Form types
// ----------------------------

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "toggle"
  | "multiselect"
  | "image";

export interface FormField {
  name: keyof ProductInsert;
  label: string;
  type: FieldType;

  placeholder?: string;

  required?: boolean;

  span?: "half" | "full";

  options?: string[];
}

// ----------------------------
// Form configuration
// ----------------------------

export const PRODUCT_FORM_FIELDS: FormField[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    placeholder: "Enter product name",
    required: true,
  },

  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "0",
    required: true,
  },

  {
    name: "stock",
    label: "Stock",
    type: "number",
    placeholder: "0",
    required: true,
  },

  {
    name: "category",
    label: "Category",
    type: "text",
    placeholder: "Men > Shirt",
  },

  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Write product description",
    span: "full",
  },

  {
    name: "images",
    label: "Images",
    type: "image",
    span: "full",
  },
];