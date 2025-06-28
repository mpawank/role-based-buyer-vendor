// ==============================
// FILE: /app/api/admin/products/route.ts
// PURPOSE: Admin can view all products with buyer/vendor info
// ==============================

import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User'; // ✅ Ensure User schema is registered
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate('buyerId', 'name email')       // Populate buyer details
      .populate('assignedTo', 'name email');   // Populate assigned vendor details

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error('[GET] /api/admin/products error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products',
        error: String(err),
      },
      { status: 500 }
    );
  }
}
