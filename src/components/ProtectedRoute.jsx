'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingPage from './LoadingPage'

export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  redirectTo = '/login' 
}) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    // Show loading for 3 seconds minimum
    const loadingTimer = setTimeout(() => {
      setShowLoading(false)
    }, 500)

    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (!loading && !showLoading) {
      setLoadingComplete(true)
      
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        setTimeout(() => {
          router.replace(redirectTo)
        }, 100) // Small delay for smooth transition
        return
      }

      // If role is required and user doesn't have it
      if (requiredRole && user?.role !== requiredRole) {
        setTimeout(() => {
          router.replace('/dashboard') // Redirect to dashboard if no permission
        }, 100) // Small delay for smooth transition
        return
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router, redirectTo, showLoading, loadingComplete])

  // Show loading while checking authentication or during 1-second delay
  if (loading || showLoading || !loadingComplete) {
    return <LoadingPage duration={500} />
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return <LoadingPage duration={500} />
  }

  // Check role permission
  if (requiredRole && user?.role !== requiredRole) {
    return <LoadingPage duration={500} />
  }

  // Render children if authenticated and authorized
  return children
}
