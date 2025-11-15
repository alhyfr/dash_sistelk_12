'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const useData = () => {
  return useContext(DataContext)
}

export const DataProvider = ({ children }) => {
  const [roles, setRoles] = useState([])
  const [units, setUnits] = useState()
  const { user } = useAuth()
  const getRoles = async () => {
    try {
      const response = await api.get('/sisfo/setting/rolespec')
      if (response.data.status === 'success') {
        setRoles(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }
  const getUnits = useCallback(async () => {
    if (!user?.role_id) return
    
    try {
      const response = await api.get('/sisfo/setting/unitById/' + user.role_id)
      if (response.data.status === 'success') {
        setUnits(response.data.unit)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    }
  }, [user?.role_id])

  // ✅ Panggil getUnits saat user.role_id tersedia
  useEffect(() => {
    if (user?.role_id) {
      getUnits()
    }
  }, [user?.role_id, getUnits])

  // ✅ Panggil getRoles saat component mount
  useEffect(() => {
    getRoles()
  }, [])

  const value = {
    roles,
    getRoles,
    units,
    getUnits,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext