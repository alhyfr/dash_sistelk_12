'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/utils/api'

const DataContext = createContext()

export const useData = () => {
  return useContext(DataContext)
}

export const DataProvider = ({ children }) => {
  const [roles, setRoles] = useState([])

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

  const value = {
    roles,
    getRoles,
  }

  

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext