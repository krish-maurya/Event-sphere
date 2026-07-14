'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useWorkflowStore } from '@/lib/workflowStore'
import { EVENT_MANAGERS } from '@/lib/workflowData'
import { Check, X, ArrowRight, Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const { currentUser } = useAppStore()
  const { pendingBookings, approvedBookings, approveBooking, rejectBooking, assignEventManager } = useWorkflowStore()
  const [selectedManager, setSelectedManager] = useState<Record<string, string>>({})

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Admin access required</p>
            <Link href="/auth/login" className="inline-block px-6 py-2 bg-primary text-foreground-foreground rounded-lg">
              Sign In
            </Link>
          </div>
        </main>
      </>
    )
  }

  const handleApprove = (bookingId: string) => {
    approveBooking(bookingId)
    if (selectedManager[bookingId]) {
      assignEventManager(bookingId, selectedManager[bookingId])
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage bookings and assign event managers</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Bookings</p>
                  <p className="text-3xl font-bold text-foreground">{pendingBookings.length}</p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedBookings.length}</p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Events</p>
                  <p className="text-3xl font-bold text-foreground">{pendingBookings.length + approvedBookings.length}</p>
                </div>
                <Calendar className="text-foreground" size={32} />
              </div>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Pending Bookings Review</h2>

            {pendingBookings.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <p className="text-muted-foreground">All bookings have been reviewed!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-lg border border-border p-6 space-y-4">
                    {/* Booking Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Venue</p>
                        <p className="text-lg font-semibold text-foreground">{booking.venueName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Event Date</p>
                        <p className="text-lg font-semibold text-foreground">
                          {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Guest Count</p>
                        <p className="text-lg font-semibold text-foreground">{booking.guestCount} guests</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Total Price</p>
                        <p className="text-lg font-semibold text-foreground">${booking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Event Manager Selection */}
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-foreground mb-2">Assign Event Manager</label>
                      <select
                        value={selectedManager[booking.id] || ''}
                        onChange={(e) => setSelectedManager({ ...selectedManager, [booking.id]: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                      >
                        <option value="">Select an event manager...</option>
                        {EVENT_MANAGERS.map((em) => (
                          <option key={em.id} value={em.id}>
                            {em.name} ({em.specialization}) - {em.rating}⭐
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        disabled={!selectedManager[booking.id]}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="flex-1 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Bookings */}
          {approvedBookings.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Approved Bookings</h2>
              <div className="space-y-3">
                {approvedBookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{booking.venueName}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(booking.eventDate), 'MMM d, yyyy')}</p>
                    </div>
                    <Link href={`/dashboard/event-manager/${booking.id}`} className="px-4 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
