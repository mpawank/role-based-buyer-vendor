// /app/api/buyer/[id]/products/route.ts
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const buyerId = params.id;

  if (!buyerId) {
    return NextResponse.json({ error: "Buyer ID is required" }, { status: 400 });
  }

  try {
    const products = await Product.find({ buyerId }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching products", details: String(err) }, { status: 500 });
  }
}
