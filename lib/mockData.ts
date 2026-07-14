export interface Venue {
  id: string
  name: string
  location: string
  city: string
  capacity: number
  pricePerHead: number
  images: string[]
  description: string
  amenities: string[]
  decorationThemes: string[]
  cateringOptions: string[]
  entertainmentServices: string[]
  availableDates: string[]
  rating: number
  reviews: number
}

export const DECORATION_THEMES = [
  'Elegant Classic',
  'Modern Minimalist',
  'Romantic Garden',
  'Industrial Chic',
  'Bohemian',
  'Art Deco',
  'Tropical Paradise',
  'Rustic Barn',
  'Luxury Gold',
  'Winter Wonderland',
]

export const CATERING_OPTIONS = [
  'Multi-cuisine Buffet',
  'Plated 3-Course Meal',
  'Modern Fusion',
  'Traditional Cuisine',
  'Vegetarian Delights',
  'International Gourmet',
  'BBQ & Grilling',
  'Asian Fusion',
  'Mediterranean',
  'Dessert & Cake Station',
]

export const ENTERTAINMENT_SERVICES = [
  'Live Band',
  'DJ & Dance Floor',
  'String Quartet',
  'Harpist',
  'Photographer & Videographer',
  'Photo Booth',
  'Live Painter',
  'Magician & Entertainer',
  'Fireworks Display',
  'Drone Show',
  'Live Comedy',
  'Acoustic Duo',
]

export const mockVenues: Venue[] = [
  {
    id: 'venue-001',
    name: 'Grand Ballroom Estate',
    location: '123 Park Avenue, Manhattan',
    city: 'New York',
    capacity: 500,
    pricePerHead: 150,
    images: [
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=800&h=600&fit=crop',
    ],
    description:
      'Luxurious ballroom with crystal chandeliers, marble floors, and stunning city views. Perfect for grand celebrations.',
    amenities: ['Air Conditioning', 'Valet Parking', 'WiFi', 'On-site Catering Kitchen', 'Bridal Suite', 'Wheelchair Accessible'],
    decorationThemes: ['Elegant Classic', 'Luxury Gold', 'Modern Minimalist'],
    cateringOptions: ['International Gourmet', 'Plated 3-Course Meal', 'Multi-cuisine Buffet'],
    entertainmentServices: ['Live Band', 'DJ & Dance Floor', 'Photographer & Videographer'],
    availableDates: ['2026-07-15', '2026-07-22', '2026-08-05', '2026-08-12', '2026-09-10', '2026-10-15'],
    rating: 4.8,
    reviews: 324,
  },
  {
    id: 'venue-002',
    name: 'Riverside Garden Pavilion',
    location: '456 Riverside Drive, Brooklyn',
    city: 'Brooklyn',
    capacity: 300,
    pricePerHead: 85,
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    ],
    description:
      'Open-air pavilion surrounded by lush gardens overlooking the river. Ideal for intimate outdoor celebrations.',
    amenities: ['Natural Lighting', 'Rain Coverage', 'Picnic Tables', 'BBQ Facilities', 'Riverside Deck', 'Parking'],
    decorationThemes: ['Romantic Garden', 'Bohemian', 'Tropical Paradise'],
    cateringOptions: ['BBQ & Grilling', 'Mediterranean', 'Asian Fusion'],
    entertainmentServices: ['Acoustic Duo', 'String Quartet', 'Photo Booth'],
    availableDates: ['2026-07-10', '2026-07-25', '2026-08-08', '2026-09-05', '2026-10-10', '2026-11-15'],
    rating: 4.6,
    reviews: 218,
  },
  {
    id: 'venue-003',
    name: 'Contemporary Loft Downtown',
    location: '789 Broadway, Lower Manhattan',
    city: 'New York',
    capacity: 250,
    pricePerHead: 120,
    images: [
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540932976986-30128078f3c5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519624592104-a86d97d6fef9?w=800&h=600&fit=crop',
    ],
    description:
      'Sleek industrial loft with exposed brick, floor-to-ceiling windows, and an art gallery aesthetic. Perfect for modern celebrations.',
    amenities: ['Floor-to-Ceiling Windows', 'Built-in Sound System', 'Rooftop Access', 'Modern Bathrooms', 'ADA Compliant'],
    decorationThemes: ['Modern Minimalist', 'Industrial Chic', 'Art Deco'],
    cateringOptions: ['Modern Fusion', 'Vegetarian Delights', 'International Gourmet'],
    entertainmentServices: ['DJ & Dance Floor', 'Live Painter', 'Photographer & Videographer'],
    availableDates: ['2026-07-18', '2026-08-01', '2026-08-15', '2026-09-12', '2026-10-20', '2026-11-10'],
    rating: 4.7,
    reviews: 287,
  },
  {
    id: 'venue-004',
    name: 'Rustic Barn Retreat',
    location: '234 Valley Road, Upstate',
    city: 'Hudson Valley',
    capacity: 200,
    pricePerHead: 75,
    images: [
      'https://images.unsplash.com/photo-1569269190210-57cebcbf320c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520938745588-0707b026f488?w=800&h=600&fit=crop',
    ],
    description:
      'Charming barn with rustic wooden beams, string lights, and countryside views. Perfect for laid-back celebrations.',
    amenities: ['Outdoor Firepit', 'Hay Barn', 'Parking', 'Picnic Area', 'Kitchen Access'],
    decorationThemes: ['Rustic Barn', 'Bohemian', 'Romantic Garden'],
    cateringOptions: ['BBQ & Grilling', 'Traditional Cuisine', 'Multi-cuisine Buffet'],
    entertainmentServices: ['Live Band', 'Acoustic Duo', 'Bonfire'],
    availableDates: ['2026-07-12', '2026-08-02', '2026-08-20', '2026-09-18', '2026-10-25', '2026-11-08'],
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 'venue-005',
    name: 'Seaside Luxury Resort',
    location: '567 Beachfront Drive, Hamptons',
    city: 'East Hampton',
    capacity: 400,
    pricePerHead: 180,
    images: [
      'https://images.unsplash.com/photo-1519157991639-bf0b5b8f1a53?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519624592104-a86d97d6fef9?w=800&h=600&fit=crop',
    ],
    description:
      'Exclusive beachfront resort with private beach access, infinity pool, and oceanfront suites. Ultimate luxury experience.',
    amenities: ['Private Beach', 'Infinity Pool', 'Suites', 'Spa', 'Beach Bar', 'Concierge'],
    decorationThemes: ['Tropical Paradise', 'Luxury Gold', 'Romantic Garden'],
    cateringOptions: ['International Gourmet', 'Mediterranean', 'Seafood Specialties'],
    entertainmentServices: ['DJ & Dance Floor', 'Live Band', 'Fireworks Display'],
    availableDates: ['2026-07-20', '2026-08-10', '2026-09-08', '2026-10-05', '2026-11-12'],
    rating: 4.9,
    reviews: 412,
  },
  {
    id: 'venue-006',
    name: 'Historic Manor House',
    location: '890 Heritage Lane, Queens',
    city: 'Queens',
    capacity: 350,
    pricePerHead: 95,
    images: [
      'https://images.unsplash.com/photo-1519167758993-c68ff64aa493?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519624592104-a86d97d6fef9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    ],
    description:
      'Stately Victorian mansion with ornate gardens, marble staircases, and period architecture. Timeless elegance for weddings.',
    amenities: ['Historic Gardens', 'Multiple Rooms', 'Bridal Suite', 'Library', 'Terrace', 'Parking'],
    decorationThemes: ['Elegant Classic', 'Romantic Garden', 'Luxury Gold'],
    cateringOptions: ['Plated 3-Course Meal', 'International Gourmet', 'Traditional Cuisine'],
    entertainmentServices: ['String Quartet', 'Harpist', 'Photographer & Videographer'],
    availableDates: ['2026-07-16', '2026-08-06', '2026-09-03', '2026-10-08', '2026-11-20'],
    rating: 4.6,
    reviews: 298,
  },
]

export const getVenueById = (id: string): Venue | undefined => {
  return mockVenues.find((venue) => venue.id === id)
}

export const filterVenues = (filters: { city?: string; maxPrice?: number; minCapacity?: number }): Venue[] => {
  return mockVenues.filter((venue) => {
    if (filters.city && venue.city !== filters.city) return false
    if (filters.maxPrice && venue.pricePerHead > filters.maxPrice) return false
    if (filters.minCapacity && venue.capacity < filters.minCapacity) return false
    return true
  })
}
