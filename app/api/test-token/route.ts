import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  const testUser = {
    email: 'test@vendor.com',
    role: 'vendor',
    name: 'Test Vendor'
  };

  const token = jwt.sign(testUser, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  return NextResponse.json({
    token,
    decoded: jwt.decode(token),
    instructions: 'Use this token in Authorization header as: Bearer <token>'
  });
}