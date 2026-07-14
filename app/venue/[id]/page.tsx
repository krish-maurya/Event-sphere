'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { useWorkflowStore } from '@/lib/workflowStore'
import { Header } from '@/components/Header'
import { Calendar } from '@/components/Calendar'
import { Select } from '@/components/Select'
import { getVenueById, DECORATION_THEMES, CATERING_OPTIONS, ENTERTAINMENT_SERVICES } from '@/lib/mockData'
import { Star, MapPin, Users, Wifi, Award, ArrowLeft, Check } from 'lucide-react'
import { format } from 'date-fns'

const STEPS = ['Date', 'Guests', 'Customization', 'Review']

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, addBooking } = useAppStore()
  const venueId = params.id as string
  const venue = getVenueById(venueId)

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [guestCount, setGuestCount] = useState(50)
  const [decorationTheme, setDecorationTheme] = useState('')
  const [cateringOption, setCateringOption] = useState('')
  const [entertainmentService, setEntertainmentService] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Venue not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const totalPrice = guestCount * venue.pricePerHead + (entertainmentService ? 2000 : 0)
  const canProceedToNext =
    (currentStep === 0 && selectedDate) ||
    (currentStep === 1 && guestCount > 0) ||
    (currentStep === 2 && decorationTheme && cateringOption && entertainmentService) ||
    currentStep === 3

  const handleBooking = async () => {
    if (!currentUser) {
      router.push('/auth/login?redirect=/bookings')
      return
    }

    setIsBooking(true)

    const booking = {
      id: `booking-${Date.now()}`,
      userId: currentUser.id,
      venueId: venue.id,
      venueName: venue.name,
      eventDate: selectedDate!,
      guestCount,
      decorationTheme,
      cateringOption,
      entertainmentService,
      specialRequests,
      totalPrice,
      status: 'pending' as const,
      guests: [],
      paymentStatus: 'pending' as const,
      createdAt: new Date(),
    }

    // Add to main store for user's bookings page
    addBooking(booking)
    
    // Also add to workflow store for admin approval
    const { addPendingBooking } = useWorkflowStore.getState()
    addPendingBooking(booking)
    
    setIsBooking(false)

    // Redirect to bookings page
    router.push('/bookings')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Gallery */}
        <section className="relative h-96 bg-muted overflow-hidden">
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover"
            priority
          />
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-card rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Venue Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{venue.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={18} />
                    {venue.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-500 text-yellow-500" size={18} />
                    {venue.rating} ({venue.reviews} reviews)
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-foreground">
                      <Award size={18} className="text-foreground" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Gallery</h2>
                <div className="grid grid-cols-3 gap-4">
                  {venue.images.map((image, idx) => (
                    <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${venue.name} ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Wizard */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20 space-y-6">
                {/* Steps */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Booking Steps</h3>
                  <div className="space-y-2">
                    {STEPS.map((step, idx) => (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-2 rounded transition-colors ${
                          currentStep === idx
                            ? 'bg-primary/10 text-foreground'
                            : currentStep > idx
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            currentStep > idx
                              ? 'bg-primary text-foreground-foreground'
                              : currentStep === idx
                                ? 'bg-primary text-foreground-foreground'
                                : 'bg-secondary'
                          }`}
                        >
                          {currentStep > idx ? <Check size={16} /> : idx + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-4 border-t border-border pt-6">
                  {currentStep === 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Select Event Date</h4>
                      <Calendar
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        availableDates={venue.availableDates}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Number of Guests</h4>
                      <div className="space-y-3">
                        <input
                          type="number"
                          min="1"
                          max={venue.capacity}
                          value={guestCount}
                          onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                        <p className="text-sm text-muted-foreground">
                          Capacity: Up to {venue.capacity} guests
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <Select
                        label="Decoration Theme"
                        options={venue.decorationThemes.map((t) => ({ value: t, label: t }))}
                        value={decorationTheme}
                        onChange={setDecorationTheme}
                      />
                      <Select
                        label="Catering"
                        options={venue.cateringOptions.map((c) => ({ value: c, label: c }))}
                        value={cateringOption}
                        onChange={setCateringOption}
                      />
                      <Select
                        label="Entertainment"
                        options={venue.entertainmentServices.map((e) => ({ value: e, label: e }))}
                        value={entertainmentService}
                        onChange={setEntertainmentService}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Special Requests
                        </label>
                        <textarea
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="Any additional details..."
                          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Venue:</span>
                          <span className="text-foreground font-semibold">{venue.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="text-foreground font-semibold">
                            {selectedDate ? format(selectedDate, 'MMM d, yyyy') : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests:</span>
                          <span className="text-foreground font-semibold">{guestCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Theme:</span>
                          <span className="text-foreground font-semibold">{decorationTheme}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2 flex justify-between">
                          <span className="text-foreground font-semibold">Total:</span>
                          <span className="text-foreground font-bold text-lg">${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-2 border-t border-border pt-6">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex-1 px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Back
                  </button>
                  {currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceedToNext}
                      className="flex-1 px-3 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleBooking}
                      disabled={isBooking || !currentUser}
                      className="flex-1 px-3 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {isBooking ? 'Booking...' : currentUser ? 'Confirm Booking' : 'Sign In to Book'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
