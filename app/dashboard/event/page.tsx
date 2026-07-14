'use client'

import { Header } from '@/components/Header'
import { useState } from 'react'

export default function EventDashboard() {
  const [selectedTab, setSelectedTab] = useState('bookings')

  const bookings = [
    {
      id: 1,
      eventName: 'Wedding Reception',
      venueName: 'Grand Ballroom',
      date: '2024-01-20',
      guests: 150,
      status: 'confirmed',
      totalPrice: 15000,
    },
    {
      id: 2,
      eventName: 'Corporate Gala',
      venueName: 'Downtown Hall',
      date: '2024-01-25',
      guests: 200,
      status: 'pending',
      totalPrice: 22000,
    },
  ]

  const wishlist = [
    { id: 1, name: 'Grand Ballroom', location: 'Manhattan', pricePerHead: 150 },
    { id: 2, name: 'Rooftop Terrace', location: 'Brooklyn', pricePerHead: 120 },
  ]

  return (
    <>
      <Header />
      <main className="bg-[#1a1a1a] text-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">My Events</h1>
            <p className="text-gray-400">Manage your bookings and preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[rgba(255,255,255,0.08)]">
            {['bookings', 'wishlist', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-3 font-medium transition-colors capitalize ${
                  selectedTab === tab
                    ? 'text-white border-b-2 border-white -mb-[2px]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bookings Tab */}
          {selectedTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#2d2d2d] p-6 rounded-lg border border-[rgba(255,255,255,0.08)]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{booking.eventName}</h3>
                        <p className="text-gray-400">{booking.venueName}</p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
                      <p>Date: {booking.date}</p>
                      <p>Guests: {booking.guests}</p>
                      <p>Total: ${booking.totalPrice}</p>
                    </div>
                    <button className="text-white font-medium hover:opacity-85 transition-opacity">
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No bookings yet</p>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {selectedTab === 'wishlist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-[#2d2d2d] p-6 rounded-lg border border-[rgba(255,255,255,0.08)]"
                >
                  <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                  <p className="text-gray-400 mb-4">{venue.location}</p>
                  <p className="text-white font-medium">${venue.pricePerHead}/head</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {selectedTab === 'reviews' && (
            <div className="bg-[#2d2d2d] p-6 rounded-lg border border-[rgba(255,255,255,0.08)] text-center py-12">
              <p className="text-gray-400 mb-4">No reviews yet</p>
              <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:opacity-85 transition-opacity">
                Write a Review
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
