import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Op, WhereOptions, Order } from 'sequelize';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { Property, PropertyImage, User, Favorite } from '@/lib/db/index';
import { propertySchema, propertyFilterSchema } from '@/lib/validations/index';
import { generateSlug } from '@/lib/utils/index';
import { PropertyAttributes } from '@/lib/db/models/Property';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const parsed = propertyFilterSchema.parse({
      ...params,
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 12,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      minBedrooms: params.minBedrooms ? parseInt(params.minBedrooms) : undefined,
      maxBedrooms: params.maxBedrooms ? parseInt(params.maxBedrooms) : undefined,
      isFeatured: params.isFeatured === 'true' ? true : undefined,
    });

    const where: WhereOptions<PropertyAttributes> = { isActive: true };

    if (parsed.search) {
      (where as Record<string, unknown>)[Op.or as unknown as string] = [
        { title: { [Op.iLike]: `%${parsed.search}%` } },
        { description: { [Op.iLike]: `%${parsed.search}%` } },
        { address: { [Op.iLike]: `%${parsed.search}%` } },
        { district: { [Op.iLike]: `%${parsed.search}%` } },
        { city: { [Op.iLike]: `%${parsed.search}%` } },
      ];
    }
    if (parsed.type) where.type = parsed.type;
    if (parsed.status) where.status = parsed.status;
    if (parsed.city) where.city = { [Op.iLike]: `%${parsed.city}%` };
    if (parsed.district) where.district = { [Op.iLike]: `%${parsed.district}%` };
    if (parsed.furnishing) where.furnishing = parsed.furnishing;
    if (parsed.isFeatured !== undefined) where.isFeatured = parsed.isFeatured;

    if (parsed.minPrice !== undefined || parsed.maxPrice !== undefined) {
      where.price = {
        ...(parsed.minPrice !== undefined ? { [Op.gte]: parsed.minPrice } : {}),
        ...(parsed.maxPrice !== undefined ? { [Op.lte]: parsed.maxPrice } : {}),
      };
    }

    if (parsed.minBedrooms !== undefined || parsed.maxBedrooms !== undefined) {
      where.bedrooms = {
        ...(parsed.minBedrooms !== undefined ? { [Op.gte]: parsed.minBedrooms } : {}),
        ...(parsed.maxBedrooms !== undefined ? { [Op.lte]: parsed.maxBedrooms } : {}),
      };
    }

    const orderMap: Record<string, Order> = {
      price_asc: [['price', 'ASC']],
      price_desc: [['price', 'DESC']],
      newest: [['createdAt', 'DESC']],
      oldest: [['createdAt', 'ASC']],
      area_asc: [['area', 'ASC']],
      area_desc: [['area', 'DESC']],
    };

    const offset = (parsed.page - 1) * parsed.limit;

    // Check if user is logged in for favorites
    const session = await getServerSession(authOptions);

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          limit: 1,
          order: [['order', 'ASC']],
          required: false,
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'avatar'],
        },
      ],
      order: orderMap[parsed.sortBy] || [['createdAt', 'DESC']],
      limit: parsed.limit,
      offset,
      distinct: true,
    });

    // Add isFavorited flag for logged-in users
    let favoriteIds: Set<string> = new Set();
    if (session?.user?.id) {
      const favorites = await Favorite.findAll({
        where: { userId: session.user.id },
        attributes: ['propertyId'],
      });
      favoriteIds = new Set(favorites.map((f) => f.propertyId));
    }

    const properties = rows.map((p) => ({
      ...p.toJSON(),
      isFavorited: favoriteIds.has(p.id),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: properties,
        total: count,
        page: parsed.page,
        limit: parsed.limit,
        totalPages: Math.ceil(count / parsed.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Properties GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validated = propertySchema.parse(body);

    const slug = generateSlug(validated.title);

    const property = await Property.create({
      ...validated,
      slug,
      userId: session.user.id,
      price: Number(validated.price),
      area: Number(validated.area),
    });

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Properties POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
