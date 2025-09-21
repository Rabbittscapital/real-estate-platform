import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'ADMIN', 'AGENT']).default('USER' as const),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  developer: z.string().optional(),
  totalUnits: z.number().int().positive('Total units must be a positive integer'),
  availableUnits: z.number().int().min(0, 'Available units must be non-negative'),
  startingPrice: z.number().positive('Starting price must be positive'),
  endingPrice: z.number().positive().optional(),
  deliveryDate: z.date().optional(),
  status: z.enum(['PLANNING', 'UNDER_CONSTRUCTION', 'COMPLETED', 'SOLD_OUT']).default('PLANNING' as const),
  images: z.array(z.string().url()).default([]),
  amenities: z.array(z.string()).default([]),
});

// Unit validation schemas
export const unitSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  type: z.enum(['APARTMENT', 'PENTHOUSE', 'STUDIO', 'LOFT', 'COMMERCIAL']),
  bedrooms: z.number().int().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().positive('Area must be positive'),
  price: z.number().positive('Price must be positive'),
  floor: z.number().int().positive().optional(),
  orientation: z.string().optional(),
  balcony: z.boolean().default(false),
  parking: z.boolean().default(false),
  storage: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'UNAVAILABLE']).default('AVAILABLE' as const),
  features: z.array(z.string()).default([]),
});

export const bulkUnitsSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  units: z.array(unitSchema.omit({ projectId: true })),
});

// Client validation schemas
export const clientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  occupation: z.string().optional(),
  income: z.number().positive().optional(),
  budget: z.number().positive().optional(),
  notes: z.string().optional(),
});

// Quote validation schemas
export const quoteSchema = z.object({
  clientId: z.string().cuid('Invalid client ID'),
  projectId: z.string().cuid('Invalid project ID'),
  unitId: z.string().cuid('Invalid unit ID'),
  basePrice: z.number().positive('Base price must be positive'),
  discountAmount: z.number().min(0, 'Discount amount must be non-negative').default(0),
  discountPercent: z.number().min(0).max(100, 'Discount percent must be between 0 and 100').default(0),
  paymentPlan: z.enum(['CASH', 'FINANCED', 'CUSTOM']),
  downPayment: z.number().positive('Down payment must be positive'),
  monthlyPayment: z.number().positive().optional(),
  validUntil: z.date(),
  notes: z.string().optional(),
});

// Reservation validation schemas
export const reservationSchema = z.object({
  clientId: z.string().cuid('Invalid client ID'),
  unitId: z.string().cuid('Invalid unit ID'),
  quoteId: z.string().cuid().optional(),
  reservationFee: z.number().positive('Reservation fee must be positive'),
  expiresAt: z.date(),
  notes: z.string().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  fileName: z.string().optional(),
});

// Search and filter schemas
export const projectSearchSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["PLANNING", "UNDER_CONSTRUCTION", "COMPLETED", "SOLD_OUT"]).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const unitSearchSchema = z.object({
  projectId: z.string().cuid().optional(),
  type: z.enum(["APARTMENT", "PENTHOUSE", "STUDIO", "LOFT", "COMMERCIAL"]).optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "UNAVAILABLE"]).optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxBedrooms: z.number().int().min(0).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minArea: z.number().positive().optional(),
  maxArea: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type UnitInput = z.infer<typeof unitSchema>;
export type BulkUnitsInput = z.infer<typeof bulkUnitsSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type ProjectSearchInput = z.infer<typeof projectSearchSchema>;
export type UnitSearchInput = z.infer<typeof unitSearchSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;