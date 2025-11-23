'use client'
import { useState, useEffect, useRef } from 'react'

export default function InputFilter({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    options = [],
    onSearch,
    labelKey = 'nama',
    valueKey = 'id',
    subLabelKey = null,
    loading = false
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedName, setSelectedName] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const dropdownRef = useRef(null)

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm && onSearch) {
                onSearch(searchTerm)
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, onSearch])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Update internal state when external value changes
    useEffect(() => {
        if (value && !selectedName && options.length > 0) {
            const found = options.find(o => o[valueKey] === value)
            if (found) {
                setSelectedName(found[labelKey])
            }
        }
    }, [value, options, selectedName, valueKey, labelKey])

    const handleSearchChange = (e) => {
        const val = e.target.value
        setSearchTerm(val)
        setSelectedName(val)
        setShowDropdown(true)

        if (!val) {
            onChange({ target: { name, value: '' } })
        }
    }

    const handleSelect = (item) => {
        setSelectedName(item[labelKey])
        setSearchTerm('')
        setShowDropdown(false)
        onChange({ target: { name, value: item[valueKey] } })
    }

    const getSubLabel = (item) => {
        if (!subLabelKey) return null
        if (typeof subLabelKey === 'function') return subLabelKey(item)
        return item[subLabelKey]
    }

    return (
        <div className="mb-6 relative group" ref={dropdownRef}>
            <label className="block text-gray-700 text-sm font-semibold mb-2 transition-colors group-focus-within:text-indigo-600">
                {label}
            </label>
            <div className={`relative flex items-center transition-all duration-200 ease-in-out rounded-xl border ${error ? 'border-red-500 bg-red-50' : isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
                <div className="pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFocused ? 'text-indigo-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="w-full py-2.5 px-3 bg-transparent text-gray-700 leading-tight focus:outline-none placeholder-gray-400 rounded-xl"
                    placeholder={placeholder || "Cari..."}
                    value={selectedName}
                    onChange={handleSearchChange}
                    onFocus={() => { setShowDropdown(true); setIsFocused(true); }}
                    onBlur={() => setIsFocused(false)}
                    autoComplete="off"
                />
                {selectedName && (
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedName('')
                            setSearchTerm('')
                            onChange({ target: { name, value: '' } })
                        }}
                        className="pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            {error && (
                <div className="flex items-center mt-1 text-red-500 text-xs animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {showDropdown && searchTerm && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top animate-slideDown">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : options && options.length > 0 ? (
                            options.map((item) => (
                                <div
                                    key={item[valueKey]}
                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150 group/item"
                                    onClick={() => handleSelect(item)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800 group-hover/item:text-indigo-700">{item[labelKey]}</p>
                                            {getSubLabel(item) && (
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                                                    {getSubLabel(item)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity text-indigo-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">Tidak ada hasil ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
