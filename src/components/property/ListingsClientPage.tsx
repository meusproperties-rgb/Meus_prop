'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatSitePrice, siteLocations, siteProperties } from '@/lib/site-properties';

export default function ListingsClientPage() {
  const [tab, setTab] = useState<'buy' | 'rent'>('buy');
  const [location, setLocation] = useState('All');
  const [bedrooms, setBedrooms] = useState('Any');
  const [status, setStatus] = useState<'all' | 'off-plan' | 'ready'>('all');

  const filtered = useMemo(() => {
    return siteProperties.filter((property) => {
      if (property.type !== tab) return false;
      if (location !== 'All' && property.location !== location) return false;
      if (bedrooms !== 'Any' && property.bedrooms !== parseInt(bedrooms, 10)) return false;
      if (status !== 'all' && property.status !== status) return false;
      return true;
    });
  }, [tab, location, bedrooms, status]);

  return (
    <div className="pt-20">
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display mb-4 text-4xl md:text-5xl">Our Properties</h1>
          <p className="mx-auto max-w-xl text-primary-foreground/60">Browse Dubai&apos;s most exclusive luxury properties.</p>
        </div>
      </section>

      <section className="border-b border-border py-6">
        <div className="container mx-auto flex flex-wrap items-stretch gap-4 px-6">
          <div className="flex w-full border border-border sm:w-auto">
            {(['buy', 'rent'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`flex-1 px-6 py-2 text-sm uppercase tracking-widest transition-colors sm:flex-none ${
                  tab === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full border border-border bg-background px-4 py-2 text-sm font-body sm:w-auto sm:min-w-[180px]"
          >
            {siteLocations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            className="w-full border border-border bg-background px-4 py-2 text-sm font-body sm:w-auto sm:min-w-[150px]"
          >
            <option>Any</option>
            {[1, 2, 3, 4, 5, 6, 7].map((count) => (
              <option key={count} value={count}>
                {count} Bed{count > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'all' | 'off-plan' | 'ready')}
            className="w-full border border-border bg-background px-4 py-2 text-sm font-body sm:w-auto sm:min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="off-plan">Off-Plan</option>
            <option value="ready">Ready</option>
          </select>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">No properties match your criteria.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
                <div key={property.id} className="group border border-border bg-card">
                  <div className="overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">{property.location}</span>
                      {property.status === 'off-plan' && (
                        <span className="bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-accent">
                          Off-Plan
                        </span>
                      )}
                    </div>
                    <h3 className="font-display mb-2 text-xl font-semibold">{property.title}</h3>
                    <p className="font-body mb-3 text-lg font-semibold text-accent">
                      {formatSitePrice(property.price, property.type)}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>{property.builtUpArea.toLocaleString()} sqft</span>
                    </div>
                    <Button variant="cta" size="sm" asChild className="w-full">
                      <Link href={`/property/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
