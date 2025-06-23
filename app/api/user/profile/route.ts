import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const file = formData.get('file') as File;

    let imageUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profile_pics', resource_type: 'image' },
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = result.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      {
        ...(name && { name }),
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }
}
