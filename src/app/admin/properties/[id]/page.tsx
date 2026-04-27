import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { AdminPageIntro } from '@/components/admin/AdminUI';
import type { Property } from '@/types/index';
import { ensureDatabase, Property as PropertyModel, PropertyImage, User } from '@/lib/db/index';

function serializeProperty(
  property: Omit<Property, 'createdAt' | 'updatedAt'> & { createdAt: string | Date; updatedAt: string | Date }
): Property {
  return {
    ...(property as Omit<Property, 'createdAt' | 'updatedAt'>),
    createdAt: new Date(property.createdAt).toISOString(),
    updatedAt: new Date(property.updatedAt).toISOString(),
  };
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    await ensureDatabase();
    const property = await PropertyModel.findByPk(id, {
      include: [
        { model: PropertyImage, as: 'images', required: false },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone', 'avatar'] },
      ],
    });
    return property ? serializeProperty(property.toJSON()) : null;
  } catch {
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-4">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Link>
        <AdminPageIntro
          eyebrow="Listings"
          title="Edit property"
          description={property.title}
        />
      </div>
      <PropertyForm property={property} mode="edit" />
    </div>
  );
}
