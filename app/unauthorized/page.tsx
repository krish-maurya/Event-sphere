'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'

export default function UnauthorizedPage() {
  return (
    <>
      <Header />
      <main className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="text-5xl font-semibold mb-4">403</h1>
          <p className="text-2xl font-semibold mb-4">Access Denied</p>
          <p className="text-gray-400 mb-8">
            You don't have permission to access this resource. Please contact an administrator if you believe this is a mistake.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:opacity-85 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </main>
    </>
  )
}
