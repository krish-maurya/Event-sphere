'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { Calendar, Users, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function BookingsPage() {
  const router = useRouter()
  const { currentUser, bookings, cancelBooking } = useAppStore()

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Please sign in to view your bookings</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
      </>
    )
  }

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')
  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-destructive" size={20} />
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-foreground" />
              </button>
              <h1 className="text-4xl font-bold text-foreground">My Bookings</h1>
            </div>
            <p className="text-muted-foreground">Manage and track all your event bookings</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-foreground">{bookings.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{confirmedBookings.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Cancelled</p>
              <p className="text-3xl font-bold text-destructive">{cancelledBookings.length}</p>
            </div>
          </div>

          {/* Bookings List */}
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusIcon = booking.status === 'confirmed' ? <CheckCircle className="text-green-600" size={20} /> : booking.status === 'cancelled' ? <XCircle className="text-destructive" size={20} /> : <Clock className="text-yellow-600" size={20} />
                return (
                  <div
                    key={booking.id}
                    className="bg-card rounded-lg border border-border p-6 space-y-4"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{booking.venueName}</h2>
                        <p className="text-muted-foreground">Booking ID: {booking.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcon}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 bg-secondary/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Event Date</p>
                          <p className="font-semibold text-foreground">
                            {format(new Date(booking.eventDate), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={20} className="text-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Guests</p>
                          <p className="font-semibold text-foreground">{booking.guestCount} people</p>
                        </div>
                      </div>
                    </div>

                    {/* Customizations */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Decoration Theme</p>
                        <p className="font-semibold text-foreground">{booking.decorationTheme}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Catering</p>
                        <p className="font-semibold text-foreground">{booking.cateringOption}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Entertainment</p>
                        <p className="font-semibold text-foreground">{booking.entertainmentService}</p>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                        <p className="text-foreground">{booking.specialRequests}</p>
                      </div>
                    )}

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold text-foreground">${booking.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors font-semibold"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <Link
                          href="/venues"
                          className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
                        >
                          Browse More
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-12 text-center space-y-4">
              <Calendar size={48} className="mx-auto text-muted-foreground" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
                <p className="text-muted-foreground mb-6">Start exploring venues and book your perfect event!</p>
                <Link
                  href="/venues"
                  className="inline-block px-6 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Browse Venues
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
