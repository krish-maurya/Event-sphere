import { z } from 'zod'

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain uppercase').regex(/[0-9]/, 'Password must contain a number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const NewPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain uppercase').regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const ReviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

export const GuestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().optional(),
})

export const WishlistSchema = z.object({
  venueId: z.string(),
})

export const SearchFiltersSchema = z.object({
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minCapacity: z.number().optional(),
  maxCapacity: z.number().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  amenities: z.array(z.string()).optional(),
  minRating: z.number().min(0).max(5).optional(),
})

export type SignupInput = z.infer<typeof SignupSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type NewPasswordInput = z.infer<typeof NewPasswordSchema>
export type ReviewInput = z.infer<typeof ReviewSchema>
export type GuestInput = z.infer<typeof GuestSchema>
export type WishlistInput = z.infer<typeof WishlistSchema>
export type SearchFilters = z.infer<typeof SearchFiltersSchema>
