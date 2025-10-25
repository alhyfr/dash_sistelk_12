'use client'
import { forwardRef } from 'react'

const ApiSelect = forwardRef(({ 
  name, 
  label, 
  value, 
  onChange, 
  options = [], 
  loading = false,
  icon: Icon,
  placeholder = 'Pilih...',
  loadingText = 'Memuat data...',
  emptyText = 'Tidak ada data',
  valueKey = 'id',
  labelKey = 'name',
  className = '',
  ...props 
}, ref) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <select
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        disabled={loading}
        className={`w-full text-slate-600 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {loading ? (
          <option value="">{loadingText}</option>
        ) : (
          <>
            <option value="">{placeholder}</option>
            {options.length > 0 ? (
              options.map(option => (
                <option key={option[valueKey] || option.value} value={option[valueKey] || option.value}>
                  {option[labelKey] || option.label || option.name}
                </option>
              ))
            ) : (
              <option value="" disabled>{emptyText}</option>
            )}
          </>
        )}
      </select>
      {loading && (
        <p className="text-gray-500 text-sm mt-1">Sedang memuat data...</p>
      )}
    </div>
  )
})

ApiSelect.displayName = 'ApiSelect'

export default ApiSelect
