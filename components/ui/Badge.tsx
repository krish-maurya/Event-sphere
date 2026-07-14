import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export function Badge({ variant = 'default', size = 'md', className = '', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-700 text-gray-100',
    success: 'bg-green-900/40 text-green-300',
    warning: 'bg-yellow-900/40 text-yellow-300',
    error: 'bg-red-900/40 text-red-300',
    info: 'bg-blue-900/40 text-blue-300',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <div
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
