import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Booking } from './store'
import { Task, EventTimeline, TimelinePhase, Phase, TaskStatus, TaskPriority, Subtask, Comment, Attachment } from './workflowData'
import { EVENT_MANAGERS, STAFF_MEMBERS, VENDORS, BOOKING_PHASES } from './workflowData'

interface WorkflowState {
  // Admin state
  pendingBookings: Booking[]
  approvedBookings: Booking[]
  rejectedBookings: Booking[]
  
  // Event Manager assignments
  bookingEventManager: Record<string, string> // bookingId -> eventManagerId
  
  // Tasks and timelines
  bookingTasks: Record<string, Task[]> // bookingId -> tasks
  bookingTimelines: Record<string, EventTimeline> // bookingId -> timeline
  
  // Calendar view
  bookingsByDate: Record<string, string[]> // date -> bookingIds
  
  // Admin actions
  addPendingBooking: (booking: Booking) => void
  approveBooking: (bookingId: string) => void
  rejectBooking: (bookingId: string, reason?: string) => void
  assignEventManager: (bookingId: string, eventManagerId: string) => void
  
  // Event Manager actions
  createTimeline: (bookingId: string, phases: TimelinePhase[]) => void
  addTask: (bookingId: string, task: Task) => void
  updateTaskStatus: (bookingId: string, taskId: string, status: TaskStatus) => void
  assignStaff: (taskId: string, staffId: string) => void
  
  // Staff actions
  getMyTasks: (staffId: string) => Task[]
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void
  addComment: (taskId: string, comment: Comment) => void
  uploadAttachment: (taskId: string, attachment: Attachment) => void
  
  // Calendar
  getEventsForDate: (date: Date) => Booking[]
  getEventsForDateRange: (startDate: Date, endDate: Date) => Booking[]
  checkVenueAvailability: (venueId: string, eventDate: Date) => boolean
  
  // Progress tracking
  getBookingProgress: (bookingId: string) => number
  getCurrentPhase: (bookingId: string) => Phase | null
  getPhaseCompletion: (bookingId: string, phaseId: string) => number
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      pendingBookings: [],
      approvedBookings: [],
      rejectedBookings: [],
      bookingEventManager: {},
      bookingTasks: {},
      bookingTimelines: {},
      bookingsByDate: {},

      // Add new pending booking from user
      addPendingBooking: (booking: Booking) => {
        set((state) => ({
          pendingBookings: [...state.pendingBookings, booking],
        }))
      },

      // Admin: Approve booking
      approveBooking: (bookingId: string) => {
        set((state) => {
          const booking = state.pendingBookings.find((b) => b.id === bookingId)
          if (!booking) return state

          return {
            pendingBookings: state.pendingBookings.filter((b) => b.id !== bookingId),
            approvedBookings: [...state.approvedBookings, { ...booking, status: 'confirmed' }],
          }
        })
      },

      // Admin: Reject booking
      rejectBooking: (bookingId: string, reason?: string) => {
        set((state) => {
          const booking = state.pendingBookings.find((b) => b.id === bookingId)
          if (!booking) return state

          return {
            pendingBookings: state.pendingBookings.filter((b) => b.id !== bookingId),
            rejectedBookings: [...state.rejectedBookings, { ...booking, status: 'cancelled' }],
          }
        })
      },

      // Admin: Assign event manager
      assignEventManager: (bookingId: string, eventManagerId: string) => {
        set((state) => ({
          bookingEventManager: {
            ...state.bookingEventManager,
            [bookingId]: eventManagerId,
          },
        }))
      },

      // Event Manager: Create timeline
      createTimeline: (bookingId: string, phases: TimelinePhase[]) => {
        set((state) => ({
          bookingTimelines: {
            ...state.bookingTimelines,
            [bookingId]: {
              id: `timeline-${Date.now()}`,
              bookingId,
              phases,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }))
      },

      // Event Manager: Add task
      addTask: (bookingId: string, task: Task) => {
        set((state) => ({
          bookingTasks: {
            ...state.bookingTasks,
            [bookingId]: [...(state.bookingTasks[bookingId] || []), task],
          },
        }))
      },

      // Event Manager/Staff: Update task status
      updateTaskStatus: (bookingId: string, taskId: string, status: TaskStatus) => {
        set((state) => ({
          bookingTasks: {
            ...state.bookingTasks,
            [bookingId]: (state.bookingTasks[bookingId] || []).map((t) =>
              t.id === taskId ? { ...t, status } : t
            ),
          },
        }))
      },

      // Event Manager: Assign staff
      assignStaff: (taskId: string, staffId: string) => {
        set((state) => {
          const updatedTasks: Record<string, Task[]> = {}
          Object.keys(state.bookingTasks).forEach((bookingId) => {
            updatedTasks[bookingId] = state.bookingTasks[bookingId].map((t) =>
              t.id === taskId ? { ...t, assignedTo: staffId } : t
            )
          })
          return { bookingTasks: updatedTasks }
        })
      },

      // Staff: Get my tasks
      getMyTasks: (staffId: string) => {
        const state = get()
        const myTasks: Task[] = []
        Object.values(state.bookingTasks).forEach((tasks) => {
          myTasks.push(...tasks.filter((t) => t.assignedTo === staffId))
        })
        return myTasks
      },

      // Staff: Update subtask
      updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => {
        set((state) => {
          const updatedTasks: Record<string, Task[]> = {}
          Object.keys(state.bookingTasks).forEach((bookingId) => {
            updatedTasks[bookingId] = state.bookingTasks[bookingId].map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    subtasks: t.subtasks.map((s) =>
                      s.id === subtaskId ? { ...s, completed } : s
                    ),
                  }
                : t
            )
          })
          return { bookingTasks: updatedTasks }
        })
      },

      // Staff: Add comment
      addComment: (taskId: string, comment: Comment) => {
        set((state) => {
          const updatedTasks: Record<string, Task[]> = {}
          Object.keys(state.bookingTasks).forEach((bookingId) => {
            updatedTasks[bookingId] = state.bookingTasks[bookingId].map((t) =>
              t.id === taskId
                ? { ...t, comments: [...t.comments, comment] }
                : t
            )
          })
          return { bookingTasks: updatedTasks }
        })
      },

      // Staff: Upload attachment
      uploadAttachment: (taskId: string, attachment: Attachment) => {
        set((state) => {
          const updatedTasks: Record<string, Task[]> = {}
          Object.keys(state.bookingTasks).forEach((bookingId) => {
            updatedTasks[bookingId] = state.bookingTasks[bookingId].map((t) =>
              t.id === taskId
                ? { ...t, attachments: [...t.attachments, attachment] }
                : t
            )
          })
          return { bookingTasks: updatedTasks }
        })
      },

      // Calendar: Get events for date
      getEventsForDate: (date: Date) => {
        const state = get()
        const dateStr = date.toISOString().split('T')[0]
        const bookingIds = state.bookingsByDate[dateStr] || []
        return state.approvedBookings.filter((b) => bookingIds.includes(b.id))
      },

      // Calendar: Get events for date range
      getEventsForDateRange: (startDate: Date, endDate: Date) => {
        const state = get()
        return state.approvedBookings.filter(
          (b) => b.eventDate >= startDate && b.eventDate <= endDate
        )
      },

      // Calendar: Check venue availability
      checkVenueAvailability: (venueId: string, eventDate: Date) => {
        const state = get()
        const dateStr = eventDate.toISOString().split('T')[0]
        const eventsOnDate = state.approvedBookings.filter(
          (b) => b.venueId === venueId && 
          b.eventDate.toISOString().split('T')[0] === dateStr
        )
        return eventsOnDate.length === 0
      },

      // Progress tracking
      getBookingProgress: (bookingId: string) => {
        const state = get()
        const tasks = state.bookingTasks[bookingId] || []
        if (tasks.length === 0) return 0
        const completedTasks = tasks.filter((t) => t.status === 'completed').length
        return Math.round((completedTasks / tasks.length) * 100)
      },

      // Get current phase
      getCurrentPhase: (bookingId: string) => {
        const state = get()
        const timeline = state.bookingTimelines[bookingId]
        if (!timeline) return null
        const activePhase = timeline.phases.find((p) => p.status === 'active')
        return activePhase?.phase || null
      },

      // Get phase completion percentage
      getPhaseCompletion: (bookingId: string, phaseId: string) => {
        const state = get()
        const tasks = (state.bookingTasks[bookingId] || []).filter(
          (t) => t.phase === phaseId
        )
        if (tasks.length === 0) return 0
        const completedTasks = tasks.filter((t) => t.status === 'completed').length
        return Math.round((completedTasks / tasks.length) * 100)
      },
    }),
    {
      name: 'workflow-store',
      version: 1,
    }
  )
)
