'use client'

import { Header } from '@/components/Header'
import Link from 'next/link'
import { useState } from 'react'

export default function ManagerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const tasks = [
    { id: 1, title: 'Confirm event schedule', status: 'pending', dueDate: '2024-01-15' },
    { id: 2, title: 'Finalize catering menu', status: 'in-progress', dueDate: '2024-01-10' },
    { id: 3, title: 'Arrange decoration setup', status: 'completed', dueDate: '2024-01-08' },
  ]

  const events = [
    {
      id: 1,
      name: 'Wedding Reception',
      date: '2024-01-20',
      guests: 150,
      status: 'confirmed',
      venue: 'Grand Ballroom',
    },
    {
      id: 2,
      name: 'Corporate Gala',
      date: '2024-01-25',
      guests: 200,
      status: 'pending',
      venue: 'Downtown Hall',
    },
    {
      id: 3,
      name: 'Birthday Party',
      date: '2024-02-05',
      guests: 75,
      status: 'confirmed',
      venue: 'Rooftop Terrace',
    },
  ]

  return (
    <>
      <Header />
      <main className="bg-[#1a1a1a] text-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Event Manager Dashboard</h1>
            <p className="text-gray-400">Manage your events, staff, and daily operations</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[rgba(255,255,255,0.08)]">
            {['overview', 'events', 'tasks', 'staff', 'communications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-3 font-medium transition-colors capitalize ${
                  selectedTab === tab
                    ? 'text-white border-b-2 border-white -mb-[2px]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Events', value: '12' },
                  { label: 'Total Guests', value: '2,450' },
                  { label: 'Pending Tasks', value: '8' },
                  { label: 'Team Members', value: '15' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#2d2d2d] p-6 rounded-lg border border-[rgba(255,255,255,0.08)]"
                  >
                    <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Tasks */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#2d2d2d] p-4 rounded-lg border border-[rgba(255,255,255,0.08)] flex items-center justify-between hover:border-[rgba(255,255,255,0.12)] transition-colors"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-900/30 text-green-300'
                            : task.status === 'in-progress'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {selectedTab === 'events' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Events</h2>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#2d2d2d] p-4 rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-sm text-gray-400">{event.venue}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <p>Date: {event.date}</p>
                      <p>Guests: {event.guests}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {selectedTab === 'tasks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#2d2d2d] p-4 rounded-lg border border-[rgba(255,255,255,0.08)] flex items-center justify-between hover:border-[rgba(255,255,255,0.12)] transition-colors"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-900/30 text-green-300'
                          : task.status === 'in-progress'
                          ? 'bg-blue-900/30 text-blue-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Tab */}
          {selectedTab === 'staff' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'John Manager', role: 'Event Manager' },
                  { name: 'Sarah Coordinator', role: 'Coordinator' },
                  { name: 'Mike Vendor', role: 'Vendor Manager' },
                ].map((staff, idx) => (
                  <div
                    key={idx}
                    className="bg-[#2d2d2d] p-4 rounded-lg border border-[rgba(255,255,255,0.08)]"
                  >
                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-3"></div>
                    <h3 className="font-semibold">{staff.name}</h3>
                    <p className="text-sm text-gray-400">{staff.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communications Tab */}
          {selectedTab === 'communications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Messages & Notifications</h2>
              <div className="bg-[#2d2d2d] p-6 rounded-lg border border-[rgba(255,255,255,0.08)] text-center py-12">
                <p className="text-gray-400 mb-4">No new messages</p>
                <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:opacity-85 transition-opacity">
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
