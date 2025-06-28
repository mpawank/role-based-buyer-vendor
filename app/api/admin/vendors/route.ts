import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    await connectDB();
    const admin = await User.findOne({ email: decoded.email });

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const vendors = await User.find({ role: 'vendor' }).select('_id name email');

    console.log('✔️ Vendors found:', vendors); // Debug log

    return NextResponse.json(vendors);
  } catch (err) {
    console.error('❌ Vendor Fetch Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
