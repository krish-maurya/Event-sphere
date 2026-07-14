'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Header } from '@/components/Header'
import { getCustomerBookings, getMyProfile, type BookingRow } from '@/lib/database'
import { useRouter } from 'next/navigation'

export default function BookingsPage() {
  const router = useRouter(); const [bookings, setBookings] = useState<BookingRow[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = useCallback(async () => { try { const profile = await getMyProfile(); if (!profile) return router.push('/auth/login'); if (profile.role !== 'customer') return router.push('/venues'); setBookings(await getCustomerBookings(profile.id)) } catch (e) { setError(e instanceof Error ? e.message : 'Could not load bookings.') } finally { setLoading(false) } }, [router])
  useEffect(() => { void load() }, [load])
  return <><Header/><main className="min-h-screen bg-[#101114] text-white"><div className="mx-auto max-w-5xl px-4 py-10 md:px-8"><p className="text-sm font-medium text-sky-300">MY BOOKINGS</p><h1 className="mt-1 text-4xl font-semibold">Event requests</h1><p className="mt-2 text-zinc-400">Follow each request from review to event completion.</p>{error && <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-200">{error}</p>}<section className="mt-8 space-y-3">{loading ? <p className="text-zinc-400">Loading bookings…</p> : bookings.length === 0 ? <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"><p className="text-zinc-400">You have not requested a booking yet.</p><Link href="/venues" className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">Browse venues</Link></div> : bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{booking.venue?.name}</h2><p className="mt-2 flex items-center gap-1 text-sm text-zinc-400"><CalendarDays size={15}/>{booking.event_date} · {booking.guest_count} guests</p><p className="mt-1 flex items-center gap-1 text-sm text-zinc-400"><MapPin size={15}/>{booking.venue?.location}</p></div><span className="h-fit rounded-full bg-sky-400/10 px-3 py-1 text-xs capitalize text-sky-200">{booking.status.replace('_', ' ')}</span></div><div className="mt-4 border-t border-zinc-800 pt-3 text-sm text-zinc-400">Estimated total <span className="ml-1 font-semibold text-white">₹{Number(booking.total_price).toLocaleString()}</span></div></article>)}</section></div></main></>
}
