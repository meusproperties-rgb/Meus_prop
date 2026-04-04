export type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'commercial' | 'land';
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'rented';
export type PropertyFurnishing = 'furnished' | 'semi_furnished' | 'unfurnished';
export type EnquiryStatus = 'pending' | 'read' | 'replied' | 'closed';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  publicId: string | null;
  caption: string | null;
  order: number;
}

export interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  furnishing: PropertyFurnishing | null;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  address: string;
  city: string;
  district: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  features: string[];
  coverImage: string | null;
  videoUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  images?: PropertyImage[];
  owner?: PropertyOwner;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  adminNote: string | null;
  property?: Pick<Property, 'id' | 'title' | 'slug' | 'coverImage'>;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  totalUsers: number;
  featuredProperties: number;
  recentProperties: Property[];
  recentEnquiries: Enquiry[];
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  furnishing?: PropertyFurnishing;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'area_asc' | 'area_desc';
}
