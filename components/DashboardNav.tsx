'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CheckCircle, TrendingUp, LogOut } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function DashboardNav() {
  const pathname = usePathname()
  const { logout } = useAppStore()

  const navItems = [
    { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/staff', label: 'Staff Dashboard', icon: Users },
    { href: '/dashboard/progress', label: 'Progress Tracker', icon: TrendingUp },
  ]

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-2xl font-bold text-foreground">
          EventVenue
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-foreground-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            logout()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}
