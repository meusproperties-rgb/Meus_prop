import type { Metadata } from 'next';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertiesMobileFilter, PropertiesPagination } from '@/components/property/PropertiesMobileFilter';
import { getPublicProperties } from '@/lib/public-properties';

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse luxury properties for sale and rent in Dubai. Villas, penthouses, apartments and more.',
};

export const dynamic = 'force-dynamic';

interface PropertiesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const data = await getPublicProperties(searchParams);
  const activeFilterCount = Object.entries(searchParams).filter(
    ([key, value]) => typeof value === 'string' && value && key !== 'page' && key !== 'limit'
  ).length;

  return (
    <div className="bg-background pb-20 pt-20 text-foreground">
      <section className="border-b border-border bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Property Search</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Our Properties</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/65">
            Browse Dubai&apos;s most exclusive luxury properties with live listings pulled directly from your backend.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-background/95">
        <div className="container mx-auto px-6 py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                {data.total} listing{data.total === 1 ? '' : 's'} found
              </p>
              <p className="text-sm text-muted-foreground">
                {activeFilterCount > 0
                  ? `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'} applied`
                  : 'Use the filters below to narrow by district, type, price, and more.'}
              </p>
            </div>
            <div className="md:hidden">
              <PropertiesMobileFilter />
            </div>
          </div>

          <div className="hidden md:block">
            <PropertyFilters variant="toolbar" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        {data.items.length === 0 ? (
          <div className="border border-border bg-card px-8 py-16 text-center">
            <p className="text-lg text-foreground">No properties matched your filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try broadening your search, price range, or district.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <PropertiesPagination
            currentPage={data.page}
            totalPages={data.totalPages}
            searchParams={searchParams}
          />
        </div>
      </section>
    </div>
  );
}
