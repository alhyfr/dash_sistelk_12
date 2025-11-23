'use client'
import { Star } from 'lucide-react'
import { forwardRef } from 'react'

const Rating = forwardRef(({
    name,
    label,
    value = 0,
    onChange,
    error,
    required = false,
    disabled = false,
    className = '',
    maxStars = 5,
    size = 'md',
    showLabel = true,
    ...props
}, ref) => {
    // Size variants
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    const handleStarClick = (rating) => {
        if (disabled) return

        // Create synthetic event to match Input component pattern
        const syntheticEvent = {
            target: {
                name: name,
                value: rating
            }
        }
        onChange(syntheticEvent)
    }

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= maxStars; i++) {
            const isFilled = i <= value
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleStarClick(i)}
                    disabled={disabled}
                    className={`transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                        }`}
                    aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                >
                    <Star
                        className={`${sizeClasses[size]} transition-colors duration-200 ${isFilled
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                            : 'fill-none text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                            }`}
                    />
                </button>
            )
        }
        return stars
    }

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex items-center gap-1">
                {renderStars()}
                {showLabel && value > 0 && (
                    <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {value} / {maxStars}
                    </span>
                )}
            </div>

            {error && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            )}

            {/* Hidden input for form submission */}
            <input
                ref={ref}
                type="hidden"
                name={name}
                value={value}
                {...props}
            />
        </div>
    )
})

Rating.displayName = 'Rating'

export default Rating
