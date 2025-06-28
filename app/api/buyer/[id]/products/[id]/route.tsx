import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Product from '@/models/Product';

// GET /api/buyer/products/[id]
export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  await connectDB();

  const { id } = context.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT /api/buyer/products/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();

  const { id } = context.params;
  const body = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
