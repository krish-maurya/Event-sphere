'use client'

import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Heart, MapPin, Users, DollarSign, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { mockVenues } from '@/lib/mockData'

export default function WishlistPage() {
  const router = useRouter()
  const { currentUser, wishlist, removeFromWishlist } = useAppStore()

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Please sign in to view your wishlist</h1>
            <Link href="/auth/login" className="inline-block px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90">
              Sign In
            </Link>
          </div>
        </main>
      </>
    )
  }

  const wishlistVenues = mockVenues.filter((v) => wishlist.includes(v.id))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">{wishlist.length} venue(s) saved</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No venues saved yet</h2>
              <p className="text-muted-foreground mb-6">Start saving venues to compare and plan your perfect event</p>
              <Link href="/venues" className="inline-block px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90">
                Browse Venues
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistVenues.map((venue) => (
                <div key={venue.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Venue Image */}
                    <div className="rounded-lg overflow-hidden bg-secondary h-48 md:h-auto">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground font-semibold">{venue.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Venue Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{venue.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <MapPin size={16} />
                          <span>{venue.location}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground">Capacity</div>
                          <div className="flex items-center gap-2 text-foreground font-semibold">
                            <Users size={16} />
                            {venue.capacity}
                          </div>
                        </div>
                        <div className="bg-secondary p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground">Price per Guest</div>
                          <div className="flex items-center gap-2 text-foreground font-semibold">
                            <DollarSign size={16} />
                            ${venue.pricePerHead}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < venue.rating ? 'fill-primary text-foreground' : 'text-muted-foreground'} />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({venue.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/venue/${venue.id}`}
                        className="flex-1 px-4 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(venue.id)}
                        className="px-4 py-3 border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10 transition-colors font-semibold"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
