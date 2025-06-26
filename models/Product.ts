import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku?: string;
  slug?: string;
  brand?: string;
  price: number;
  stock: number;
  discount?: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  images: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String },
    slug: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    comparePrice: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
