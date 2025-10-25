'use client'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function TokenManager() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Set token in cookies when user logs in
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token')
      if (token) {
        // Set cookie with token
        document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
      }
    } else {
      // Clear cookie when user logs out
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }, [isAuthenticated, user])

  return null // This component doesn't render anything
}
