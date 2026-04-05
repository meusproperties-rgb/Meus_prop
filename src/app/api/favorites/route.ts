import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Favorite, Property, PropertyImage, User } from '@/lib/db/index';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await Favorite.findAll({
      where: { userId: session.user.id },
      include: [
        {
          model: Property,
          as: 'property',
          where: { isActive: true },
          include: [
            { model: PropertyImage, as: 'images', limit: 1, order: [['order', 'ASC']] },
            { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone'] },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId: session.user.id, propertyId },
    });

    if (!created) {
      return NextResponse.json({ success: false, error: 'Already in favorites' }, { status: 409 });
    }

    return NextResponse.json({ success: true, data: favorite }, { status: 201 });
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    const deleted = await Favorite.destroy({
      where: { userId: session.user.id, propertyId },
    });

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
