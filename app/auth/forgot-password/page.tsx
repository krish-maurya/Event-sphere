'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ResetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { requestPasswordReset } = useAppStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsSubmitting(true)
    try {
      requestPasswordReset(data.email)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Check Your Email</h1>
                <p className="text-muted-foreground">We&apos;ve sent password reset instructions to your email address</p>
              </div>
              <p className="text-sm text-muted-foreground">The link will expire in 24 hours. If you don&apos;t see it, check your spam folder.</p>
              <Link href="/auth/login" className="inline-block px-6 py-3 bg-primary text-foreground-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-foreground">Reset Your Password</h1>
                <p className="text-muted-foreground">Enter your email address and we&apos;ll send you a link to reset your password</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.email && (
                  <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-destructive">{errors.email.message}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    {...register('email')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-primary text-foreground-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Remember your password?</span>
                </div>
              </div>

              <Link
                href="/auth/login"
                className="w-full px-4 py-2 border border-foreground text-foreground rounded-lg font-semibold hover:bg-primary/10 transition-colors text-center block"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
