import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'AED'): string {
  if (price >= 1_000_000) {
    return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `${currency} ${(price / 1_000).toFixed(0)}K`;
  }
  return `${currency} ${price.toLocaleString()}`;
}

export function formatFullPrice(price: number, currency = 'AED'): string {
  return `${currency} ${price.toLocaleString('en-AE')}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} sqft`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    penthouse: 'Penthouse',
    townhouse: 'Townhouse',
    commercial: 'Commercial',
    land: 'Land',
  };
  return labels[type] || type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    for_sale: 'For Sale',
    for_rent: 'For Rent',
    sold: 'Sold',
    rented: 'Rented',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    for_sale: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
    for_rent: 'bg-sky-500/15 text-sky-300 border border-sky-500/20',
    sold: 'bg-accent/15 text-red-200 border border-accent/30',
    rented: 'bg-white/10 text-white/65 border border-white/10',
  };
  return colors[status] || 'bg-white/10 text-white/65 border border-white/10';
}

export function getFurnishingLabel(furnishing: string): string {
  const labels: Record<string, string> = {
    furnished: 'Furnished',
    semi_furnished: 'Semi Furnished',
    unfurnished: 'Unfurnished',
  };
  return labels[furnishing] || furnishing;
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export const PROPERTY_AMENITIES = [
  'Swimming Pool',
  'Gym / Fitness Center',
  'Spa',
  'Sauna',
  'Concierge Service',
  'Valet Parking',
  'Rooftop Terrace',
  'BBQ Area',
  'Kids Play Area',
  'Tennis Court',
  'Basketball Court',
  'Squash Court',
  'Jogging Track',
  'Beach Access',
  'Marina View',
  'Golf Course View',
  'Burj Khalifa View',
  'Sea View',
  'City View',
  'Garden',
  'Security 24/7',
  'CCTV',
  'Smart Home',
  'Central A/C',
  'Built-in Wardrobes',
  'Study Room',
  'Maid\'s Room',
  'Driver\'s Room',
  'Storage Room',
  'Laundry Room',
];

export const DUBAI_DISTRICTS = [
  'Downtown Dubai',
  'Dubai Marina',
  'Palm Jumeirah',
  'Business Bay',
  'Jumeirah Beach Residence (JBR)',
  'Dubai Hills Estate',
  'Emirates Hills',
  'Arabian Ranches',
  'Jumeirah',
  'Al Barsha',
  'DIFC',
  'Meydan',
  'Dubai Creek Harbour',
  'Dubai South',
  'Al Furjan',
  'Damac Hills',
  'Tilal Al Ghaf',
  'Mohammed Bin Rashid City',
  'Sobha Hartland',
  'Dubai Sports City',
  'Silicon Oasis',
  'International City',
];
