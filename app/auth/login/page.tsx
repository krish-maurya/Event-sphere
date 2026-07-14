'use client'

import { Header } from '@/components/Header'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </>
  )
}
