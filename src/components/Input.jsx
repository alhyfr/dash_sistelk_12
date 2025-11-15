'use client'
import { forwardRef } from 'react'

const Input = forwardRef(({ 
  name, 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-400'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
