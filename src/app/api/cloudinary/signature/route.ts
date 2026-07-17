import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const UPLOAD_FOLDER = 'meus-realestate/properties';
const UPLOAD_TRANSFORMATION = 'w_1920,h_1080,c_limit,q_auto,f_auto';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { success: false, error: 'Cloudinary is not configured' },
      { status: 500 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER, transformation: UPLOAD_TRANSFORMATION },
    apiSecret
  );

  return NextResponse.json({
    success: true,
    data: {
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder: UPLOAD_FOLDER,
      transformation: UPLOAD_TRANSFORMATION,
    },
  });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
