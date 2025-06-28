// /app/api/admin/products/route.ts
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("buyerId", "name email")  // shows buyer's name and email
      .populate("assignedTo", "name email"); // optional: show assigned vendor info

    return NextResponse.json(products);
  } catch (err) {
    console.error("[GET] /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products", details: String(err) },
      { status: 500 }
    );
  }
}
