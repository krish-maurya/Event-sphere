'use client'

import { Header } from '@/components/Header'
import { SignupForm } from '@/components/SignupForm'

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4 py-12">
        <SignupForm />
      </main>
    </>
  )
}
