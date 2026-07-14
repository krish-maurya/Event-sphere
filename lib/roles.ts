export const ROLES = ['admin', 'manager', 'staff', 'customer'] as const

export type Role = (typeof ROLES)[number]

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLES.includes(value as Role)
}

export function dashboardForRole(role: Role) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'manager':
      return '/dashboard/manager'
    case 'staff':
      return '/dashboard/staff'
    default:
      return '/venues'
  }
}
