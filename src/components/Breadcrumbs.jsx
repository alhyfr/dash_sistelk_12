'use client'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs({ 
  items = null, // Custom breadcrumb items
  showHome = true, // Tampilkan home link
  className = '' // Custom className
}) {
  const pathname = usePathname()
  
  // Generate breadcrumbs dari pathname jika tidak ada custom items
  const generateBreadcrumbs = () => {
    if (items) return items
    
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs = []
    
    // Add home breadcrumb
    if (showHome) {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home
      })
    }
    
    // Generate breadcrumbs dari path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip jika segment adalah ID (numeric)
      if (/^\d+$/.test(segment)) return
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Check if this is the last segment
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        href: isLast ? null : currentPath,
        isLast
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length === 0) return null
  
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => {
          const Icon = item.icon
          const isLast = item.isLast || index === breadcrumbs.length - 1
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
              )}
              
              {isLast ? (
                // Current page - tidak clickable
                <span className="flex items-center text-gray-900 font-medium">
                  {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb
                <Link 
                  href={item.href}
                  className="flex items-center text-gray-500 hover:text-red-600 transition-colors duration-200 group"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1.5 group-hover:text-red-600 transition-colors duration-200" />}
                  <span className="group-hover:text-red-600 transition-colors duration-200">
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Hook untuk generate breadcrumbs dengan custom logic
export function useBreadcrumbs(customItems = null) {
  const pathname = usePathname()
  
  const generateBreadcrumbs = () => {
    if (customItems) return customItems
    
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs = []
    
    // Add home breadcrumb
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home
    })
    
    // Generate breadcrumbs dari path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip jika segment adalah ID (numeric)
      if (/^\d+$/.test(segment)) return
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Check if this is the last segment
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        href: isLast ? null : currentPath,
        isLast
      })
    })
    
    return breadcrumbs
  }
  
  return generateBreadcrumbs()
}
