// /app/api/admin/products/assign/route.ts
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await connectDB();
  const { productId, vendorId } = await req.json();

  const product = await Product.findByIdAndUpdate(productId, { vendorId }, { new: true });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json({ message: "Assigned", product });
}
// export async function DELETE(req: Request) {
//   await connectDB();
//   const { productId } = await req.json();

//   const product = await Product.findByIdAndUpdate(productId, { vendorId: null }, { new: true });

//   if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

//   return NextResponse.json({ message: "Unassigned", product });
// }