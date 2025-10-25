'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoadingPage from '@/components/LoadingPage'

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Add 3 second delay before redirect
      const redirectTimer = setTimeout(() => {
        if (isAuthenticated) {
          // If authenticated, redirect to dashboard
          router.push('/dashboard')
        } else {
          // If not authenticated, redirect to login
          router.push('/login')
        }
      }, 1000)

      return () => clearTimeout(redirectTimer)
    }
  }, [isAuthenticated, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage duration={1000} />
  }

  // Show loading while redirecting
  return <LoadingPage duration={1000} />
}