'use client'

import React, { useState, useCallback } from 'react'
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 3000) => {
    const id = `toast-${Date.now()}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const typeColors = {
    success: 'bg-green-900/20 border-green-900/50 text-green-300',
    error: 'bg-red-900/20 border-red-900/50 text-red-300',
    info: 'bg-blue-900/20 border-blue-900/50 text-blue-300',
    warning: 'bg-yellow-900/20 border-yellow-900/50 text-yellow-300',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg border ${typeColors[toast.type]} flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg">{icons[toast.type]}</span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-current hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full px-4 md:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
