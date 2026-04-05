import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Op, WhereOptions } from 'sequelize';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { Property, PropertyImage, User, Favorite } from '@/lib/db/index';
import { propertySchema } from '@/lib/validations/index';
type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Find by UUID or slug
    const where: WhereOptions = id.includes('-') && id.length > 30
      ? { id }
      : { [Op.or]: [{ id }, { slug: id }] };

    const property = await Property.findOne({
      where,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          order: [['order', 'ASC']],
          required: false,
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'avatar'],
        },
      ],
    });

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Increment view count
    await property.increment('viewCount');

    // Check if user has favorited
    const session = await getServerSession(authOptions);
    let isFavorited = false;
    if (session?.user?.id) {
      const fav = await Favorite.findOne({
        where: { userId: session.user.id, propertyId: property.id },
      });
      isFavorited = !!fav;
    }

    return NextResponse.json({
      success: true,
      data: { ...property.toJSON(), isFavorited },
    });
  } catch (error) {
    console.error('Property GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const property = await Property.findByPk(params.id);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = propertySchema.partial().parse(body);

    await property.update({
      ...validated,
      price: validated.price !== undefined ? Number(validated.price) : undefined,
      area: validated.area !== undefined ? Number(validated.area) : undefined,
    });

    const updated = await Property.findByPk(params.id, {
      include: [
        { model: PropertyImage, as: 'images', order: [['order', 'ASC']] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone', 'avatar'] },
      ],
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Property PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const property = await Property.findByPk(params.id);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    await property.destroy();
    return NextResponse.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('Property DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
