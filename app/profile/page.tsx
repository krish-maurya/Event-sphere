'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EventProvider, useEvent } from '@/app/context/EventContext'
import { Header } from '@/components/Header'
import { Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react'

function ProfileContent() {
  const router = useRouter()
  const { user, setUser } = useEvent()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Event enthusiast and celebration planner',
  })

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Please sign in to view your profile</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="inline-block px-6 py-2 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </main>
      </>
    )
  }

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
      })
    }
    setIsEditing(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-card rounded-lg border border-border p-8 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-foreground-foreground text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button className="p-3 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
                <Camera size={20} className="text-foreground" />
              </button>
            </div>

            {/* Edit Toggle */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isEditing
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Form */}
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
                className="space-y-4 border-t border-border pt-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground resize-none"
                    rows={4}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-foreground-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4 border-t border-border pt-6">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-foreground">{formData.phone}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-foreground">{formData.location}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">{formData.email}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Bio</p>
                  <p className="text-foreground">{formData.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">5</p>
              <p className="text-muted-foreground">Total Bookings</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">3</p>
              <p className="text-muted-foreground">Confirmed Events</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">$45,000</p>
              <p className="text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function ProfilePage() {
  return (
    <EventProvider>
      <ProfileContent />
    </EventProvider>
  )
}
