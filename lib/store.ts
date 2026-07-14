import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  bio?: string
  avatar?: string
  role: UserRole
  createdAt: Date
}

export interface Review {
  id: string
  venueId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  photos?: string[]
  helpful: number
  createdAt: Date
}

export interface Guest {
  id: string
  bookingId: string
  name: string
  email: string
  dietaryRestrictions?: string
  notes?: string
  rsvpStatus: 'pending' | 'accepted' | 'declined'
  arrivedAt?: Date
}

export interface Booking {
  id: string
  userId: string
  venueId: string
  venueName: string
  eventDate: Date
  guestCount: number
  decorationTheme: string
  cateringOption: string
  entertainmentService: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  guests: Guest[]
  specialRequests?: string
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  invoiceId?: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'booking' | 'payment' | 'rsvp' | 'review' | 'promotion'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface SearchFilters {
  location?: string
  minPrice?: number
  maxPrice?: number
  minCapacity?: number
  maxCapacity?: number
  dateFrom?: Date
  dateTo?: Date
  amenities?: string[]
  minRating?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest'
}

export interface AppStore {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null

  // Auth Actions
  signup: (email: string, password: string, firstName: string, lastName: string) => void
  login: (email: string, password: string) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  requestPasswordReset: (email: string) => void
  resetPassword: (token: string, newPassword: string) => void
  hasRole: (role: UserRole) => boolean
  canAccess: (requiredRoles: UserRole[]) => boolean

  // Bookings
  bookings: Booking[]
  currentBooking: Booking | null
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  setCurrentBooking: (booking: Booking | null) => void

  // Wishlist
  wishlist: string[] // venueIds
  addToWishlist: (venueId: string) => void
  removeFromWishlist: (venueId: string) => void
  isInWishlist: (venueId: string) => boolean

  // Reviews
  reviews: Review[]
  addReview: (review: Review) => void
  updateReview: (id: string, updates: Partial<Review>) => void
  deleteReview: (id: string) => void
  getVenueReviews: (venueId: string) => Review[]

  // Notifications
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void

  // Search & Filters
  searchFilters: SearchFilters
  updateSearchFilters: (filters: SearchFilters) => void
  resetSearchFilters: () => void

  // Guests
  addGuest: (guest: Guest) => void
  updateGuestRSVP: (guestId: string, status: 'accepted' | 'declined') => void
}

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,
  bookings: [],
  currentBooking: null,
  wishlist: [],
  reviews: [],
  notifications: [],
  unreadCount: 0,
  searchFilters: {},
}

// Mock user database
const mockUsers = [
  {
    id: 'user-001',
    email: 'demo@example.com',
    password: 'DemoPassword123', // In real app, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about hosting memorable events',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'CUSTOMER',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-002',
    email: 'sarah@example.com',
    password: 'SafePass456', // In real app, this would be hashed
    firstName: 'Sarah',
    lastName: 'Smith',
    phone: '+1 (555) 234-5678',
    bio: 'Event planning enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'MANAGER',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-003',
    email: 'admin@example.com',
    password: 'AdminPass789',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1 (555) 345-6789',
    bio: 'System Administrator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
  },
]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth Actions
      signup: (email, password, firstName, lastName) => {
        // Simulate signup - in real app, call API
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          role: 'CUSTOMER', // Default role for new users
          createdAt: new Date(),
        }

        // Check if email already exists
        const exists = mockUsers.some((u: any) => u.email === email)
        if (exists) {
          set({ authError: 'Email already registered' })
          return
        }

        set({
          currentUser: newUser,
          isAuthenticated: true,
          authError: null,
        })

        // Add welcome notification
        get().addNotification({
          id: `notif-${Date.now()}`,
          userId: newUser.id,
          type: 'promotion',
          title: 'Welcome to EventSphere!',
          message: 'Your account has been created successfully. Browse venues and start booking!',
          read: false,
          createdAt: new Date(),
        })
      },

      login: (email, password) => {
        // Simulate login - in real app, call API
        const user = mockUsers.find((u: any) => u.email === email && u.password === password)

        if (!user) {
          set({ authError: 'Invalid email or password' })
          return
        }

        const { password: _, ...userWithoutPassword } = user
        set({
          currentUser: userWithoutPassword as User,
          isAuthenticated: true,
          authError: null,
        })
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          currentBooking: null,
        })
      },

      updateProfile: (updates) => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const updated = { ...currentUser, ...updates }
        set({ currentUser: updated })
      },

      requestPasswordReset: (email) => {
        // Simulate password reset request
        get().addNotification({
          id: `notif-${Date.now()}`,
          userId: 'temp',
          type: 'promotion',
          title: 'Password Reset Link Sent',
          message: `Check your email at ${email} for password reset instructions.`,
          read: false,
          createdAt: new Date(),
        })
      },

      resetPassword: (token, newPassword) => {
        // Simulate password reset
        get().addNotification({
          id: `notif-${Date.now()}`,
          userId: get().currentUser?.id || 'temp',
          type: 'promotion',
          title: 'Password Reset Successful',
          message: 'Your password has been updated. You can now login with your new password.',
          read: false,
          createdAt: new Date(),
        })
      },

      // Bookings
      addBooking: (booking) => {
        const bookings = get().bookings
        set({ bookings: [...bookings, booking] })

        const currentUser = get().currentUser
        if (currentUser) {
          get().addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'booking',
            title: 'Booking Confirmed',
            message: `Your booking for ${booking.venueName} on ${booking.eventDate.toLocaleDateString()} is confirmed!`,
            read: false,
            actionUrl: `/bookings/${booking.id}`,
            createdAt: new Date(),
          })
        }
      },

      updateBooking: (id, updates) => {
        const bookings = get().bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
        set({ bookings })
      },

      cancelBooking: (id) => {
        get().updateBooking(id, { status: 'cancelled' })
        const currentUser = get().currentUser
        if (currentUser) {
          get().addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'booking',
            title: 'Booking Cancelled',
            message: 'Your booking has been cancelled. You will receive a refund within 5-7 business days.',
            read: false,
            createdAt: new Date(),
          })
        }
      },

      setCurrentBooking: (booking) => {
        set({ currentBooking: booking })
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (venueId) => {
        const wishlist = get().wishlist
        if (!wishlist.includes(venueId)) {
          set({ wishlist: [...wishlist, venueId] })
        }
      },

      removeFromWishlist: (venueId) => {
        const wishlist = get().wishlist
        set({ wishlist: wishlist.filter((id) => id !== venueId) })
      },

      isInWishlist: (venueId) => {
        return get().wishlist.includes(venueId)
      },

      // Reviews
      addReview: (review) => {
        const reviews = get().reviews
        set({ reviews: [...reviews, review] })

        const currentUser = get().currentUser
        if (currentUser) {
          get().addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'review',
            title: 'Review Published',
            message: `Your ${review.rating}-star review has been published and is helping others!`,
            read: false,
            createdAt: new Date(),
          })
        }
      },

      updateReview: (id, updates) => {
        const reviews = get().reviews.map((r) => (r.id === id ? { ...r, ...updates } : r))
        set({ reviews })
      },

      deleteReview: (id) => {
        const reviews = get().reviews.filter((r) => r.id !== id)
        set({ reviews })
      },

      getVenueReviews: (venueId) => {
        return get().reviews.filter((r) => r.venueId === venueId)
      },

      // Notifications
      addNotification: (notification) => {
        const notifications = get().notifications
        set({
          notifications: [notification, ...notifications],
          unreadCount: get().unreadCount + 1,
        })
      },

      markAsRead: (id) => {
        const notifications = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        set({ notifications, unreadCount: Math.max(0, get().unreadCount - 1) })
      },

      markAllAsRead: () => {
        const notifications = get().notifications.map((n) => ({ ...n, read: true }))
        set({ notifications, unreadCount: 0 })
      },

      deleteNotification: (id) => {
        const notifications = get().notifications.filter((n) => n.id !== id)
        const wasUnread = get().notifications.find((n) => n.id === id)?.read === false
        set({
          notifications,
          unreadCount: wasUnread ? Math.max(0, get().unreadCount - 1) : get().unreadCount,
        })
      },

      // Search
      updateSearchFilters: (filters) => {
        set({ searchFilters: { ...get().searchFilters, ...filters } })
      },

      resetSearchFilters: () => {
        set({ searchFilters: {} })
      },

      // Guests
      addGuest: (guest) => {
        const currentBooking = get().currentBooking
        if (!currentBooking) return

        const updatedGuests = [...(currentBooking.guests || []), guest]
        set({
          currentBooking: {
            ...currentBooking,
            guests: updatedGuests,
          },
        })
      },

      updateGuestRSVP: (guestId, status) => {
        const currentBooking = get().currentBooking
        if (!currentBooking) return

        const updatedGuests = currentBooking.guests.map((g) => (g.id === guestId ? { ...g, rsvpStatus: status } : g))

        set({
          currentBooking: {
            ...currentBooking,
            guests: updatedGuests,
          },
        })

        const currentUser = get().currentUser
        if (currentUser) {
          get().addNotification({
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'rsvp',
            title: `Guest RSVP: ${status}`,
            message: `A guest has ${status} your event invitation.`,
            read: false,
            createdAt: new Date(),
          })
        }
      },

      // Role-based access control
      hasRole: (role) => {
        const user = get().currentUser
        return user ? user.role === role : false
      },

      canAccess: (requiredRoles) => {
        const user = get().currentUser
        if (!user) return false
        return requiredRoles.includes(user.role)
      },
    }),
    {
      name: 'app-store',
    }
  )
)
