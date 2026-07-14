'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useWorkflowStore } from '@/lib/workflowStore'
import { BOOKING_PHASES } from '@/lib/workflowData'
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'

export default function ProgressTracker() {
  const { currentUser, bookings } = useAppStore()
  const { approvedBookings, getBookingProgress, getCurrentPhase, getPhaseCompletion } = useWorkflowStore()
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const monthStart = startOfMonth(selectedMonth)
  const monthEnd = endOfMonth(selectedMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const eventsByDay: Record<string, typeof approvedBookings> = {}
  daysInMonth.forEach((day) => {
    const dayStr = day.toISOString().split('T')[0]
    eventsByDay[dayStr] = approvedBookings.filter(
      (b) => b.eventDate.toISOString().split('T')[0] === dayStr
    )
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Event Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor all events and their phases</p>
          </div>

          {/* Calendar View */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {format(selectedMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                  className="px-3 py-1 border border-border rounded hover:bg-secondary transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setSelectedMonth(new Date())}
                  className="px-3 py-1 border border-border rounded hover:bg-secondary transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                  className="px-3 py-1 border border-border rounded hover:bg-secondary transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-foreground py-2 text-sm">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {daysInMonth.map((day) => {
                const dayStr = day.toISOString().split('T')[0]
                const events = eventsByDay[dayStr] || []
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={dayStr}
                    className={`p-2 rounded-lg min-h-24 border ${
                      isToday ? 'border-foreground bg-primary/5' : 'border-border'
                    } ${isSameMonth(day, selectedMonth) ? '' : 'bg-secondary/20'}`}
                  >
                    <p className={`text-sm font-semibold ${isToday ? 'text-foreground' : 'text-foreground'}`}>
                      {format(day, 'd')}
                    </p>
                    {events.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs bg-primary/10 text-foreground rounded px-1 py-0.5 truncate"
                          >
                            {event.venueName}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{events.length - 2} more</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Events Progress */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>

            {approvedBookings.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <AlertCircle className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No approved bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedBookings
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                  .map((booking) => {
                    const progress = getBookingProgress(booking.id)
                    const currentPhase = getCurrentPhase(booking.id)

                    return (
                      <div
                        key={booking.id}
                        className="bg-card rounded-lg border border-border p-6 space-y-4"
                      >
                        {/* Event Info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">{booking.venueName}</h3>
                            <p className="text-muted-foreground">
                              {format(new Date(booking.eventDate), 'MMMM d, yyyy')} • {booking.guestCount} guests
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-primary/20 text-foreground rounded-full text-sm font-semibold">
                            {progress}% Complete
                          </span>
                        </div>

                        {/* Overall Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-semibold">Overall Progress</span>
                            <span className="text-muted-foreground">{progress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Phase Progress */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Phase Progress</p>
                          <div className="space-y-2">
                            {BOOKING_PHASES.map((phase) => {
                              const phaseCompletion = getPhaseCompletion(booking.id, phase.id)
                              return (
                                <div key={phase.id} className="text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-muted-foreground">{phase.name}</span>
                                    <span className="text-foreground font-semibold">{phaseCompletion}%</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-1">
                                    <div
                                      className="bg-primary h-1 rounded-full transition-all"
                                      style={{ width: `${phaseCompletion}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex gap-2 pt-4 border-t border-border">
                          {currentPhase && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={16} className="text-blue-600" />
                              <span className="text-foreground">
                                Current Phase: <span className="font-semibold">{currentPhase.name}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Events</p>
                  <p className="text-3xl font-bold text-foreground">{approvedBookings.length}</p>
                </div>
                <TrendingUp className="text-foreground" size={32} />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg. Completion</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(
                      approvedBookings.reduce((sum, b) => sum + getBookingProgress(b.id), 0) /
                        (approvedBookings.length || 1)
                    )}
                    %
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Upcoming (30 days)</p>
                  <p className="text-3xl font-bold text-foreground">
                    {
                      approvedBookings.filter((b) => {
                        const eventDate = new Date(b.eventDate)
                        const today = new Date()
                        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                        return eventDate >= today && eventDate <= thirtyDaysFromNow
                      }).length
                    }
                  </p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${approvedBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-foreground" size={32} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
