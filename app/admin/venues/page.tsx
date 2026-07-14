'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EventProvider } from '@/app/context/EventContext'
import { Header } from '@/components/Header'
import { mockVenues } from '@/lib/mockData'
import { Plus, Edit2, Trash2, Eye, MapPin, Users } from 'lucide-react'

interface VenueFormData {
  id?: string
  name: string
  city: string
  capacity: number
  pricePerHead: number
}

function AdminContent() {
  const [venues, setVenues] = useState(mockVenues)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    city: '',
    capacity: 0,
    pricePerHead: 0,
  })

  const handleOpenModal = (venue?: typeof mockVenues[0]) => {
    if (venue) {
      setFormData({
        id: venue.id,
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        pricePerHead: venue.pricePerHead,
      })
      setEditingId(venue.id)
    } else {
      setFormData({
        name: '',
        city: '',
        capacity: 0,
        pricePerHead: 0,
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setVenues(
        venues.map((v) =>
          v.id === editingId
            ? {
                ...v,
                ...formData,
              }
            : v
        )
      )
    } else {
      const newVenue = {
        ...mockVenues[0],
        id: `venue-${Date.now()}`,
        ...formData,
      }
      setVenues([...venues, newVenue])
    }

    handleCloseModal()
  }

  const handleDeleteVenue = (id: string) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter((v) => v.id !== id))
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Venue Management</h1>
              <p className="text-muted-foreground mt-2">Manage and organize all event venues</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus size={20} />
              Add Venue
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">Total Venues</p>
              <p className="text-3xl font-bold text-foreground">{venues.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">Avg Capacity</p>
              <p className="text-3xl font-bold text-foreground">
                {Math.round(venues.reduce((acc, v) => acc + v.capacity, 0) / venues.length)}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">Avg Price</p>
              <p className="text-3xl font-bold text-foreground">
                ${Math.round(venues.reduce((acc, v) => acc + v.pricePerHead, 0) / venues.length)}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">Avg Rating</p>
              <p className="text-3xl font-bold text-foreground">
                {(venues.reduce((acc, v) => acc + v.rating, 0) / venues.length).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Venues Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Venue Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Capacity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price/Head</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue, idx) => (
                    <tr
                      key={venue.id}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        idx % 2 === 0 ? '' : 'bg-secondary/20'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">{venue.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={16} />
                          {venue.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users size={16} />
                          {venue.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground font-semibold">${venue.pricePerHead}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold">
                          {venue.rating}⭐ ({venue.reviews})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/venue/${venue.id}`}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} className="text-muted-foreground" />
                          </Link>
                          <button
                            onClick={() => handleOpenModal(venue)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteVenue(venue.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {editingId ? 'Edit Venue' : 'Add New Venue'}
              </h2>

              <form onSubmit={handleSaveVenue} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Price per Head ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.pricePerHead}
                    onChange={(e) => setFormData({ ...formData, pricePerHead: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function AdminVenuesPage() {
  return (
    <EventProvider>
      <AdminContent />
    </EventProvider>
  )
}
