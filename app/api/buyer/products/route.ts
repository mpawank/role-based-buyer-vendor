import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or malformed token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { buyerId?: string };

    if (!decoded.buyerId) {
      return NextResponse.json({ error: 'Invalid token: buyerId missing' }, { status: 403 });
    }

    const products = await Product.find({ buyerId: decoded.buyerId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    console.error('❌ GET error:', err);
    return NextResponse.json(
      {
        error: 'Token validation failed or DB error',
        details: err.message || String(err),
      },
      { status: 403 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or malformed token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { buyerId?: string };

    if (!decoded.buyerId) {
      return NextResponse.json({ error: 'Invalid token: buyerId missing' }, { status: 403 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.price || !Array.isArray(body.images)) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = new Product({
      ...body,
      buyerId: decoded.buyerId,
    });

    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error('❌ POST error:', err);
    return NextResponse.json(
      {
        error: 'Failed to create product',
        details: err.message || String(err),
      },
      { status: 500 }
    );
  }
}
