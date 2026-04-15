export type ListingMode = 'buy' | 'rent';
export type ReadinessStatus = 'off-plan' | 'ready';

export interface SiteProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  plotSize?: number;
  images: string[];
  status: ReadinessStatus;
  featured: boolean;
  type: ListingMode;
  roi?: string;
  rentalYield?: string;
  features: string[];
}

export const siteProperties: SiteProperty[] = [
  {
    id: '1',
    title: 'Penthouse at Marina Heights',
    location: 'Dubai Marina',
    price: 12500000,
    description:
      'An extraordinary penthouse offering panoramic views of the Dubai Marina skyline with private infinity pool and world-class amenities.',
    bedrooms: 4,
    bathrooms: 5,
    builtUpArea: 6500,
    plotSize: 7200,
    images: ['/lovable-assets/property-1.jpg'],
    status: 'ready',
    featured: true,
    type: 'buy',
    roi: '8.2%',
    rentalYield: '5.8%',
    features: ['Private Pool', 'Smart Home', 'Concierge', 'Sea View', 'Private Elevator', 'Wine Cellar'],
  },
  {
    id: '2',
    title: 'Emirates Hills Villa',
    location: 'Emirates Hills',
    price: 35000000,
    description:
      'A palatial villa in one of Dubai\'s most prestigious gated communities, featuring lush gardens and bespoke interiors.',
    bedrooms: 7,
    bathrooms: 8,
    builtUpArea: 15000,
    plotSize: 25000,
    images: ['/lovable-assets/property-2.jpg'],
    status: 'ready',
    featured: true,
    type: 'buy',
    roi: '6.5%',
    rentalYield: '4.2%',
    features: ['Private Garden', 'Home Cinema', 'Gym', 'Staff Quarters', 'Golf Course View', 'Swimming Pool'],
  },
  {
    id: '3',
    title: 'Waterfront Residences',
    location: 'Dubai Creek Harbour',
    price: 4200000,
    description:
      'Premium waterfront apartments in Dubai\'s newest landmark development with stunning creek and skyline views.',
    bedrooms: 3,
    bathrooms: 4,
    builtUpArea: 2800,
    images: ['/lovable-assets/property-3.jpg'],
    status: 'off-plan',
    featured: true,
    type: 'buy',
    roi: '12.4%',
    rentalYield: '7.1%',
    features: ['Waterfront', 'Branded Residences', 'Infinity Pool', 'Smart Home', 'Gym', 'Concierge'],
  },
  {
    id: '4',
    title: 'Beach Villa on Palm',
    location: 'Palm Jumeirah',
    price: 22000000,
    description:
      'An exclusive beachfront villa on Palm Jumeirah with private beach access and unobstructed sea views.',
    bedrooms: 5,
    bathrooms: 6,
    builtUpArea: 8500,
    plotSize: 12000,
    images: ['/lovable-assets/property-4.jpg'],
    status: 'ready',
    featured: true,
    type: 'buy',
    roi: '7.8%',
    rentalYield: '5.2%',
    features: ['Private Beach', 'Rooftop Terrace', 'Basement Parking', 'Sea View', 'Landscaped Garden', 'Maid\'s Room'],
  },
  {
    id: '5',
    title: 'Sky Collection Apartment',
    location: 'Downtown Dubai',
    price: 180000,
    description:
      'Ultra-luxury high-rise apartment with floor-to-ceiling windows and breathtaking views of Burj Khalifa.',
    bedrooms: 2,
    bathrooms: 3,
    builtUpArea: 1800,
    images: ['/lovable-assets/property-5.jpg'],
    status: 'ready',
    featured: true,
    type: 'rent',
    features: ['Burj Khalifa View', 'Furnished', 'Gym', 'Pool', '24/7 Security', 'Parking'],
  },
  {
    id: '6',
    title: 'The Grand Residences',
    location: 'Mohammed Rashid City',
    price: 2800000,
    description:
      'A new iconic development offering resort-style living with lush landscapes and premium finishes.',
    bedrooms: 2,
    bathrooms: 3,
    builtUpArea: 1600,
    images: ['/lovable-assets/property-6.jpg'],
    status: 'off-plan',
    featured: true,
    type: 'buy',
    roi: '15.2%',
    rentalYield: '8.5%',
    features: ['Park View', 'Smart Home', 'Community Pool', 'Kids Play Area', 'Retail Podium', 'Gym'],
  },
];

export const siteLocations = [
  'All',
  'Dubai Marina',
  'Emirates Hills',
  'Dubai Creek Harbour',
  'Palm Jumeirah',
  'Downtown Dubai',
  'Mohammed Rashid City',
];

export function getFeaturedSiteProperties(limit = 6) {
  return siteProperties.filter((property) => property.featured).slice(0, limit);
}

export function getSitePropertyById(id: string) {
  return siteProperties.find((property) => property.id === id) || null;
}

export function formatSitePrice(price: number, type: ListingMode = 'buy') {
  const formatted = price.toLocaleString('en-US');
  if (type === 'rent') {
    return `AED ${formatted}/yr`;
  }
  return `AED ${formatted}`;
}
