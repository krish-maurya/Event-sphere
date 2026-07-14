'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format, isBefore, startOfDay } from 'date-fns'

import 'react-day-picker/dist/style.css'

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
  availableDates?: string[]
  mode?: 'single' | 'range'
  className?: string
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  availableDates = [],
  mode = 'single',
  className = '',
}: CalendarProps) {
  const today = startOfDay(new Date())

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, today)) {
      return true
    }

    // If available dates are specified, only enable those
    if (availableDates.length > 0) {
      const dateStr = format(date, 'yyyy-MM-dd')
      return !availableDates.includes(dateStr)
    }

    // Use custom disabled function if provided
    if (disabled) {
      return disabled(date)
    }

    return false
  }

  return (
    <div
      className={`p-4 bg-card rounded-lg border border-border ${className}`}
    >
      <style>{`
        .rdp {
          --rdp-cell-size: 2.5rem;
          --rdp-accent-color: var(--color-primary);
          --rdp-background-color: var(--color-accent);
          margin: 0;
        }
        .rdp-months {
          width: 100%;
        }
        .rdp-month {
          width: 100%;
        }
        .rdp-caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0;
        }
        .rdp-caption_label {
          font-weight: 600;
          font-size: 1rem;
          color: var(--color-foreground);
        }
        .rdp-nav_button {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: calc(var(--radius) * 0.5);
          cursor: pointer;
          color: var(--color-foreground);
          transition: background-color 0.2s;
        }
        .rdp-nav_button:hover {
          background-color: var(--color-secondary);
        }
        .rdp-head_cell {
          color: var(--color-muted-foreground);
          font-weight: 500;
          font-size: 0.875rem;
        }
        .rdp-cell {
          position: relative;
        }
        .rdp-day {
          border-radius: calc(var(--radius) * 0.5);
          font-weight: 500;
          color: var(--color-foreground);
          border: none;
        }
        .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: var(--color-accent);
        }
        .rdp-day_selected:not([disabled]) {
          background-color: var(--color-primary);
          color: var(--color-primary-foreground);
          font-weight: 600;
        }
        .rdp-day_today:not(.rdp-day_selected) {
          background-color: var(--color-secondary);
          color: var(--color-foreground);
          font-weight: 600;
        }
        .rdp-day_disabled {
          color: var(--color-muted-foreground);
          background-color: transparent;
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
      {(() => {
        const Picker = DayPicker as React.ComponentType<any>
        return <Picker
        mode={mode as 'single' | 'range'}
        selected={selected}
        onSelect={onSelect as any}
        disabled={isDateDisabled}
        showOutsideDays={false}
        />
      })()}
    </div>
  )
}
