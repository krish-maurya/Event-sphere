'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { mockVenues } from '@/lib/mockData'

interface SearchVenuesProps {
  onSelect?: (venueId: string) => void
  placeholder?: string
}

export function SearchVenues({ onSelect, placeholder = 'Search venues...' }: SearchVenuesProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState(mockVenues)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const filtered = mockVenues.filter(
          (venue) =>
            venue.name.toLowerCase().includes(query.toLowerCase()) ||
            venue.location.toLowerCase().includes(query.toLowerCase()) ||
            venue.amenities.some((a) => a.toLowerCase().includes(query.toLowerCase()))
        )
        setResults(filtered)
        setActiveIndex(0)
      } else {
        setResults(mockVenues)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : i))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => (i > 0 ? i - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[activeIndex]) {
          onSelect?.(results[activeIndex].id)
          setQuery('')
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }, [results, activeIndex, onSelect])

  const handleSelect = (venueId: string) => {
    onSelect?.(venueId)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-[#2d2d2d] px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.08)] focus-within:border-[rgba(255,255,255,0.12)] transition-colors">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
          autoComplete="off"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#2d2d2d] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {results.map((venue, index) => (
            <div
              key={venue.id}
              onClick={() => handleSelect(venue.id)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0 ${
                index === activeIndex
                  ? 'bg-[#404040] text-white'
                  : 'hover:bg-[#353535] text-gray-300'
              }`}
            >
              <p className="font-medium text-sm">{venue.name}</p>
              <p className="text-xs text-gray-500 mt-1">{venue.location}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {isOpen && results.length === 0 && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2d2d2d] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 text-center z-50">
          <p className="text-gray-400 text-sm">No venues found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
