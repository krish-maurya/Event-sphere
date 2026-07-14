'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { UserRole } from '@/lib/store'

export function useProtectedRoute(requiredRoles?: UserRole[]) {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useAppStore()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      router.push('/auth/login')
      return
    }

    // Check if user has required role
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(currentUser.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, currentUser, requiredRoles, router])

  return { isAuthorized: isAuthenticated && (!requiredRoles || requiredRoles.includes(currentUser?.role!)) }
}
