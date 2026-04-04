import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Property, PropertyImage, User, Enquiry } from '@/lib/db/index';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const [
      totalProperties,
      activeProperties,
      featuredProperties,
      totalEnquiries,
      pendingEnquiries,
      totalUsers,
      recentProperties,
      recentEnquiries,
    ] = await Promise.all([
      Property.count(),
      Property.count({ where: { isActive: true } }),
      Property.count({ where: { isFeatured: true, isActive: true } }),
      Enquiry.count(),
      Enquiry.count({ where: { status: 'pending' } }),
      User.count({ where: { role: 'user' } }),
      Property.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: PropertyImage, as: 'images', limit: 1, order: [['order', 'ASC']] }],
      }),
      Enquiry.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [
          { model: Property, as: 'property', attributes: ['id', 'title', 'slug'] },
        ],
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        activeProperties,
        featuredProperties,
        totalEnquiries,
        pendingEnquiries,
        totalUsers,
        recentProperties,
        recentEnquiries,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
