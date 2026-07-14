import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users } from 'lucide-react'
import type { VenueRow } from '@/lib/database'

interface VenueCardProps {
  venue: VenueRow
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`}>
      <div className="group h-full rounded-lg border border-[rgba(255,255,255,0.08)] overflow-hidden hover:border-[rgba(255,255,255,0.16)] transition-all cursor-pointer bg-[#2d2d2d] hover:bg-[#353535]">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-700">
          <Image
            src={venue.images[0] || '/placeholder.jpg'}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
            ${venue.price_per_head}/head
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white truncate">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
              <MapPin size={16} />
              <span className="truncate">{venue.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2 h-10">
            {venue.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-gray-500 text-gray-500" />
              <span className="text-sm font-semibold text-white">{venue.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users size={16} />
              <span>Up to {venue.capacity}</span>
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="flex flex-wrap gap-1">
            {venue.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{venue.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
