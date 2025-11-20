'use client'

import { forwardRef } from 'react'

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder, required, disabled, className = '' }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm ${className}`}
      />
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker


