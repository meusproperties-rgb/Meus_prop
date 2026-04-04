import { PropertyForm } from '@/components/admin/PropertyForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/properties" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <h1 className="font-display text-2xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground text-sm">Fill in the details to list a new property.</p>
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}
