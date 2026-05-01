import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensureDatabase, Property, PropertyImage } from '@/lib/db/index';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

type Params = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await ensureDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const property = await Property.findByPk(params.id);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const body = await request.json();
    const { images } = body as { images: Array<{ base64: string; caption?: string }> };

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, error: 'No images provided' }, { status: 400 });
    }

    if (images.length > 20) {
      return NextResponse.json({ success: false, error: 'Max 20 images per upload' }, { status: 400 });
    }

    // Get current max order
    const existingCount = await PropertyImage.count({ where: { propertyId: params.id } });

    const uploaded = await Promise.all(
      images.map(async (img, index) => {
        const { url, publicId } = await uploadImage(img.base64);
        return PropertyImage.create({
          propertyId: params.id,
          url,
          publicId,
          caption: img.caption || null,
          order: existingCount + index,
        });
      })
    );

    // Set first image as cover if none exists
    if (!property.coverImage && uploaded.length > 0) {
      await property.update({ coverImage: uploaded[0].url });
    }

    return NextResponse.json({ success: true, data: uploaded }, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    const message = error instanceof Error ? error.message : 'Image upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await ensureDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { imageId } = body as { imageId: string };

    const image = await PropertyImage.findOne({
      where: { id: imageId, propertyId: params.id },
    });

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (image.publicId) {
      await deleteImage(image.publicId).catch(console.error);
    }

    await image.destroy();

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
