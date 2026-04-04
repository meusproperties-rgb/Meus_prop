import { Suspense } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertiesMobileFilter, PropertiesPagination } from '@/components/property/PropertiesMobileFilter';
import type { Metadata } from 'next';
import { getMockProperties } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse luxury properties for sale and rent in Dubai. Villas, penthouses, apartments and more.',
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const data = getMockProperties(searchParams);
  const properties = data.items || [];
  const total = data.total || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = parseInt(String(searchParams.page || '1'));

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-primary py-16">
        <div className="container mx-auto px-6">
          <p className="section-label mb-3">Listings</p>
          <h1 className="font-display text-3xl text-primary-foreground leading-tight mb-6 tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {searchParams.status === 'for_sale' ? 'Properties For Sale' :
             searchParams.status === 'for_rent' ? 'Properties For Rent' :
             searchParams.isFeatured ? 'Featured Properties' :
             'All Properties'}
          </h1>
          <p className="text-base text-white/55 md:text-lg">
            {total > 0 ? `${total.toLocaleString()} properties found` : 'No properties found'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 border border-white/10 bg-card p-6 shadow-sm">
              <Suspense fallback={<div className="h-96 shimmer rounded-xl" />}>
                <PropertyFilters />
              </Suspense>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <Suspense fallback={null}>
                <PropertiesMobileFilter />
              </Suspense>
            </div>

            {/* Results */}
            {properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                <Suspense fallback={null}>
                  <PropertiesPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    searchParams={searchParams}
                  />
                </Suspense>
              </>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-medium mb-3 tracking-tight">No Properties Found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-base md:text-lg">
                  Try adjusting your filters or search terms to find more properties.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
