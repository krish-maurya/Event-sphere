'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, ListTodo } from 'lucide-react'
import { Header } from '@/components/Header'
import { getManagerBookings, getMyProfile, type BookingRow } from '@/lib/database'
import { useRouter } from 'next/navigation'

type TabKey = 'all' | 'in_planning' | 'confirmed'

export default function ManagerDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    all: null, in_planning: null, confirmed: null,
  })

  const load = useCallback(async () => {
    try {
      const profile = await getMyProfile()
      if (!profile || profile.role !== 'manager') return router.replace('/unauthorized')
      setBookings(await getManagerBookings(profile.id))
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load events.') }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { void load() }, [load])

  useEffect(() => {
    const el = tabRefs.current[activeTab]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [activeTab, loading])

  const planned = bookings.filter((b) => b.status === 'in_planning').length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length

  const TABS: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
    { key: 'all', label: 'Assigned Events', icon: CalendarDays },
    { key: 'in_planning', label: 'In Planning', icon: ListTodo },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  ]

  const visibleBookings = bookings.filter((b) => activeTab === 'all' || b.status === activeTab)

  return <><Header/><main className="min-h-screen bg-[#101114] text-white"><div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-8">
    <section><p className="text-sm font-medium text-sky-300">EVENT MANAGEMENT</p><h1 className="mt-1 text-4xl font-semibold">Your event workspace</h1><p className="mt-2 text-zinc-400">Assign work, resolve blockers, and move each event to completion.</p></section>
    {error && <p className="rounded-lg bg-red-500/10 p-3 text-red-200">{error}</p>}
    <section className="grid gap-4 md:grid-cols-3">{[[CalendarDays, 'Assigned events', bookings.length], [ListTodo, 'In planning', planned], [CheckCircle2, 'Confirmed', confirmed]].map(([Icon, label, count]) => { const I = Icon as typeof CalendarDays; return <div key={String(label)} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"><I size={20} className="text-sky-300"/><p className="mt-4 text-sm text-zinc-400">{String(label)}</p><p className="text-3xl font-semibold">{Number(count)}</p></div> })}</section>

    <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 pt-5">
        <h2 className="font-semibold">Assigned events</h2>
        <p className="text-sm text-zinc-400">Every card has a live completion state based on task progress.</p>
        <nav className="relative mt-4 flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                ref={(el) => { tabRefs.current[tab.key] = el }}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={16} className={`transition-colors duration-200 ${isActive ? 'text-sky-300' : 'text-zinc-600'}`} />
                {tab.label}
              </button>
            )
          })}
          <span
            className="absolute -bottom-px h-0.5 rounded-full bg-sky-300 transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </nav>
      </div>
      <div className="divide-y divide-zinc-800">
        {loading ? <p className="p-5 text-zinc-400">Loading live events…</p>
          : visibleBookings.length === 0 ? <p className="p-5 text-zinc-400">No events in this view yet.</p>
          : visibleBookings.map((booking) => <article key={booking.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{booking.venue?.name ?? 'Venue'}</h3><span className="rounded-full bg-sky-400/10 px-2 py-1 text-xs capitalize text-sky-200">{booking.status.replace('_', ' ')}</span></div><p className="mt-1 text-sm text-zinc-400">{booking.event_date} · {booking.guest_count} guests · {booking.venue?.location}</p></div><Link href={`/dashboard/event-manager/${booking.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">Open work plan <ArrowRight size={16}/></Link></article>)}
      </div>
    </section>
  </div></main></>
}