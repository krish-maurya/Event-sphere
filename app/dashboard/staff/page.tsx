'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { useWorkflowStore } from '@/lib/workflowStore'
import { STAFF_MEMBERS } from '@/lib/workflowData'
import { CheckCircle, Clock, AlertCircle, MessageSquare, FileText, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

export default function StaffDashboard() {
  const { currentUser } = useAppStore()
  const { getMyTasks, updateTaskStatus, updateSubtask, addComment } = useWorkflowStore()
  const [selectedStaffId, setSelectedStaffId] = useState('staff-001')
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<Record<string, string>>({})

  const myTasks = getMyTasks(selectedStaffId)
  const staffMember = STAFF_MEMBERS.find((s) => s.id === selectedStaffId)

  const tasksByStatus = {
    todo: myTasks.filter((t) => t.status === 'todo'),
    'in-progress': myTasks.filter((t) => t.status === 'in-progress'),
    completed: myTasks.filter((t) => t.status === 'completed'),
    blocked: myTasks.filter((t) => t.status === 'blocked'),
  }

  const handleStatusChange = (taskId: string, newStatus: typeof tasksByStatus) => {
    updateTaskStatus(selectedStaffId, taskId, newStatus as any)
  }

  const handleAddComment = (taskId: string) => {
    if (newComment[taskId]) {
      addComment(taskId, {
        id: `comment-${Date.now()}`,
        author: staffMember?.name || 'Unknown',
        text: newComment[taskId],
        timestamp: new Date(),
      })
      setNewComment({ ...newComment, [taskId]: '' })
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground">Manage your assigned event tasks</p>
          </div>

          {/* Staff Selector (for demo) */}
          <div className="bg-card rounded-lg border border-border p-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Select Staff (Demo)</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
            >
              {STAFF_MEMBERS.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>

          {/* Staff Info Card */}
          {staffMember && (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-foreground/20 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary text-foreground-foreground rounded-full flex items-center justify-center text-lg font-bold mb-3">
                    {staffMember.avatar}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{staffMember.name}</h2>
                  <p className="text-muted-foreground">{staffMember.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{staffMember.completedTasks}</p>
                </div>
              </div>
            </div>
          )}

          {/* Task Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">To Do</p>
              <p className="text-2xl font-bold text-foreground">{tasksByStatus.todo.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{tasksByStatus['in-progress'].length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm">Blocked</p>
              <p className="text-2xl font-bold text-destructive">{tasksByStatus.blocked.length}</p>
            </div>
          </div>

          {/* Tasks by Status */}
          <div className="space-y-8">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <div key={status}>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  {status === 'todo' && <Clock size={20} className="text-yellow-600" />}
                  {status === 'in-progress' && <Edit2 size={20} className="text-blue-600" />}
                  {status === 'completed' && <CheckCircle size={20} className="text-green-600" />}
                  {status === 'blocked' && <AlertCircle size={20} className="text-destructive" />}
                  {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                </h3>

                {tasks.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">No tasks</div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-card rounded-lg border border-border p-4 space-y-3 hover:border-foreground transition-colors"
                      >
                        {/* Task Header */}
                        <div
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                          className="cursor-pointer flex items-start justify-between gap-2"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded flex-shrink-0 ${
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

                        {/* Task Details */}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            className="px-2 py-1 bg-secondary border border-border rounded text-foreground text-sm"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>

                        {/* Subtasks */}
                        {task.subtasks.length > 0 && (
                          <div className="pt-3 border-t border-border space-y-2">
                            <p className="text-sm font-semibold text-foreground">Subtasks</p>
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                  onChange={(e) => updateSubtask(task.id, subtask.id, e.target.checked)}
                                  className="w-4 h-4 rounded border-border"
                                />
                                <span className={subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Expanded Details */}
                        {expandedTask === task.id && (
                          <div className="pt-3 border-t border-border space-y-3">
                            {/* Comments */}
                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <MessageSquare size={16} />
                                Comments ({task.comments.length})
                              </h5>
                              <div className="space-y-2 mb-3">
                                {task.comments.map((comment) => (
                                  <div key={comment.id} className="bg-secondary p-2 rounded text-sm">
                                    <p className="font-semibold text-foreground">{comment.author}</p>
                                    <p className="text-muted-foreground">{comment.text}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={newComment[task.id] || ''}
                                  onChange={(e) => setNewComment({ ...newComment, [task.id]: e.target.value })}
                                  className="flex-1 px-2 py-1 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                  onClick={() => handleAddComment(task.id)}
                                  className="px-3 py-1 bg-primary text-foreground-foreground rounded text-sm hover:bg-primary/90 transition-colors"
                                >
                                  Post
                                </button>
                              </div>
                            </div>

                            {/* Attachments */}
                            {task.attachments.length > 0 && (
                              <div>
                                <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <FileText size={16} />
                                  Attachments ({task.attachments.length})
                                </h5>
                                <div className="space-y-1">
                                  {task.attachments.map((attachment) => (
                                    <a
                                      key={attachment.id}
                                      href={attachment.url}
                                      className="flex items-center gap-2 text-foreground hover:underline text-sm"
                                    >
                                      <FileText size={14} />
                                      {attachment.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
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
