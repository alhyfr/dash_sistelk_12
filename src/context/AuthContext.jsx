'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const cachedUser = localStorage.getItem('user')
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (e) {
          localStorage.removeItem('user')
        }
      }

      // Cek apakah sudah di halaman login, jika ya jangan panggil API untuk menghindari loop
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath === '/login' || currentPath.startsWith('/login')) {
          setLoading(false)
          return
        }
      }

      const response = await api.get('/current-user')
      if (response.data.status === 'success') {
        const userData = response.data.data
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    } catch (error) {
      // Jangan log error jika sudah di halaman login (untuk menghindari spam console)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
          console.error('Auth check failed:', error)
        }
      }
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await api.post('/login', { email, password })
      
      if (response.data.status === 'success') {
        const { token, user: userData } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setLoading(false)
      router.replace('/login')
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get('/current-user')
      if (response.data.status === 'success') {
        const userData = response.data.data
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
        return userData
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        return null
      }
    } catch (error) {
      console.error('Get user error:', error)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return null
    }
  }

  const updateUser = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      if (response.data.status === 'success') {
        const updatedUser = response.data.data
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Update user error:', error)
      const message = error.response?.data?.message || 'Update profil gagal.'
      return { success: false, message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return { 
        success: response.data.status === 'success', 
        message: response.data.message 
      }
    } catch (error) {
      console.error('Change password error:', error)
      const message = error.response?.data?.message || 'Ganti password gagal.'
      return { success: false, message }
    }
  }

  const clearAuthData = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const getCachedUser = () => {
    try {
      const cachedUser = localStorage.getItem('user')
      return cachedUser ? JSON.parse(cachedUser) : null
    } catch (error) {
      localStorage.removeItem('user')
      return null
    }
  }

  const setCachedUser = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to cache user data:', error)
    }
  }

  // ✅ TAMBAHKAN HELPER FUNCTIONS UNTUK ROLE
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin'
  }

  const hasRole = (roles) => {
    if (!user?.role) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  const canAccess = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    return hasRole(allowedRoles)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getUser,
    updateUser,
    changePassword,
    checkAuth,
    clearAuthData,
    getCachedUser,
    setCachedUser,
    // ✅ Tambahkan helper functions
    isAdmin,
    hasRole,
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext