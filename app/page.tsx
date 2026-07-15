'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  Users2,
  MapPin,
  Ticket,
  ShieldCheck,
  Workflow,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Menu,
  X,
  ClipboardCheck,
  Building2,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
]

const LOGOS = ['Northwind', 'Meridian', 'Ferro', 'Basin', 'Ambrose', 'Ironview']

const FEATURES = [
  {
    icon: Building2,
    title: 'Curated venues and vendors',
    description: 'Browse a vetted directory filtered by capacity, budget, and availability, then lock in a booking without leaving the page.',
  },
  {
    icon: Workflow,
    title: 'One run-of-show for everyone',
    description: 'Timelines, staff assignments, and vendor contacts live in a single schedule that updates in real time for the whole team.',
  },
  {
    icon: Ticket,
    title: 'Check-in that keeps up',
    description: 'Scan tickets at the door with a queue built for spikes, and watch attendance numbers update on the dashboard as they happen.',
  },
  {
    icon: BarChart3,
    title: 'Budget tracking by line item',
    description: 'Set a budget per event, tag spend by category, and get an alert before a vendor invoice pushes you over.',
  },
  {
    icon: Users2,
    title: 'Role-based access',
    description: 'Admins see every event across the org. Managers see only the ones they run. Nobody edits a budget they do not own.',
  },
  {
    icon: ShieldCheck,
    title: 'Contracts and approvals',
    description: 'Route vendor contracts for signature and track approval status without a separate spreadsheet.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Set up the event',
    description: 'Add the date, budget, and venue shortlist. EventSphere pulls in availability and pricing automatically.',
  },
  {
    number: '02',
    title: 'Bring in your team',
    description: 'Assign a manager, invite vendors, and build the run-of-show together in one shared timeline.',
  },
  {
    number: '03',
    title: 'Run the day from one screen',
    description: 'Check in guests, track spend against budget, and resolve issues from the same dashboard your whole team is watching.',
  },
]

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#101114] font-sans text-zinc-100 antialiased">
      {/* ------------------------------------------------------------------ */}
      {/* Nav                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#101114]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-black">
              <span className="text-sm font-semibold">E</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">EventSphere</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-colors duration-200 hover:bg-emerald-400"
            >
              Get started
            </Link>
          </div>

          <button
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-zinc-800 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-sm font-medium text-zinc-400">
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-zinc-800 pt-4">
                <Link href="/auth/login" className="text-sm font-medium text-zinc-400">
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-black"
                >
                  Get started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ------------------------------------------------------------------ */}
        {/* Hero                                                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="relative overflow-hidden border-b border-zinc-800">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
            }}
          />

          <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-4 text-xs font-medium text-zinc-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                All systems operational
              </div>

              <h1 className="max-w-[720px] text-[clamp(36px,5vw,58px)] font-semibold leading-[1.08] tracking-tight text-white">
                Run every event from one operations screen
              </h1>

              <p className="mt-6 max-w-[480px] text-base leading-relaxed text-zinc-400">
                EventSphere gives your team a single dashboard for booking venues, tracking budget, and
                checking in guests — built for teams running more than one event at a time.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-emerald-400"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#product"
                  className="rounded-lg border border-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900"
                >
                  View the dashboard
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />No setup fee</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />Cancel anytime</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />SOC 2 in progress</span>
              </div>
            </div>

            {/* Product preview */}
            <div id="product" className="relative mx-auto mt-20 max-w-[960px] scroll-mt-24">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-3 text-xs text-zinc-600">app.eventsphere.io/overview</span>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-4">
                  {[
                    { label: 'Active events', value: '12' },
                    { label: 'Tickets sold', value: '2,265' },
                    { label: 'Budget committed', value: '$448K' },
                    { label: 'Avg. check-in', value: '2m 14s' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="font-mono text-xl font-semibold tabular-nums text-white">{kpi.value}</div>
                      <div className="mt-1 text-[11px] font-medium text-zinc-500">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 px-5 pb-5">
                  {[
                    { name: 'Northwind Product Summit', status: 'Confirmed', dot: 'bg-emerald-400', pct: 92 },
                    { name: 'Meridian Vendor Expo', status: 'At risk', dot: 'bg-orange-400', pct: 32 },
                    { name: 'Lumen Developer Day', status: 'Confirmed', dot: 'bg-emerald-400', pct: 88 },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dot}`} />
                      <span className="flex-1 truncate text-sm font-medium text-zinc-200">{row.name}</span>
                      <span className="hidden text-xs font-medium text-zinc-500 sm:block">{row.status}</span>
                      <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800 sm:block">
                        <div className={`h-full rounded-full ${row.dot}`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Logo strip                                                          */}
        {/* ------------------------------------------------------------------ */}
        <section className="border-b border-zinc-800 py-10">
          <div className="mx-auto max-w-[1200px] px-6">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
              Trusted by operations teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {LOGOS.map((logo) => (
                <span key={logo} className="text-sm font-semibold tracking-tight text-zinc-600">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Feature grid                                                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="border-b border-zinc-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-14 max-w-[560px] text-center">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">Platform</div>
              <h2 className="text-[clamp(28px,3.4vw,38px)] font-semibold tracking-tight text-white">
                Everything a multi-event team needs, none of the sprawl
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors duration-200 hover:border-zinc-700"
                  >
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                      <Icon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-[15px] font-semibold tracking-tight text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* How it works                                                        */}
        {/* ------------------------------------------------------------------ */}
        <section id="how-it-works" className="scroll-mt-16 border-b border-zinc-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-14 max-w-[560px] text-center">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">How it works</div>
              <h2 className="text-[clamp(28px,3.4vw,38px)] font-semibold tracking-tight text-white">
                From first booking to final check-in
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.number} className="bg-[#101114] p-8">
                  <div className="mb-6 font-mono text-sm font-semibold text-zinc-600">{step.number}</div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Testimonial                                                         */}
        {/* ------------------------------------------------------------------ */}
        <section className="border-b border-zinc-800 py-24">
          <div className="mx-auto max-w-[720px] px-6 text-center">
            <ClipboardCheck className="mx-auto mb-6 h-6 w-6 text-emerald-400" strokeWidth={1.8} />
            <p className="text-xl font-medium leading-relaxed tracking-tight text-zinc-200 md:text-2xl">
              We went from four spreadsheets and a shared inbox to one dashboard our whole ops team
              checks every morning. Check-in day stopped being the stressful part.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-300">
                AL
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-zinc-200">Ana Lindqvist</div>
                <div className="text-xs text-zinc-500">Head of Events, Basin Wellness Group</div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CTA banner                                                          */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-16 text-center">
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
                Set up your first event in under 10 minutes
              </div>
              <h2 className="max-w-[480px] text-[clamp(26px,3.2vw,34px)] font-semibold tracking-tight text-white">
                Put your next event on one screen
              </h2>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-emerald-400"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-black">
                  <span className="text-xs font-semibold">E</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-zinc-200">EventSphere</span>
              </div>
              <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-zinc-600">
                One operations dashboard for teams running venues, vendors, and guest check-in.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">Product</div>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li><a href="#product" className="hover:text-zinc-200">Dashboard</a></li>
                  <li><a href="#pricing" className="hover:text-zinc-200">Pricing</a></li>
                  <li><a href="#docs" className="hover:text-zinc-200">Docs</a></li>
                </ul>
              </div>
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">Company</div>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-zinc-200">About</a></li>
                  <li><a href="#" className="hover:text-zinc-200">Careers</a></li>
                  <li><a href="#" className="hover:text-zinc-200">Contact</a></li>
                </ul>
              </div>
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">Legal</div>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-zinc-200">Privacy</a></li>
                  <li><a href="#" className="hover:text-zinc-200">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-xs text-zinc-600 sm:flex-row">
            <span>© 2026 EventSphere, Inc.</span>
            <span>Built for teams running more than one event at a time.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}