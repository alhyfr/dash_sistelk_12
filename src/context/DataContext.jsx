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
  const [prodis, setProdis] = useState([])
  const [siswaFilter, setSiswaFilter] = useState([])
  const [kepsek, setKepsek] = useState()
  const [ta, setTa] = useState()

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

  const getProdis = useCallback(async () => {
    try {
      const response = await api.get('/sisfo/prodi-all')
      if (response.data.status === 'success') {
        setProdis(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching prodis:', error)
    }
  }, [])

  const getSiswaFilter = useCallback(async (search = "") => {
    const response = await api.get("/sisfo/filter/siswa?search=" + search);
    setSiswaFilter(response.data.data);
  }, []);

  const SiswaFilter = useCallback(async (search = "") => {
    try {
      const response = await api.get("/sisfo/filter/siswa?search=" + search);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching siswa filter:', error);
      return [];
    }
  }, []);

  const getKepsek = useCallback(async () => {
    try {
      const response = await api.get('/sisfo/opsi/kepsek')
      if (response.data.status === 'success') {
        setKepsek(response.data.data)
        console.log(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching kepsek:', error)
    }
  }, [])

  const getTa = useCallback(async () => {
    try {
      const response = await api.get('/sisfo/opsi/ta')
      if (response.data.status === 'success') {
        setTa(response.data.data)
        console.log(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching ta:', error)
    }
  }, [])



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
    prodis,
    getProdis,
    siswaFilter,
    getSiswaFilter,
    SiswaFilter,
    kepsek,
    getKepsek,
    ta,
    getTa
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext