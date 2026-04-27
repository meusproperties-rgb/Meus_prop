import { PropertyForm } from '@/components/admin/PropertyForm';
import { AdminPageIntro } from '@/components/admin/AdminUI';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-4">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Link>
        <AdminPageIntro
          eyebrow="Listings"
          title="Create new property"
          description="Add the copy, pricing, location, media, and visibility settings for the new listing."
        />
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}
