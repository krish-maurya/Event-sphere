'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/Header'
import { VenueCard } from '@/components/VenueCard'
import { mockVenues } from '@/lib/mockData'

const CITIES = ['All', 'New York', 'Brooklyn', 'Hudson Valley', 'East Hampton', 'Queens']
const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-75', label: 'Under $75/head' },
  { value: '75-125', label: '$75 - $125/head' },
  { value: '125-200', label: '$125 - $200/head' },
  { value: '200+', label: '$200+/head' },
]

export default function VenuesPage() {
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      // City filter
      if (selectedCity !== 'All' && venue.city !== selectedCity) return false

      // Price filter
      const price = venue.pricePerHead
      switch (selectedPriceRange) {
        case '0-75':
          if (price > 75) return false
          break
        case '75-125':
          if (price < 75 || price > 125) return false
          break
        case '125-200':
          if (price < 125 || price > 200) return false
          break
        case '200+':
          if (price < 200) return false
          break
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          venue.name.toLowerCase().includes(query) ||
          venue.description.toLowerCase().includes(query) ||
          venue.location.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [selectedCity, selectedPriceRange, searchQuery])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Search & Filters Section */}
        <section className="bg-[#2d2d2d] border-b border-[rgba(255,255,255,0.08)] sticky top-16 z-40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-6 space-y-6">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-[#1a1a1a] px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.08)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search venues, locations, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Location
                </label>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                        selectedCity === city
                          ? 'bg-white text-black'
                          : 'bg-[#404040] text-gray-300 hover:bg-[#505050]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#404040] text-white border border-[rgba(255,255,255,0.08)] outline-none hover:border-[rgba(255,255,255,0.12)]"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-12">
          {filteredVenues.length > 0 ? (
            <>
              <p className="text-gray-400 mb-8">
                Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-6">
                No venues found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All')
                  setSelectedPriceRange('all')
                  setSearchQuery('')
                }}
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:opacity-85 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
