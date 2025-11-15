'use client'
import { forwardRef } from 'react'

const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  loadingText,
  className = '',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  // Variant styles
  const variantStyles = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // Icon size based on button size
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none'

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const displayText = loading && loadingText ? loadingText : children
  const showIcon = Icon && !loading
  const iconSize = iconSizes[size]

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <div className={`${iconSize} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      )}
      {showIcon && iconPosition === 'left' && <Icon className={iconSize} />}
      {displayText}
      {showIcon && iconPosition === 'right' && <Icon className={iconSize} />}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
