'use client'
import { forwardRef } from 'react'

const Select = forwardRef(({ 
  name, 
  label, 
  value, 
  onChange, 
  options = [], 
  icon: Icon,
  disabled = false,
  placeholder = 'Pilih...',
  className = '',
  ...props 
}, ref) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <select
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full text-slate-600 dark:text-gray-900 px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 dark:disabled:bg-gray-200 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
})

Select.displayName = 'Select'

export default Select
