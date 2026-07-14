'use client'

import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useParams, useRouter } from 'next/navigation'
import { Star, ThumbsUp, MessageCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReviewSchema, type ReviewInput } from '@/lib/schemas'
import { mockVenues } from '@/lib/mockData'

export default function ReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string
  const { currentUser, reviews, addReview, getVenueReviews } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewInput>({
    resolver: zodResolver(ReviewSchema),
  })

  const venue = mockVenues.find((v) => v.id === venueId)
  const venueReviews = getVenueReviews(venueId)

  if (!venue) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Venue not found</h1>
            <Link href="/venues" className="inline-block px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90">
              Back to Venues
            </Link>
          </div>
        </main>
      </>
    )
  }

  const onSubmit = async (data: ReviewInput) => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    const newReview = {
      id: `review-${Date.now()}`,
      venueId,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      helpful: 0,
      createdAt: new Date(),
    }

    addReview(newReview)
    reset()
    setRating(0)
    setShowForm(false)
  }

  const avgRating = venueReviews.length > 0 ? Math.round((venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length) * 10) / 10 : 0

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href={`/venue/${venueId}`} className="text-foreground hover:underline mb-4 block">
              &larr; Back to {venue.name}
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">{venue.name} Reviews</h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-foreground">{avgRating}</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.round(avgRating) ? 'fill-primary text-foreground' : 'text-muted-foreground'} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Based on {venueReviews.length} reviews</p>
              </div>
            </div>

            {/* Write Review Button */}
            {currentUser && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Share Your Experience</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setRating(value)
                          register('rating').onChange({ target: { value } } as any)
                        }}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star size={32} className={value <= rating ? 'fill-primary text-foreground' : 'text-muted-foreground'} />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                    Review Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Perfect for weddings!"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    {...register('title')}
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-foreground mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    placeholder="Share details about your experience..."
                    rows={6}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                    {...register('comment')}
                  />
                  {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
                </div>

                <button type="submit" className="px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {venueReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              venueReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < review.rating ? 'fill-primary text-foreground' : 'text-muted-foreground'} />
                        ))}
                      </div>
                      <h3 className="font-semibold text-foreground">{review.title}</h3>
                      <p className="text-sm text-muted-foreground">{review.userName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
                  </div>

                  <p className="text-foreground mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp size={16} />
                      <span className="text-sm">Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}
