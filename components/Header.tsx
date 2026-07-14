'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export function Header() {
  const [activeNav, setActiveNav] = useState('Home')
  const [isClient, setIsClient] = useState(false)
  const { currentUser, logout } = useAppStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.08)]">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[88px] py-2 md:py-2">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 font-semibold text-[18px] md:text-[19px] tracking-[0.02em] text-white">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 11L11 2L20 11L11 20L2 11Z" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            EVENTSPHERE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-[13.5px] text-gray-400">
            <Link
              href="/"
              onClick={() => setActiveNav('Home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeNav === 'Home'
                  ? 'text-white'
                  : 'hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${activeNav === 'Home' ? 'bg-black' : 'hidden'}`}></span>
              Home
            </Link>
            <Link
              href="/dashboard/event"
              onClick={() => setActiveNav('Bookings')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeNav === 'Bookings'
                  ? 'text-white'
                  : 'hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Bookings
            </Link>
            <Link
              href="/venues"
              onClick={() => setActiveNav('Venues')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeNav === 'Venues'
                  ? 'text-white'
                  : 'hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Venues
            </Link>
            <Link
              href="/dashboard/manager"
              onClick={() => setActiveNav('Manager')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeNav === 'Manager'
                  ? 'text-white'
                  : 'hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              Manager
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          {isClient && (
            <div className="flex items-center gap-3 md:gap-4">
              {currentUser ? (
                <>
                  <span className="hidden sm:inline text-[13px] text-gray-400">
                    {currentUser.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold text-[13px] px-4 md:px-5 py-2 md:py-3 rounded-full cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-white font-semibold text-[13px] px-4 md:px-5 py-2 md:py-3 rounded-full cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white text-black font-semibold text-[13px] px-5 md:px-6 py-2 md:py-3 rounded-full cursor-pointer transition-all hover:opacity-85"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
