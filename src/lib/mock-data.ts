import type { PaginatedResponse, Property, PropertyFilters, PropertyImage, PropertyOwner } from '@/types/index';

const owner: PropertyOwner = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'MEUS Advisory Desk',
  email: 'hello@meusrealestate.ae',
  phone: '+97145551234',
  avatar: null,
};

function makeImages(seed: string, urls: string[]): PropertyImage[] {
  return urls.map((url, index) => ({
    id: `${seed}-img-${index + 1}`,
    url,
    publicId: null,
    caption: null,
    order: index,
  }));
}

export const mockProperties: Property[] = [
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1001',
    title: 'Skyline Penthouse At Marina Heights',
    slug: 'skyline-penthouse-at-marina-heights',
    description:
      'A full-floor penthouse with panoramic marina views, private pool terrace, upgraded finishes, and direct access to Dubai Marina’s lifestyle district. Designed for buyers prioritizing prestige, privacy, and long-term waterfront value.',
    type: 'penthouse',
    status: 'for_sale',
    price: 12500000,
    area: 5200,
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 3,
    furnishing: 'furnished',
    floor: 62,
    totalFloors: 68,
    yearBuilt: 2022,
    address: 'Marina Heights Tower',
    city: 'Dubai',
    district: 'Dubai Marina',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['Infinity Pool', 'Private Lift Lobby', 'Concierge Service', 'Gym / Fitness Center', 'Marina View'],
    features: ['Full Floor', 'Private Pool', 'Smart Home', 'Turnkey'],
    coverImage: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80',
    videoUrl: null,
    isFeatured: true,
    isActive: true,
    viewCount: 184,
    images: makeImages('marina-penthouse', [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-26T08:00:00.000Z',
  },
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1002',
    title: 'Emirates Hills Signature Villa',
    slug: 'emirates-hills-signature-villa',
    description:
      'A gated estate home with landscaped gardens, entertainment rooms, and family-focused planning in one of Dubai’s most established prime villa communities. Built for end users and long-hold investors seeking blue-chip residential exposure.',
    type: 'villa',
    status: 'for_sale',
    price: 35000000,
    area: 11100,
    bedrooms: 6,
    bathrooms: 7,
    parkingSpaces: 4,
    furnishing: 'semi_furnished',
    floor: null,
    totalFloors: 2,
    yearBuilt: 2021,
    address: 'Sector E, Emirates Hills',
    city: 'Dubai',
    district: 'Emirates Hills',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['Swimming Pool', 'Garden', 'Maid\'s Room', 'Security 24/7', 'Study Room'],
    features: ['Corner Plot', 'Family Compound', 'Formal Lounge'],
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    videoUrl: null,
    isFeatured: true,
    isActive: true,
    viewCount: 133,
    images: makeImages('emirates-villa', [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-02-22T08:00:00.000Z',
    updatedAt: '2026-03-20T08:00:00.000Z',
  },
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1003',
    title: 'Creek Harbour Waterfront Residences',
    slug: 'creek-harbour-waterfront-residences',
    description:
      'A premium off-plan waterfront apartment positioned for strong future demand, skyline views, and flexible payment plan access in Dubai Creek Harbour.',
    type: 'apartment',
    status: 'for_sale',
    price: 4200000,
    area: 2100,
    bedrooms: 3,
    bathrooms: 4,
    parkingSpaces: 2,
    furnishing: 'unfurnished',
    floor: 23,
    totalFloors: 54,
    yearBuilt: 2027,
    address: 'Dubai Creek Harbour',
    city: 'Dubai',
    district: 'Dubai Creek Harbour',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['Beach Access', 'Gym / Fitness Center', 'Kids Play Area', 'City View', 'Security 24/7'],
    features: ['Off-Plan', 'Payment Plan', 'Waterfront'],
    coverImage: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80',
    videoUrl: null,
    isFeatured: true,
    isActive: true,
    viewCount: 97,
    images: makeImages('creek-harbour', [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-28T08:00:00.000Z',
  },
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1004',
    title: 'Business Bay Executive Residence',
    slug: 'business-bay-executive-residence',
    description:
      'An executive apartment near DIFC and Downtown with efficient layout, canal access, and rental appeal for professionals and investors.',
    type: 'apartment',
    status: 'for_rent',
    price: 285000,
    area: 1650,
    bedrooms: 2,
    bathrooms: 3,
    parkingSpaces: 1,
    furnishing: 'furnished',
    floor: 31,
    totalFloors: 45,
    yearBuilt: 2023,
    address: 'Canal Front, Business Bay',
    city: 'Dubai',
    district: 'Business Bay',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['City View', 'Concierge Service', 'Valet Parking', 'Gym / Fitness Center'],
    features: ['Canal View', 'Fully Furnished'],
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    videoUrl: null,
    isFeatured: false,
    isActive: true,
    viewCount: 74,
    images: makeImages('business-bay', [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-03-18T08:00:00.000Z',
    updatedAt: '2026-03-29T08:00:00.000Z',
  },
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1005',
    title: 'Palm Jumeirah Branded Residence',
    slug: 'palm-jumeirah-branded-residence',
    description:
      'A resort-style beachfront residence with private club access, branded hospitality services, and strong trophy-home positioning on Palm Jumeirah.',
    type: 'apartment',
    status: 'for_sale',
    price: 9800000,
    area: 3150,
    bedrooms: 3,
    bathrooms: 4,
    parkingSpaces: 2,
    furnishing: 'furnished',
    floor: 14,
    totalFloors: 20,
    yearBuilt: 2024,
    address: 'Palm Crescent, Palm Jumeirah',
    city: 'Dubai',
    district: 'Palm Jumeirah',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['Beach Access', 'Spa', 'Concierge Service', 'Sea View', 'Valet Parking'],
    features: ['Branded Residence', 'Beachfront', 'Resort Access'],
    coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
    videoUrl: null,
    isFeatured: true,
    isActive: true,
    viewCount: 208,
    images: makeImages('palm-branded', [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-02-11T08:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
  },
  {
    id: '9adf6c41-2240-4e06-bb6d-7d22c3dd1006',
    title: 'Dubai Hills Family Townhouse',
    slug: 'dubai-hills-family-townhouse',
    description:
      'A modern townhouse in a green family community with strong schooling access, clubhouse amenities, and stable end-user demand.',
    type: 'townhouse',
    status: 'for_sale',
    price: 3150000,
    area: 2850,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    furnishing: 'semi_furnished',
    floor: null,
    totalFloors: 2,
    yearBuilt: 2023,
    address: 'Maple, Dubai Hills Estate',
    city: 'Dubai',
    district: 'Dubai Hills Estate',
    country: 'UAE',
    latitude: null,
    longitude: null,
    amenities: ['Garden', 'Kids Play Area', 'Jogging Track', 'Security 24/7'],
    features: ['Family Community', 'Community Park'],
    coverImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
    videoUrl: null,
    isFeatured: false,
    isActive: true,
    viewCount: 61,
    images: makeImages('dubai-hills', [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    ]),
    owner,
    isFavorited: false,
    createdAt: '2026-03-14T08:00:00.000Z',
    updatedAt: '2026-03-21T08:00:00.000Z',
  },
];

function sortProperties(items: Property[], sortBy?: PropertyFilters['sortBy']) {
  const sorted = [...items];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area_asc':
      return sorted.sort((a, b) => a.area - b.area);
    case 'area_desc':
      return sorted.sort((a, b) => b.area - a.area);
    case 'oldest':
      return sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    case 'newest':
    default:
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
}

export function getMockFeaturedProperties(limit = 6): Property[] {
  return mockProperties.filter((property) => property.isFeatured).slice(0, limit);
}

export function getMockPropertyBySlug(slug: string): Property | null {
  return mockProperties.find((property) => property.slug === slug) || null;
}

export function getMockProperties(searchParams: Record<string, string | string[] | undefined>): PaginatedResponse<Property> {
  const page = Math.max(1, parseInt(String(searchParams.page || '1'), 10) || 1);
  const limit = 6;

  let items = mockProperties.filter((property) => property.isActive);

  const search = typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : '';
  const type = typeof searchParams.type === 'string' ? searchParams.type : '';
  const status = typeof searchParams.status === 'string' ? searchParams.status : '';
  const district = typeof searchParams.district === 'string' ? searchParams.district : '';
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;
  const minBedrooms = typeof searchParams.minBedrooms === 'string' ? Number(searchParams.minBedrooms) : undefined;
  const isFeatured = typeof searchParams.isFeatured === 'string' ? searchParams.isFeatured === 'true' : false;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy as PropertyFilters['sortBy'] : 'newest';

  if (search) {
    items = items.filter((property) =>
      [property.title, property.description, property.city, property.district, property.address]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }

  if (type) items = items.filter((property) => property.type === type);
  if (status) items = items.filter((property) => property.status === status);
  if (district) items = items.filter((property) => property.district === district);
  if (!Number.isNaN(minPrice) && minPrice !== undefined) items = items.filter((property) => property.price >= minPrice);
  if (!Number.isNaN(maxPrice) && maxPrice !== undefined) items = items.filter((property) => property.price <= maxPrice);
  if (!Number.isNaN(minBedrooms) && minBedrooms !== undefined) items = items.filter((property) => (property.bedrooms || 0) >= minBedrooms);
  if (isFeatured) items = items.filter((property) => property.isFeatured);

  const sorted = sortProperties(items, sortBy);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    items: sorted.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}
