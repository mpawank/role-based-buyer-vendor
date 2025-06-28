// ========================
// FILE: /app/api/buyer/products/[productId]/route.ts
// PURPOSE: Get or update a specific product by ID
// ========================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, context: { params: { productId: string } }) {
  await connectDB();

  const { productId } = context.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('GET /buyer/products/[productId] error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: { params: { productId: string } }) {
  await connectDB();

  const { productId } = context.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ success: false, message: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(productId, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('PUT /buyer/products/[productId] error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
}
