import mongoose, { Schema, Document, Types } from "mongoose";

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
  buyerId: Types.ObjectId;
  vendorId?: Types.ObjectId;
  buyerEmail?: string;
  assignedTo?: Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: String,
  slug: String,
  brand: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  comparePrice: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  images: { type: [String], default: [] },
 buyerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User', // ✅ Must be 'User'
  required: true,
},


  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  buyerEmail: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);