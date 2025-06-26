import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  if (!data.name || typeof data.price !== "number" || !data.images?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await Product.create(data);
  return NextResponse.json({ message: "Product created", product }, { status: 201 });
}
