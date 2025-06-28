// ========================
// FILE: /app/api/admin/assign/[id]/route.ts
// PURPOSE: Assign a vendor to a product (Admin Only)
// ========================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id: productId } = context.params;
    const { vendorId } = await req.json();

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    await connectDB();

    const adminUser = await User.findOne({ email: decoded.email });
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { assignedTo: vendorId },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('[PUT] /api/admin/assign/[id]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}
