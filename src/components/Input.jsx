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
      <label className="block text-sm font-medium text-gray-700 mb-2">
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
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
