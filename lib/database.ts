import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Role } from '@/lib/roles'

export type BookingStatus = 'pending' | 'approved' | 'in_planning' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Profile = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: Role
  phone: string | null
}
export type TeamMember = Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'role'>
export type BookingRow = {
  id: string
  customer_id: string
  venue_id: string
  manager_id: string | null
  event_date: string
  guest_count: number
  total_price: number
  status: BookingStatus
  decoration_theme: string | null
  catering_option: string | null
  entertainment_service: string | null
  special_requests: string | null
  venue: { name: string; location: string } | null
}
export type TaskRow = {
  id: string
  booking_id: string
  assigned_to: string | null
  title: string
  description: string | null
  phase: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  completed_at: string | null
  booking: { event_date: string; venue: { name: string } | null } | null
}
export type VenueRow = {
  id: string
  name: string
  location: string
  city: string | null
  capacity: number
  price_per_head: number
  description: string | null
  amenities: string[]
  images: string[]
  rating: number
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY values.')
  }
}

export async function getMyProfile() {
  ensureConfigured()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  throwIfError(authError)
  if (!user) return null
  const { data, error } = await supabase.from('profiles').select('id,email,first_name,last_name,role,phone').eq('id', user.id).single()
  throwIfError(error)
  return data as Profile
}

export async function getVenues() {
  ensureConfigured()
  const { data, error } = await supabase.from('venues').select('id,name,location,city,capacity,price_per_head,description,amenities,images,rating').order('name')
  throwIfError(error)
  return (data ?? []) as unknown as VenueRow[]
}

export async function getVenue(id: string) {
  ensureConfigured()
  const { data, error } = await supabase.from('venues').select('id,name,location,city,capacity,price_per_head,description,amenities,images,rating').eq('id', id).single()
  throwIfError(error)
  return data as unknown as VenueRow
}

export async function createBooking(input: {
  venue_id: string
  event_date: string
  guest_count: number
  decoration_theme?: string
  catering_option?: string
  entertainment_service?: string
  special_requests?: string
  total_price: number
}, customerId: string) {
  ensureConfigured()
  const { error } = await supabase.from('bookings').insert({ ...input, customer_id: customerId })
  throwIfError(error)
}

export async function createVenue(input: Omit<VenueRow, 'id' | 'rating'> & { rating?: number }) {
  ensureConfigured()
  const { error } = await supabase.from('venues').insert(input)
  throwIfError(error)
}

export async function updateVenue(id: string, input: Partial<Omit<VenueRow, 'id'>>) {
  ensureConfigured()
  const { error } = await supabase.from('venues').update(input).eq('id', id)
  throwIfError(error)
}

export async function deleteVenue(id: string) {
  ensureConfigured()
  const { error } = await supabase.from('venues').delete().eq('id', id)
  throwIfError(error)
}

export async function updateBooking(
  id: string,
  input: Partial<Pick<BookingRow, 'status' | 'manager_id' | 'event_date' | 'guest_count'>>,
) {
  ensureConfigured()
  const { error } = await supabase.from('bookings').update(input).eq('id', id)
  throwIfError(error)
}

export async function updateTeamMember(
  id: string,
  input: Partial<Pick<Profile, 'first_name' | 'last_name' | 'role' | 'phone'>>,
) {
  ensureConfigured()
  const { error } = await supabase.from('profiles').update(input).eq('id', id)
  throwIfError(error)
}

export async function getTeam(role?: Extract<Role, 'manager' | 'staff'>) {
  ensureConfigured()
  let query = supabase.from('profiles').select('id,first_name,last_name,email,role').in('role', ['manager', 'staff']).order('first_name')
  if (role) query = query.eq('role', role)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []) as TeamMember[]
}

export async function getAdminBookings() {
  ensureConfigured()
  const { data, error } = await supabase.from('bookings').select('id,customer_id,venue_id,manager_id,event_date,guest_count,total_price,status,decoration_theme,catering_option,entertainment_service,special_requests,venue:venues(name,location)').order('created_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as unknown as BookingRow[]
}

export async function reviewBooking(
  id: string,
  status: Extract<BookingStatus, 'approved' | 'rejected'>,
  managerId?: string,
) {
  ensureConfigured()
  const update: { status: BookingStatus; manager_id?: string } = { status }
  if (managerId) update.manager_id = managerId
  const { error } = await supabase.from('bookings').update(update).eq('id', id)
  throwIfError(error)
}

export async function getManagerBookings(managerId: string) {
  ensureConfigured()
  const { data, error } = await supabase.from('bookings').select('id,customer_id,venue_id,manager_id,event_date,guest_count,total_price,status,decoration_theme,catering_option,entertainment_service,special_requests,venue:venues(name,location)').eq('manager_id', managerId).order('event_date')
  throwIfError(error)
  return (data ?? []) as unknown as BookingRow[]
}

export async function getCustomerBookings(customerId: string) {
  ensureConfigured()
  const { data, error } = await supabase.from('bookings').select('id,customer_id,venue_id,manager_id,event_date,guest_count,total_price,status,decoration_theme,catering_option,entertainment_service,special_requests,venue:venues(name,location)').eq('customer_id', customerId).order('event_date')
  throwIfError(error)
  return (data ?? []) as unknown as BookingRow[]
}

export async function getBookingTasks(bookingId: string) {
  ensureConfigured()
  const { data, error } = await supabase.from('tasks').select('id,booking_id,assigned_to,title,description,phase,status,priority,due_date,completed_at').eq('booking_id', bookingId).order('due_date')
  throwIfError(error)
  return (data ?? []) as unknown as TaskRow[]
}

export async function getMyTasks(userId: string) {
  ensureConfigured()
  const { data, error } = await supabase.from('tasks').select('id,booking_id,assigned_to,title,description,phase,status,priority,due_date,completed_at,booking:bookings(event_date,venue:venues(name))').eq('assigned_to', userId).order('due_date')
  throwIfError(error)
  return (data ?? []) as unknown as TaskRow[]
}

export async function createTask(input: {
  booking_id: string
  assigned_to: string
  title: string
  description?: string
  phase: string
  priority: TaskPriority
  due_date?: string
}, userId: string) {
  ensureConfigured()
  const { error } = await supabase.from('tasks').insert({ ...input, created_by: userId })
  throwIfError(error)
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  ensureConfigured()
  const { error } = await supabase.from('tasks').update({
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
  }).eq('id', id)
  throwIfError(error)
}
