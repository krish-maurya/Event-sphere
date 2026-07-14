'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignupSchema, type SignupInput } from '@/lib/schemas'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  })

  const password = watch('password')

  const onSubmit = async (data: SignupInput) => {
    setIsSubmitting(true)
    try {
      setAuthError(null)
      const { data: result, error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { first_name: data.firstName, last_name: data.lastName } } })
      if (error) { setAuthError(error.message); return }
      if (!result.session) { router.push('/auth/login?confirmation=sent'); return }
      router.push('/venues')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasError = authError || errors.email?.message || errors.password?.message

  const passwordRequirements = [
    { met: password && password.length >= 8, label: 'At least 8 characters' },
    { met: password && /[A-Z]/.test(password), label: 'Contains uppercase letter' },
    { met: password && /[0-9]/.test(password), label: 'Contains number' },
  ]

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
        <p className="text-muted-foreground">Join EventVenue to start booking amazing venues</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {hasError && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm text-destructive">{authError || 'Please check the form for errors'}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              {...register('lastName')}
            />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

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
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 mt-2">
            {passwordRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded flex items-center justify-center ${req.met ? 'bg-green-500/20' : 'bg-secondary'}`}>
                  {req.met && <CheckCircle2 size={14} className="text-green-600" />}
                </div>
                <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>{req.label}</span>
              </div>
            ))}
          </div>

          {errors.password && <p className="text-sm text-destructive mt-2">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-primary text-foreground-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      <Link
        href="/auth/login"
        className="w-full px-4 py-2 border border-foreground text-foreground rounded-lg font-semibold hover:bg-primary/10 transition-colors text-center block"
      >
        Sign In
      </Link>

      {/* Terms Notice */}
      <p className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to our{' '}
        <Link href="#" className="text-foreground hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="text-foreground hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
