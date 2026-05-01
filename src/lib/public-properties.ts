import { Op, type Order, type OrderItem, type WhereOptions } from 'sequelize';
import type { PaginatedResponse, Property } from '@/types/index';
import { ensureDatabase, Property as PropertyModel, PropertyImage, User } from '@/lib/db/index';
import { isUuid } from '@/lib/utils';
import { propertyFilterSchema } from '@/lib/validations/index';
import type { PropertyAttributes } from '@/lib/db/models/Property';

function buildPublicWhereClause(
  searchParams: Record<string, string | string[] | undefined>
): {
  page: number;
  limit: number;
  sortBy: string;
  where: WhereOptions<PropertyAttributes>;
} {
  const normalizedParams = Object.fromEntries(
    Object.entries(searchParams).filter(([, value]) => typeof value === 'string' && value)
  ) as Record<string, string>;

  const parsed = propertyFilterSchema.parse({
    ...normalizedParams,
    page: normalizedParams.page ? parseInt(normalizedParams.page, 10) : 1,
    limit: normalizedParams.limit ? parseInt(normalizedParams.limit, 10) : 12,
    minPrice: normalizedParams.minPrice ? parseFloat(normalizedParams.minPrice) : undefined,
    maxPrice: normalizedParams.maxPrice ? parseFloat(normalizedParams.maxPrice) : undefined,
    minBedrooms: normalizedParams.minBedrooms ? parseInt(normalizedParams.minBedrooms, 10) : undefined,
    maxBedrooms: normalizedParams.maxBedrooms ? parseInt(normalizedParams.maxBedrooms, 10) : undefined,
    isFeatured: normalizedParams.isFeatured === 'true' ? true : undefined,
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

  return {
    page: parsed.page,
    limit: parsed.limit,
    sortBy: parsed.sortBy,
    where,
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

function serializeProperty(
  property: Omit<Property, 'createdAt' | 'updatedAt'> & { createdAt: string | Date; updatedAt: string | Date }
): Property {
  return {
    ...(property as Omit<Property, 'createdAt' | 'updatedAt'>),
    createdAt: new Date(property.createdAt).toISOString(),
    updatedAt: new Date(property.updatedAt).toISOString(),
  };
}

export async function getPublicProperties(
  searchParams: Record<string, string | string[] | undefined>
): Promise<PaginatedResponse<Property>> {
  try {
    await ensureDatabase();

    const { page, limit, sortBy, where } = buildPublicWhereClause(searchParams);
    const offset = (page - 1) * limit;
    const selectedOrder = (orderMap[sortBy] || orderMap.newest) as OrderItem[];

    const { count, rows } = await PropertyModel.findAndCountAll({
      where,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          required: false,
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'avatar'],
        },
      ],
      order: [
        ...selectedOrder,
        [{ model: PropertyImage, as: 'images' }, 'order', 'ASC'],
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows.map((property) => serializeProperty(property.toJSON())),
      total: count,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    };
  } catch (error) {
    console.error('getPublicProperties error:', error);
    return { items: [], total: 0, page: 1, limit: 12, totalPages: 1 };
  }
}

export async function getFeaturedPublicProperties(limit = 6): Promise<Property[]> {
  const data = await getPublicProperties({
    isFeatured: 'true',
    limit: String(limit),
    sortBy: 'newest',
  });

  return data.items;
}

export async function getPublicProperty(id: string, incrementView = true): Promise<Property | null> {
  try {
    await ensureDatabase();

    const property = await PropertyModel.findOne({
      where: {
        isActive: true,
        ...(isUuid(id) ? { id } : { slug: id }),
      },
      include: [
        {
          model: PropertyImage,
          as: 'images',
          required: false,
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'avatar'],
        },
      ],
      order: [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']],
    });

    if (!property) {
      return null;
    }

    if (incrementView) {
      await property.increment('viewCount');
      await property.reload();
    }

    return serializeProperty(property.toJSON());
  } catch (error) {
    console.error('getPublicProperty error:', error);
    return null;
  }
}
