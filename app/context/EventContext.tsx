'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface Booking {
  id: string
  venueId: string
  venueName: string
  eventDate: string
  guestCount: number
  decorationTheme: string
  cateringOption: string
  entertainmentService: string
  specialRequests: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
}

interface EventContextType {
  user: User | null
  bookings: Booking[]
  setUser: (user: User | null) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, booking: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  getBookingById: (id: string) => Booking | undefined
  currentBookingDraft: Partial<Booking> | null
  setCurrentBookingDraft: (draft: Partial<Booking> | null) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentBookingDraft, setCurrentBookingDraft] = useState<Partial<Booking> | null>(null)

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [...prev, booking])
  }, [])

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking))
    )
  }, [])

  const cancelBooking = useCallback((id: string) => {
    updateBooking(id, { status: 'cancelled' })
  }, [updateBooking])

  const getBookingById = useCallback(
    (id: string) => {
      return bookings.find((booking) => booking.id === id)
    },
    [bookings]
  )

  const value: EventContextType = {
    user,
    bookings,
    setUser,
    addBooking,
    updateBooking,
    cancelBooking,
    getBookingById,
    currentBookingDraft,
    setCurrentBookingDraft,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export function useEvent() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
