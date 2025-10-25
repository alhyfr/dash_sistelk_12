'use client'
import { forwardRef } from 'react'
import { Calendar } from 'lucide-react'

const DatePicker = forwardRef(({
  name,
  label,
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  icon: Icon = Calendar,
  error = '',
  className = '',
  min = null,
  max = null,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Date Input */}
      <div className="relative">
        <input
          ref={ref}
          type="date"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        />
        
        {/* Calendar Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
})

DatePicker.displayName = 'DatePicker'

export default DatePicker
