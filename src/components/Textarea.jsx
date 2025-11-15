'use client'
import { forwardRef } from 'react'

const Textarea = forwardRef(({ 
  name, 
  label, 
  placeholder = '', 
  value, 
  onChange, 
  error, 
  icon: Icon,
  rows = 4,
  className = '',
  disabled = false,
  required = false,
  ...props 
}, ref) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-400'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-200 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
