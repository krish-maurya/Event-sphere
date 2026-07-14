'use client'

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  ClipboardList,
  Edit3,
  Inbox,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users,
  UsersRound,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/Header'
import {
  createVenue,
  deleteVenue,
  getAdminBookings,
  getMyProfile,
  getTeam,
  getVenues,
  reviewBooking,
  updateBooking,
  updateTeamMember,
  updateVenue,
  type BookingRow,
  type BookingStatus,
  type TeamMember,
  type VenueRow,
} from '@/lib/database'
import { supabase } from '@/lib/supabase'

const displayName = (member: TeamMember) =>
  `${member.first_name} ${member.last_name}`.trim()

type TabKey = 'queue' | 'active' | 'venues' | 'team'
type SelectedItem =
  | { kind: 'booking'; item: BookingRow }
  | { kind: 'venue'; item: VenueRow }
  | { kind: 'member'; item: TeamMember }

type Toast = { type: 'success' | 'error'; text: string }
type Draft = Record<string, string>

const bookingStatuses: BookingStatus[] = [
  'pending',
  'approved',
  'in_planning',
  'confirmed',
  'completed',
  'cancelled',
  'rejected',
]

export default function AdminDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [managers, setManagers] = useState<TeamMember[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [venues, setVenues] = useState<VenueRow[]>([])
  const [managerByBooking, setManagerByBooking] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activationCode, setActivationCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('queue')
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const selectedRef = useRef<SelectedItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>({})
  const [confirmDelete, setConfirmDelete] = useState<SelectedItem | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [venueSearch, setVenueSearch] = useState('')
  const [teamSearch, setTeamSearch] = useState('')
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    queue: null,
    active: null,
    venues: null,
    team: null,
  })

  useEffect(() => {
    selectedRef.current = selectedItem
  }, [selectedItem])

  const notify = useCallback((text: string, type: Toast['type'] = 'success') => {
    setToast({ text, type })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    try {
      const profile = await getMyProfile()
      if (!profile || profile.role !== 'admin') {
        router.replace('/unauthorized')
        return
      }

      const [allBookings, allTeam, managerList, allVenues] = await Promise.all([
        getAdminBookings(),
        getTeam(),
        getTeam('manager'),
        getVenues(),
      ])

      setBookings(allBookings)
      setTeam(allTeam)
      setManagers(managerList)
      setVenues(allVenues)

      // Keep the contextual panel selected after refresh if the record still exists.
      const current = selectedRef.current
      if (current?.kind === 'booking') {
        const fresh = allBookings.find((item) => item.id === current.item.id)
        setSelectedItem(fresh ? { kind: 'booking', item: fresh } : null)
      } else if (current?.kind === 'venue') {
        const fresh = allVenues.find((item) => item.id === current.item.id)
        setSelectedItem(fresh ? { kind: 'venue', item: fresh } : null)
      } else if (current?.kind === 'member') {
        const fresh = allTeam.find((item) => item.id === current.item.id)
        setSelectedItem(fresh ? { kind: 'member', item: fresh } : null)
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not load dashboard.', 'error')
    } finally {
      setLoading(false)
    }
  }, [notify, router])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const element = tabRefs.current[activeTab]
    if (element) setIndicator({ left: element.offsetLeft, width: element.offsetWidth })
  }, [activeTab, loading])

  useEffect(() => {
    const updateIndicator = () => {
      const element = tabRefs.current[activeTab]
      if (element) setIndicator({ left: element.offsetLeft, width: element.offsetWidth })
    }
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab])

  function changeTab(tab: TabKey) {
    setActiveTab(tab)
    setSelectedItem(null)
    setEditing(false)
    setActivationCode(null)
  }

  function select(item: SelectedItem) {
    setSelectedItem(item)
    setEditing(false)
  }

  async function review(id: string, status: 'approved' | 'rejected') {
    const managerId = managerByBooking[id]
    if (status === 'approved' && !managerId) {
      notify('Choose an event manager before approving this booking.', 'error')
      return
    }
    try {
      await reviewBooking(id, status, managerId)
      notify(status === 'approved' ? 'Booking approved and manager assigned.' : 'Booking rejected.')
      await load(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not update booking.', 'error')
    }
  }

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setInviting(true)
    setActivationCode(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({
          email: form.get('email'),
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          role: form.get('role'),
        }),
      })
      const result = (await response.json()) as { error?: string; activationCode?: string }
      if (!response.ok) throw new Error(result.error || 'Could not create team member.')

      setActivationCode(result.activationCode ?? null)
      formElement.reset()
      notify('Team member created. Copy the activation code before leaving this tab.')
      await load(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not create team member.', 'error')
    } finally {
      setInviting(false)
    }
  }

  async function addVenue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setSaving(true)
    try {
      await createVenue({
        name: String(form.get('name')),
        location: String(form.get('location')),
        city: String(form.get('city')),
        capacity: Number(form.get('capacity')),
        price_per_head: Number(form.get('pricePerGuest')),
        images: String(form.get('imageUrl')) ? [String(form.get('imageUrl'))] : [],
        amenities: String(form.get('amenities') || '').split(',').map((x) => x.trim()).filter(Boolean),
        description: String(form.get('description') || ''),
      })
      formElement.reset()
      notify('Venue published successfully.')
      await load(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not create venue.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function beginEditing() {
    if (!selectedItem) return
    if (selectedItem.kind === 'venue') {
      const venue = selectedItem.item
      setDraft({
        name: venue.name,
        location: venue.location,
        city: venue.city ?? '',
        capacity: String(venue.capacity),
        price_per_head: String(venue.price_per_head),
        image_url: venue.images?.[0] ?? '',
        amenities: (venue.amenities ?? []).join(', '),
        description: venue.description ?? '',
      })
    } else if (selectedItem.kind === 'member') {
      setDraft({
        first_name: selectedItem.item.first_name,
        last_name: selectedItem.item.last_name,
        role: selectedItem.item.role,
      })
    } else {
      setDraft({
        event_date: selectedItem.item.event_date,
        guest_count: String(selectedItem.item.guest_count),
        manager_id: selectedItem.item.manager_id ?? '',
        status: selectedItem.item.status,
      })
    }
    setEditing(true)
  }

  function setField(name: string, value: string) {
    setDraft((current) => ({ ...current, [name]: value }))
  }

  async function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedItem) return
    setSaving(true)
    try {
      if (selectedItem.kind === 'venue') {
        await updateVenue(selectedItem.item.id, {
          name: draft.name,
          location: draft.location,
          city: draft.city,
          capacity: Number(draft.capacity),
          price_per_head: Number(draft.price_per_head),
          images: draft.image_url ? [draft.image_url] : [],
          amenities: draft.amenities.split(',').map((x) => x.trim()).filter(Boolean),
          description: draft.description,
        })
      } else if (selectedItem.kind === 'member') {
        await updateTeamMember(selectedItem.item.id, {
          first_name: draft.first_name,
          last_name: draft.last_name,
          role: draft.role as 'manager' | 'staff',
        })
      } else {
        await updateBooking(selectedItem.item.id, {
          event_date: draft.event_date,
          guest_count: Number(draft.guest_count),
          manager_id: draft.manager_id || null,
          status: draft.status as BookingStatus,
        })
      }
      setEditing(false)
      notify('Changes saved successfully.')
      await load(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSelected() {
    const target = confirmDelete
    if (!target) return
    setSaving(true)
    try {
      if (target.kind === 'venue') {
        await deleteVenue(target.item.id)
      } else {
        const resource = target.kind === 'booking' ? 'bookings' : 'members'
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch(`/api/admin/resources/${resource}/${target.item.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
        })
        const result = (await response.json()) as { error?: string }
        if (!response.ok) throw new Error(result.error || 'Delete failed.')
      }
      setConfirmDelete(null)
      setSelectedItem(null)
      setEditing(false)
      notify(`${target.kind === 'member' ? 'Team member' : target.kind} deleted successfully.`)
      await load(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not delete item.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const pending = bookings.filter((booking) => booking.status === 'pending')
  const active = bookings.filter((booking) =>
    ['approved', 'in_planning', 'confirmed'].includes(booking.status),
  )
  const filteredVenues = useMemo(() => {
    const query = venueSearch.trim().toLowerCase()
    return query
      ? venues.filter((venue) => `${venue.name} ${venue.location} ${venue.city ?? ''}`.toLowerCase().includes(query))
      : venues
  }, [venueSearch, venues])
  const filteredTeam = useMemo(() => {
    const query = teamSearch.trim().toLowerCase()
    return query
      ? team.filter((member) => `${displayName(member)} ${member.email} ${member.role}`.toLowerCase().includes(query))
      : team
  }, [team, teamSearch])
  const totalCapacity = venues.reduce((sum, venue) => sum + (venue.capacity || 0), 0)
  const cityCount = new Set(venues.map((venue) => venue.city).filter(Boolean)).size

  const tabs: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
    { key: 'queue', label: 'Booking Queue', icon: ClipboardList },
    { key: 'active', label: 'Active Events', icon: Calendar },
    { key: 'venues', label: 'Venues', icon: Building2 },
    { key: 'team', label: 'Team', icon: UsersRound },
  ]

  const cardClass = (id: string) =>
    `cursor-pointer border-l-2 p-5 transition-all duration-200 hover:bg-zinc-800/60 ${selectedItem?.item.id === id
      ? 'border-l-emerald-400 bg-zinc-800/80 ring-1 ring-inset ring-emerald-500/70'
      : 'border-l-transparent'
    }`

  const inputClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-emerald-500'

  return (
    <div className="flex h-dvh flex-1 flex-col overflow-hidden bg-[#101114] text-white">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 md:px-8">
          <section className="flex shrink-0 flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium tracking-wider text-emerald-400">OPERATIONS CONTROL</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Event command center</h1>
              <p className="mt-1 text-sm text-zinc-400">Review demand, assign ownership, and keep every event moving.</p>
            </div>
            <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </section>

          <section className="grid shrink-0 grid-cols-3 gap-3">
            {[
              ['Needs review', pending.length, 'text-amber-300'],
              ['Active events', active.length, 'text-sky-300'],
              ['Team members', team.length, 'text-violet-300'],
            ].map(([label, value, colour]) => (
              <div key={String(label)} className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                <p className="truncate text-xs text-zinc-400">{label}</p>
                <p className={`mt-1 text-xl font-semibold ${colour}`}>{value}</p>
              </div>
            ))}
          </section>

          <nav className="relative flex shrink-0 overflow-x-auto border-b border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  ref={(element) => { tabRefs.current[tab.key] = element }}
                  onClick={() => changeTab(tab.key)}
                  className={`flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-zinc-600'} />
                  {tab.label}
                </button>
              )
            })}
            <span className="absolute -bottom-px h-0.5 rounded-full bg-emerald-400 transition-all duration-300" style={{ left: indicator.left, width: indicator.width }} />
          </nav>

          <section className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
            <div className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {activeTab === 'queue' && (
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                  <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 p-5 backdrop-blur">
                    <h2 className="font-semibold">Booking review queue</h2>
                    <p className="text-sm text-zinc-400">Approval requires an accountable manager.</p>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {loading ? <Loading text="Loading live bookings…" /> : pending.length === 0 ? <Empty text="No bookings are waiting for review." /> : pending.map((booking) => (
                      <article key={booking.id} onClick={() => select({ kind: 'booking', item: booking })} className={`${cardClass(booking.id)} space-y-4`}>
                        <div className="flex flex-wrap justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{booking.venue?.name ?? 'Venue'}</h3>
                            <p className="text-sm text-zinc-400">{booking.event_date} · {booking.guest_count} guests · ₹{Number(booking.total_price).toLocaleString('en-IN')}</p>
                          </div>
                          <span className="h-fit rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">Awaiting review</span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row" onClick={(event) => event.stopPropagation()}>
                          <select value={managerByBooking[booking.id] ?? ''} onChange={(event) => setManagerByBooking((current) => ({ ...current, [booking.id]: event.target.value }))} className={`${inputClass} min-w-0 flex-1`}>
                            <option value="">Assign event manager…</option>
                            {managers.map((manager) => <option key={manager.id} value={manager.id}>{displayName(manager)}</option>)}
                          </select>
                          <button onClick={() => void review(booking.id, 'approved')} className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400"><Check size={16} /> Approve</button>
                          <button onClick={() => void review(booking.id, 'rejected')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/50 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"><X size={16} /> Reject</button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'active' && (
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                  <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 p-5 backdrop-blur">
                    <h2 className="font-semibold">Active events</h2>
                    <p className="text-sm text-zinc-400">Approved, in planning, or confirmed.</p>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {loading ? <Loading text="Loading live bookings…" /> : active.length === 0 ? <Empty text="No active events right now." /> : active.map((booking) => (
                      <article key={booking.id} onClick={() => select({ kind: 'booking', item: booking })} className={`${cardClass(booking.id)} flex flex-wrap items-center justify-between gap-2`}>
                        <div><h3 className="font-semibold">{booking.venue?.name ?? 'Venue'}</h3><p className="text-sm text-zinc-400">{booking.event_date} · {booking.guest_count} guests · ₹{Number(booking.total_price).toLocaleString('en-IN')}</p></div>
                        <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium capitalize text-sky-300">{booking.status.replace('_', ' ')}</span>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'venues' && (
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                  <div className="sticky top-0 z-10 space-y-3 border-b border-zinc-800 bg-zinc-900/95 p-5 backdrop-blur">
                    <div><h2 className="font-semibold">Venue catalogue</h2><p className="text-sm text-zinc-400">Published spaces customers can discover and book.</p></div>
                    <SearchBox value={venueSearch} onChange={setVenueSearch} placeholder="Search venues, cities, or locations…" />
                  </div>
                  <div className="grid gap-3 border-b border-zinc-800 p-5 sm:grid-cols-3">
                    <Metric icon={Building2} label="Published venues" value={venues.length} />
                    <Metric icon={Users} label="Total capacity" value={totalCapacity} />
                    <Metric icon={MapPin} label="Cities" value={cityCount} />
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {loading ? <Loading text="Loading venues…" /> : filteredVenues.length === 0 ? <Empty text={venueSearch ? 'No venues match your search.' : 'No venues yet. Use the form on the right to add one.'} /> : filteredVenues.map((venue) => (
                      <article key={venue.id} onClick={() => select({ kind: 'venue', item: venue })} className={`${cardClass(venue.id)} flex flex-wrap items-center justify-between gap-3`}>
                        <div><h3 className="font-semibold">{venue.name}</h3><p className="text-sm text-zinc-400">{venue.location} · {venue.city || 'City not set'}</p></div>
                        <div className="flex gap-4 text-sm text-zinc-400"><span>{venue.capacity} guests</span><span>₹{venue.price_per_head.toLocaleString('en-IN')}/guest</span></div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                  <div className="sticky top-0 z-10 space-y-3 border-b border-zinc-800 bg-zinc-900/95 p-5 backdrop-blur">
                    <div><h2 className="font-semibold">Team</h2><p className="text-sm text-zinc-400">Everyone with access to the command center.</p></div>
                    <SearchBox value={teamSearch} onChange={setTeamSearch} placeholder="Search by name, email, or role…" />
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {loading ? <Loading text="Loading team…" /> : filteredTeam.length === 0 ? <Empty text={teamSearch ? 'No members match your search.' : 'No team members yet.'} /> : filteredTeam.map((member) => (
                      <article key={member.id} onClick={() => select({ kind: 'member', item: member })} className={`${cardClass(member.id)} flex items-center justify-between gap-2`}>
                        <div><p className="font-medium">{displayName(member)}</p><p className="text-sm text-zinc-500">{member.email}</p></div>
                        <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-medium capitalize text-violet-300">{member.role}</span>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="custom-scrollbar min-h-[360px] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div key={selectedItem ? `${selectedItem.kind}-${selectedItem.item.id}-${editing}` : `empty-${activeTab}`} className="animate-in fade-in slide-in-from-right-2 duration-200">
                {selectedItem ? (
                  <PreviewPanel
                    selected={selectedItem}
                    managers={managers}
                    editing={editing}
                    draft={draft}
                    saving={saving}
                    inputClass={inputClass}
                    setField={setField}
                    onEdit={beginEditing}
                    onCancel={() => setEditing(false)}
                    onSave={saveChanges}
                    onDelete={() => setConfirmDelete(selectedItem)}
                  />
                ) : activeTab === 'venues' ? (
                  <VenueCreateForm onSubmit={addVenue} saving={saving} inputClass={inputClass} />
                ) : activeTab === 'team' ? (
                  <TeamCreateForm onSubmit={invite} inviting={inviting} activationCode={activationCode} inputClass={inputClass} />
                ) : (
                  <ContextEmpty tab={activeTab} count={activeTab === 'queue' ? pending.length : active.length} />
                )}
              </div>
            </aside>
          </section>
        </div>
      </main>

      {toast && (
        <div className={`fixed right-5 top-5 z-[70] flex max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl animate-in slide-in-from-top-2 ${toast.type === 'success' ? 'border-emerald-500/40 bg-emerald-950 text-emerald-100' : 'border-red-500/40 bg-red-950 text-red-100'}`}>
          {toast.type === 'success' ? <Check size={17} /> : <AlertTriangle size={17} />}{toast.text}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4" onClick={() => !saving && setConfirmDelete(null)}>
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-red-500/10 text-red-400"><Trash2 size={20} /></div>
            <h2 className="text-xl font-semibold">Delete {confirmDelete.kind === 'member' ? 'team member' : confirmDelete.kind}?</h2>
            <p className="mt-2 text-sm text-zinc-400">This action cannot be undone. Related records may also be removed.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button disabled={saving} onClick={() => setConfirmDelete(null)} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">Cancel</button>
              <button disabled={saving} onClick={() => void deleteSelected()} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60">{saving ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PreviewPanel({ selected, managers, editing, draft, saving, inputClass, setField, onEdit, onCancel, onSave, onDelete }: {
  selected: SelectedItem
  managers: TeamMember[]
  editing: boolean
  draft: Draft
  saving: boolean
  inputClass: string
  setField: (name: string, value: string) => void
  onEdit: () => void
  onCancel: () => void
  onSave: (event: FormEvent<HTMLFormElement>) => void
  onDelete: () => void
}) {
  if (editing) {
    return (
      <form onSubmit={onSave} className="space-y-4">
        <PanelHeading icon={Edit3} title={`Edit ${selected.kind === 'member' ? 'member' : selected.kind}`} subtitle="Update the fields below, then save your changes." />
        {selected.kind === 'venue' && <>
          <Field label="Venue name"><input required value={draft.name ?? ''} onChange={(e) => setField('name', e.target.value)} className={inputClass} /></Field>
          <Field label="Location"><input required value={draft.location ?? ''} onChange={(e) => setField('location', e.target.value)} className={inputClass} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="City"><input required value={draft.city ?? ''} onChange={(e) => setField('city', e.target.value)} className={inputClass} /></Field><Field label="Capacity"><input required min={1} type="number" value={draft.capacity ?? ''} onChange={(e) => setField('capacity', e.target.value)} className={inputClass} /></Field></div>
          <Field label="Price per guest"><input required min={0} type="number" value={draft.price_per_head ?? ''} onChange={(e) => setField('price_per_head', e.target.value)} className={inputClass} /></Field>
          <Field label="Image URL"><input type="url" value={draft.image_url ?? ''} onChange={(e) => setField('image_url', e.target.value)} className={inputClass} /></Field>
          <Field label="Amenities"><input value={draft.amenities ?? ''} onChange={(e) => setField('amenities', e.target.value)} className={inputClass} /></Field>
          <Field label="Description"><textarea required rows={4} value={draft.description ?? ''} onChange={(e) => setField('description', e.target.value)} className={inputClass} /></Field>
        </>}
        {selected.kind === 'member' && <>
          <div className="grid grid-cols-2 gap-3"><Field label="First name"><input required value={draft.first_name ?? ''} onChange={(e) => setField('first_name', e.target.value)} className={inputClass} /></Field><Field label="Last name"><input required value={draft.last_name ?? ''} onChange={(e) => setField('last_name', e.target.value)} className={inputClass} /></Field></div>
          <Field label="Role"><select value={draft.role ?? 'manager'} onChange={(e) => setField('role', e.target.value)} className={inputClass}><option value="manager">Event manager</option><option value="staff">Staff</option></select></Field>
          <p className="text-xs text-zinc-500">Email changes are managed through Supabase Auth and are intentionally disabled here.</p>
        </>}
        {selected.kind === 'booking' && <>
          <Field label="Event date"><input required type="date" value={draft.event_date ?? ''} onChange={(e) => setField('event_date', e.target.value)} className={inputClass} /></Field>
          <Field label="Guest count"><input required min={1} type="number" value={draft.guest_count ?? ''} onChange={(e) => setField('guest_count', e.target.value)} className={inputClass} /></Field>
          <Field label="Manager"><select value={draft.manager_id ?? ''} onChange={(e) => setField('manager_id', e.target.value)} className={inputClass}><option value="">Unassigned</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{displayName(manager)}</option>)}</select></Field>
          <Field label="Status"><select value={draft.status ?? 'pending'} onChange={(e) => setField('status', e.target.value)} className={inputClass}>{bookingStatuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></Field>
        </>}
        <div className="flex gap-2 pt-2"><button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Cancel</button><button disabled={saving} className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button></div>
      </form>
    )
  }

  const title = selected.kind === 'venue' ? selected.item.name : selected.kind === 'member' ? displayName(selected.item) : selected.item.venue?.name ?? 'Booking'
  return (
    <div className="space-y-5">
      <PanelHeading icon={selected.kind === 'venue' ? Building2 : selected.kind === 'member' ? UsersRound : Calendar} title={title} subtitle={`${selected.kind === 'member' ? 'Member' : selected.kind === 'booking' ? 'Booking' : 'Venue'} preview`} />
      <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4">
        {selected.kind === 'venue' && <>
          <Detail label="Location" value={selected.item.location} /><Detail label="City" value={selected.item.city || '—'} /><Detail label="Capacity" value={`${selected.item.capacity} guests`} /><Detail label="Price" value={`₹${selected.item.price_per_head.toLocaleString('en-IN')} / guest`} /><Detail label="Amenities" value={selected.item.amenities?.join(', ') || '—'} /><Detail label="Description" value={selected.item.description || '—'} />
        </>}
        {selected.kind === 'member' && <><Detail label="Name" value={displayName(selected.item)} /><Detail label="Email" value={selected.item.email} /><Detail label="Role" value={selected.item.role} /></>}
        {selected.kind === 'booking' && <><Detail label="Venue" value={selected.item.venue?.name ?? '—'} /><Detail label="Date" value={selected.item.event_date} /><Detail label="Guests" value={String(selected.item.guest_count)} /><Detail label="Manager" value={managers.find((m) => m.id === selected.item.manager_id) ? displayName(managers.find((m) => m.id === selected.item.manager_id)!) : 'Unassigned'} /><Detail label="Status" value={selected.item.status.replace('_', ' ')} /></>}
      </div>
      <div className="grid grid-cols-2 gap-2"><button onClick={onEdit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-zinc-200"><Edit3 size={15} /> Update</button><button onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/50 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"><Trash2 size={15} /> Delete</button></div>
    </div>
  )
}

function VenueCreateForm({ onSubmit, saving, inputClass }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; saving: boolean; inputClass: string }) {
  return <form onSubmit={onSubmit} className="space-y-3"><PanelHeading icon={Plus} title="Add venue" subtitle="Publish a space customers can immediately discover." /><Field label="Venue name"><input name="name" required placeholder="The Grand Pavilion" className={inputClass} /></Field><Field label="Full location"><input name="location" required placeholder="Street, area, landmark" className={inputClass} /></Field><div className="grid grid-cols-2 gap-2"><Field label="City"><input name="city" required placeholder="Surat" className={inputClass} /></Field><Field label="Capacity"><input name="capacity" required type="number" min={1} placeholder="200" className={inputClass} /></Field></div><Field label="Price per guest"><input name="pricePerGuest" required type="number" min={0} step="0.01" placeholder="1500" className={inputClass} /></Field><Field label="Image URL"><input name="imageUrl" type="url" placeholder="https://…" className={inputClass} /></Field><Field label="Amenities"><input name="amenities" placeholder="Parking, catering, DJ setup" className={inputClass} /></Field><Field label="Description"><textarea name="description" required rows={3} className={inputClass} /></Field><button disabled={saving} className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60">{saving ? 'Publishing…' : 'Publish venue'}</button></form>
}

function TeamCreateForm({ onSubmit, inviting, activationCode, inputClass }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; inviting: boolean; activationCode: string | null; inputClass: string }) {
  return <div className="space-y-4"><PanelHeading icon={UserPlus} title="Add a team member" subtitle="Create an account without sending email." /><form onSubmit={onSubmit} className="space-y-3"><div className="grid grid-cols-2 gap-2"><input name="firstName" required placeholder="First name" className={inputClass} /><input name="lastName" required placeholder="Last name" className={inputClass} /></div><input name="email" required type="email" placeholder="name@company.com" className={inputClass} /><select name="role" className={inputClass}><option value="manager">Event manager</option><option value="staff">Staff</option></select><button disabled={inviting} className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black disabled:opacity-60">{inviting ? 'Creating…' : 'Create team member'}</button></form>{activationCode && <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3"><p className="text-xs text-amber-200">Give this once to the new member. They activate at /auth/activate.</p><code className="mt-2 block select-all text-lg font-semibold tracking-wider">{activationCode}</code></div>}</div>
}

function ContextEmpty({ tab, count }: { tab: 'queue' | 'active'; count: number }) {
  return <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><div className="grid h-16 w-16 place-items-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-600"><Inbox size={30} /></div><h2 className="mt-5 font-semibold">{tab === 'queue' ? 'Review panel' : 'Active event summary'}</h2><p className="mt-2 max-w-xs text-sm text-zinc-500">{count ? `Select one of ${count} ${tab === 'queue' ? 'pending bookings' : 'active events'} to inspect, update, or delete it.` : `There are no ${tab === 'queue' ? 'pending bookings' : 'active events'} to select.`}</p></div>
}

function PanelHeading({ icon: Icon, title, subtitle }: { icon: typeof Building2; title: string; subtitle: string }) {
  return <div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400"><Icon size={18} /></div><div><h2 className="font-semibold">{title}</h2><p className="text-sm text-zinc-400">{subtitle}</p></div></div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1 block text-xs text-zinc-400">{label}</span>{children}</label> }
function Detail({ label, value }: { label: string; value: string }) { return <div className="py-3"><dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt><dd className="mt-1 break-words text-sm capitalize text-zinc-200">{value}</dd></div> }
function Loading({ text }: { text: string }) { return <p className="p-6 text-sm text-zinc-400">{text}</p> }
function Empty({ text }: { text: string }) { return <div className="flex flex-col items-center p-10 text-center text-zinc-500"><Inbox className="mb-3" size={30} /><p className="text-sm">{text}</p></div> }
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={15} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500" /></label> }
function Metric({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) { return <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"><Icon size={16} className="text-emerald-400" /><p className="mt-2 text-xs text-zinc-500">{label}</p><p className="text-xl font-semibold">{value.toLocaleString('en-IN')}</p></div> }
