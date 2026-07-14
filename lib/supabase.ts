import { createClient } from '@supabase/supabase-js'

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isHttpUrl = (value: string | undefined) => Boolean(value && /^https?:\/\//.test(value))

// A harmless local fallback lets Next build before deployment variables are added.
// Every real data operation will still fail until valid Supabase credentials are configured.
const supabaseUrl = isHttpUrl(configuredUrl) ? configuredUrl! : 'http://127.0.0.1:54321'
const supabaseAnonKey = configuredAnonKey || 'development-anon-key'

export const isSupabaseConfigured = isHttpUrl(configuredUrl) && Boolean(configuredAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'staff' | 'customer'
  createdAt: string
  updatedAt: string
}

export type Venue = {
  id: string
  name: string
  location: string
  capacity: number
  pricePerHead: number
  description: string
  amenities: string[]
  images: string[]
  rating: number
  createdAt: string
}

export type Booking = {
  id: string
  userId: string
  venueId: string
  eventDate: string
  guestCount: number
  decorationTheme: string
  cateringOption: string
  entertainmentService: string
  specialRequests: string
  totalPrice: number
  status: 'pending' | 'approved' | 'confirmed' | 'cancelled'
  createdAt: string
}

export type EventTimeline = {
  id: string
  bookingId: string
  managerId: string
  phase: string
  startDate: string
  endDate: string
  progress: number
  createdAt: string
}

export type Task = {
  id: string
  timelineId: string
  title: string
  description: string
  assignedTo: string
  status: 'todo' | 'in_progress' | 'completed'
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export type Vendor = {
  id: string
  name: string
  category: 'catering' | 'decoration' | 'photography' | 'entertainment'
  email: string
  phone: string
  rating: number
  availability: boolean
  createdAt: string
}
