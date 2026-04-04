import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ─── Property Schemas ─────────────────────────────────────────────────────────

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land']),
  status: z.enum(['for_sale', 'for_rent', 'sold', 'rented']),
  price: z.number().positive('Price must be positive'),
  area: z.number().positive('Area must be positive'),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().int().min(0).optional().nullable(),
  parkingSpaces: z.number().int().min(0).optional().nullable(),
  furnishing: z.enum(['furnished', 'semi_furnished', 'unfurnished']).optional().nullable(),
  floor: z.number().int().optional().nullable(),
  totalFloors: z.number().int().optional().nullable(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional().nullable(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2).default('Dubai'),
  district: z.string().optional().nullable(),
  country: z.string().min(2).default('UAE'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  coverImage: z.string().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// ─── Enquiry Schema ───────────────────────────────────────────────────────────

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  propertyId: z.string().uuid('Invalid property ID'),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

// ─── Property Filter Schema ────────────────────────────────────────────────────

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land']).optional(),
  status: z.enum(['for_sale', 'for_rent', 'sold', 'rented']).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minArea: z.number().min(0).optional(),
  maxArea: z.number().min(0).optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxBedrooms: z.number().int().min(0).optional(),
  furnishing: z.enum(['furnished', 'semi_furnished', 'unfurnished']).optional(),
  isFeatured: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'newest', 'oldest', 'area_asc', 'area_desc'])
    .default('newest'),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;
