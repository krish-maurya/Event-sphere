'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useWorkflowStore } from '@/lib/workflowStore'
import { BOOKING_PHASES, STAFF_MEMBERS } from '@/lib/workflowData'
import { Calendar, Users, Task, Plus, ArrowRight, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function EventManagerDashboard() {
  const params = useParams()
  const bookingId = params.id as string
  const { currentUser, bookings } = useAppStore()
  const { bookingTasks, approvedBookings, addTask, createTimeline } = useWorkflowStore()
  
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    phase: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  })

  const booking = approvedBookings.find((b) => b.id === bookingId)
  const tasks = bookingTasks[bookingId] || []

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Please sign in</p>
          </div>
        </main>
      </>
    )
  }

  if (!booking) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Booking not found</p>
          </div>
        </main>
      </>
    )
  }

  const handleAddTask = () => {
    if (!newTaskData.title || !newTaskData.phase || !newTaskData.assignedTo) {
      alert('Please fill in all required fields')
      return
    }

    const task = {
      id: `task-${Date.now()}`,
      bookingId,
      title: newTaskData.title,
      description: newTaskData.description,
      assignedTo: newTaskData.assignedTo,
      phase: newTaskData.phase,
      status: 'todo' as const,
      priority: newTaskData.priority as 'low' | 'medium' | 'high' | 'urgent',
      dueDate: new Date(newTaskData.dueDate),
      subtasks: [],
      comments: [],
      attachments: [],
    }

    addTask(bookingId, task)
    setNewTaskData({
      title: '',
      description: '',
      phase: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
    })
    setShowNewTask(false)
  }

  const tasksByPhase = BOOKING_PHASES.reduce((acc, phase) => {
    acc[phase.id] = tasks.filter((t) => t.phase === phase.id)
    return acc
  }, {} as Record<string, typeof tasks>)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{booking.venueName}</h1>
              <p className="text-muted-foreground">Event on {format(new Date(booking.eventDate), 'MMMM d, yyyy')}</p>
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="text-2xl font-bold text-foreground">{booking.guestCount}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground">${booking.totalPrice.toLocaleString()}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Tasks Created</p>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              </div>
            </div>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setShowNewTask(!showNewTask)}
            className="px-4 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Add Task
          </button>

          {/* New Task Form */}
          {showNewTask && (
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
                
                <select
                  value={newTaskData.phase}
                  onChange={(e) => setNewTaskData({ ...newTaskData, phase: e.target.value })}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                >
                  <option value="">Select phase...</option>
                  {BOOKING_PHASES.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Task description"
                value={newTaskData.description}
                onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                rows={3}
              />

              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>

                <input
                  type="date"
                  value={newTaskData.dueDate}
                  onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                />

                <select
                  value={newTaskData.assignedTo}
                  onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value })}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                >
                  <option value="">Assign to staff...</option>
                  {STAFF_MEMBERS.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Create Task
                </button>
                <button
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tasks by Phase */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Event Timeline & Tasks</h2>
            
            {BOOKING_PHASES.map((phase) => (
              <div key={phase.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                  <div className="ml-auto text-sm font-semibold text-foreground">{phase.percentage}%</div>
                </div>

                {tasksByPhase[phase.id]?.length > 0 ? (
                  <div className="ml-6 space-y-2 border-l-2 border-foreground/20 pl-6">
                    {tasksByPhase[phase.id].map((task) => {
                      const staff = STAFF_MEMBERS.find((s) => s.id === task.assignedTo)
                      return (
                        <div
                          key={task.id}
                          className="bg-card p-4 rounded-lg border border-border hover:border-foreground transition-colors space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                task.priority === 'urgent'
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'high'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            {staff && (
                              <>
                                <div className="w-6 h-6 bg-primary text-foreground-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                  {staff.avatar}
                                </div>
                                <span className="text-foreground">{staff.name}</span>
                              </>
                            )}
                            <span className="text-muted-foreground ml-auto">
                              Due: {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="ml-6 text-sm text-muted-foreground italic pl-6">
                    No tasks created yet
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
