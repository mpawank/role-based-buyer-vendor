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
  buyerId: Types.ObjectId; // buyer who created the product
  vendorId?: Types.ObjectId; // optional vendor assignment
  buyerEmail?: string; // email of the buyer who listed it
  assignedTo?: Types.ObjectId; // vendor ID to whom the product is assigned
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

    // 💡 New fields for Admin flow
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    buyerEmail: { type: String }, // to track who listed it
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // vendor ID

  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
