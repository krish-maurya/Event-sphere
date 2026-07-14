// Event Manager Data
export interface EventManager {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  rating: number
  bookingsManaged: number
  experience: string
  avatar: string
}

export const EVENT_MANAGERS: EventManager[] = [
  {
    id: 'em-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@eventvenue.com',
    phone: '+1-555-0101',
    specialization: 'Weddings',
    rating: 4.9,
    bookingsManaged: 156,
    experience: '8 years',
    avatar: 'SJ',
  },
  {
    id: 'em-002',
    name: 'Michael Chen',
    email: 'michael.chen@eventvenue.com',
    phone: '+1-555-0102',
    specialization: 'Corporate Events',
    rating: 4.8,
    bookingsManaged: 203,
    experience: '10 years',
    avatar: 'MC',
  },
  {
    id: 'em-003',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@eventvenue.com',
    phone: '+1-555-0103',
    specialization: 'Engagements',
    rating: 4.7,
    bookingsManaged: 89,
    experience: '5 years',
    avatar: 'JM',
  },
]

// Staff Data
export interface Staff {
  id: string
  name: string
  role: 'Decorator' | 'Caterer' | 'Photographer' | 'Coordinator' | 'Setup Crew'
  email: string
  phone: string
  skills: string[]
  availability: boolean
  completedTasks: number
  avatar: string
}

export const STAFF_MEMBERS: Staff[] = [
  {
    id: 'staff-001',
    name: 'Emma Wilson',
    role: 'Coordinator',
    email: 'emma@eventvenue.com',
    phone: '+1-555-0201',
    skills: ['Planning', 'Communication', 'Budget Management'],
    availability: true,
    completedTasks: 45,
    avatar: 'EW',
  },
  {
    id: 'staff-002',
    name: 'David Park',
    role: 'Decorator',
    email: 'david@eventvenue.com',
    phone: '+1-555-0202',
    skills: ['Floral Arrangement', 'Theme Design', 'Layout'],
    availability: true,
    completedTasks: 78,
    avatar: 'DP',
  },
  {
    id: 'staff-003',
    name: 'Lisa Anderson',
    role: 'Photographer',
    email: 'lisa@eventvenue.com',
    phone: '+1-555-0203',
    skills: ['Photography', 'Videography', 'Editing'],
    availability: false,
    completedTasks: 102,
    avatar: 'LA',
  },
  {
    id: 'staff-004',
    name: 'Robert Taylor',
    role: 'Setup Crew',
    email: 'robert@eventvenue.com',
    phone: '+1-555-0204',
    skills: ['Setup', 'Teardown', 'Heavy Lifting'],
    availability: true,
    completedTasks: 156,
    avatar: 'RT',
  },
]

// Vendor Data
export interface Vendor {
  id: string
  name: string
  category: 'Catering' | 'Decoration' | 'Photography' | 'Entertainment' | 'Florist'
  email: string
  phone: string
  rating: number
  price: number
  description: string
  portfolio: string[]
  availability: boolean
}

export const VENDORS: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'Gourmet Catering Co.',
    category: 'Catering',
    email: 'info@gourmetcatering.com',
    phone: '+1-555-0301',
    rating: 4.8,
    price: 85,
    description: 'Premium multi-cuisine catering services',
    portfolio: ['multicuisine', 'fusion', 'traditional'],
    availability: true,
  },
  {
    id: 'vendor-002',
    name: 'Bloom & Blossom Florals',
    category: 'Florist',
    email: 'hello@bloomblossom.com',
    phone: '+1-555-0302',
    rating: 4.9,
    price: 45,
    description: 'Expert floral designs and arrangements',
    portfolio: ['weddings', 'corporate', 'engagements'],
    availability: true,
  },
  {
    id: 'vendor-003',
    name: 'Elite Photography Studio',
    category: 'Photography',
    email: 'contact@elitephoto.com',
    phone: '+1-555-0303',
    rating: 4.7,
    price: 120,
    description: 'Professional photography and videography',
    portfolio: ['weddings', 'candid', 'drone'],
    availability: true,
  },
  {
    id: 'vendor-004',
    name: 'Sound & Vision Entertainment',
    category: 'Entertainment',
    email: 'booking@soundvision.com',
    phone: '+1-555-0304',
    rating: 4.6,
    price: 65,
    description: 'DJ, live bands, and entertainment services',
    portfolio: ['dj', 'liveband', 'mc'],
    availability: true,
  },
]

// Booking Phases
export interface Phase {
  id: string
  name: string
  description: string
  order: number
  percentage: number
}

export const BOOKING_PHASES: Phase[] = [
  {
    id: 'phase-1',
    name: 'Pending',
    description: 'Awaiting admin approval',
    order: 1,
    percentage: 0,
  },
  {
    id: 'phase-2',
    name: 'Approved',
    description: 'Booking approved by admin',
    order: 2,
    percentage: 20,
  },
  {
    id: 'phase-3',
    name: 'Timeline Created',
    description: 'Event timeline and tasks created',
    order: 3,
    percentage: 40,
  },
  {
    id: 'phase-4',
    name: 'Decoration Started',
    description: 'Decoration phase in progress',
    order: 4,
    percentage: 60,
  },
  {
    id: 'phase-5',
    name: 'Catering Ready',
    description: 'Catering confirmed and ready',
    order: 5,
    percentage: 80,
  },
  {
    id: 'phase-6',
    name: 'Photography Ready',
    description: 'Photography team assigned and ready',
    order: 6,
    percentage: 90,
  },
  {
    id: 'phase-7',
    name: 'Completed',
    description: 'Event completed successfully',
    order: 7,
    percentage: 100,
  },
]

// Task Types
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  bookingId: string
  title: string
  description: string
  assignedTo: string // staff id
  phase: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date
  startDate?: Date
  completedDate?: Date
  subtasks: Subtask[]
  comments: Comment[]
  attachments: Attachment[]
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  assignedTo?: string
}

export interface Comment {
  id: string
  author: string
  text: string
  timestamp: Date
}

export interface Attachment {
  id: string
  name: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

export interface EventTimeline {
  id: string
  bookingId: string
  phases: TimelinePhase[]
  createdAt: Date
  updatedAt: Date
}

export interface TimelinePhase {
  id: string
  phase: Phase
  tasks: Task[]
  startDate: Date
  endDate: Date
  status: 'pending' | 'active' | 'completed'
}
