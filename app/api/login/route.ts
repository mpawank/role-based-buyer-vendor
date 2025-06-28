import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Payload for JWT
    const payload: Record<string, any> = {
      email: user.email,
      role: user.role,
      _id: user._id, // Always include _id
    };

    if (user.role === 'buyer') {
      payload.buyerId = user._id;
    } else {
      payload.userId = user._id;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        role: user.role,
        _id: user._id,
        name: user.name,
        image: user.image,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
