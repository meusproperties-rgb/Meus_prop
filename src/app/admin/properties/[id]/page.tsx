import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '@/components/admin/PropertyForm';
import type { Property } from '@/types/index';

async function getProperty(id: string): Promise<Property | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/properties" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <h1 className="font-display text-2xl font-bold">Edit Property</h1>
        <p className="text-muted-foreground text-sm truncate">{property.title}</p>
      </div>
      <PropertyForm property={property} mode="edit" />
    </div>
  );
}
