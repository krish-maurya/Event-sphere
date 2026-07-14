'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogOut, PanelTop, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getMyProfile } from '@/lib/database'
import { dashboardForRole, type Role } from '@/lib/roles'

const linksForRole = (role?: Role) => role === 'admin' ? [{ href: '/dashboard/admin', label: 'Control center' }, { href: '/admin/venues', label: 'Manage venues' }, { href: '/venues', label: 'Venue catalogue' }] : role === 'manager' ? [{ href: '/dashboard/manager', label: 'My events' }, { href: '/venues', label: 'Venues' }] : role === 'staff' ? [{ href: '/dashboard/staff', label: 'My tasks' }] : role === 'customer' ? [{ href: '/venues', label: 'Venues' }, { href: '/bookings', label: 'My bookings' }] : [{ href: '/venues', label: 'Explore venues' }]
export function Header() {
  const [user, setUser] = useState<{ firstName: string; role: Role } | null>(null)
  useEffect(() => { const load = async () => { const p = await getMyProfile().catch(() => null); setUser(p ? { firstName: p.first_name, role: p.role } : null) }; void load(); const { data } = supabase.auth.onAuthStateChange(() => void load()); return () => data.subscription.unsubscribe() }, [])
  const links = linksForRole(user?.role)
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101114]/90 backdrop-blur-xl"><nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3"><Link href="/" className="flex items-center gap-2 font-semibold tracking-wide text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-300 to-violet-400 text-black"><Sparkles size={17}/></span> EVENTSPHERE</Link><div className="hidden items-center gap-1 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">{link.label}</Link>)}</div><div className="flex items-center gap-2">{user ? <><Link href={dashboardForRole(user.role)} className="hidden rounded-lg bg-white/10 px-3 py-2 text-sm text-white sm:block"><PanelTop className="mr-1 inline" size={15}/>{user.firstName}</Link><button onClick={() => void supabase.auth.signOut().then(() => location.assign('/'))} className="rounded-lg p-2 text-zinc-300 transition hover:bg-red-500/15 hover:text-red-200" aria-label="Sign out"><LogOut size={18}/></button></> : <><Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm text-zinc-200">Sign in</Link><Link href="/auth/signup" className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black">Create account</Link></>}</div></nav></header>
}
