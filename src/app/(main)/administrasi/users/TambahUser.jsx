'use client'
import { useState,useEffect } from 'react'
import { User, Mail, Lock, Shield, Save, X } from 'lucide-react'
import Input from '@/components/Input'
import Select from '@/components/Select'
import ApiSelect from '@/components/ApiSelect'
import api from '@/utils/api'

export default function TambahUser({ onClose = null, onSuccess = null, postUser, editingUser = null, isEditMode = false }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: '', // Will be set after roles are loaded
    status: 'Active'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [roleOptions, setRoleOptions] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  // Fetch role options from API
  const getRole = async () => {
    try {
      setLoadingRoles(true)
      const response = await api.get('/sisfo/setting/role')
      if (response.data.status === 'success') {
        setRoleOptions(response.data.data)
        
        // Set default role only for add mode
        if (response.data.data.length > 0 && !isEditMode) {
          const defaultRole = response.data.data.find(role => 
            role.name?.toLowerCase().includes('user') || 
            role.role_name?.toLowerCase().includes('user')
          ) || response.data.data[0]
          
          setFormData(prev => ({
            ...prev,
            role_id: defaultRole.id || defaultRole.value
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setErrors({ general: 'Gagal memuat data role' })
    } finally {
      setLoadingRoles(false)
    }
  }

  useEffect(() => {
    getRole()
  }, [])

  // Set form data when editing user
  useEffect(() => {
    if (isEditMode && editingUser) {
      setFormData({
        username: editingUser.username || '',
        email: editingUser.email || '',
        password: '',
        role_id: editingUser.role_id || editingUser.role || '',
        status: editingUser.status || 'Active'
      })
    }
  }, [isEditMode, editingUser])

  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) newErrors.username = 'Username harus diisi'
    if (!formData.email.trim()) newErrors.email = 'Email harus diisi'
    if (!isEditMode && !formData.password) newErrors.password = 'Password harus diisi'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})
    
    try {
      const submitData = {
        name: formData.username,
        email: formData.email,
        role: formData.role_id,
        status: formData.status
      }

      if (formData.password) submitData.password = formData.password

      if (postUser) await postUser(submitData)
      
      // Reset form
      setFormData({
        username: '', email: '', password: '', role_id: '', status: 'Active'
      })
      
      if (onSuccess) onSuccess(submitData)
      if (onClose) onClose()
      
    } catch (error) {
      console.error('Error saving user:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat menyimpan data'
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Form Fields */}
      <Input
        name="username"
        label="Username"
        type="text"
        placeholder="Masukkan username"
        value={formData.username}
        onChange={handleInputChange}
        error={errors.username}
        icon={User}
      />

      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="Masukkan email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        icon={Mail}
      />

      <Input
        name="password"
        label={`Password ${isEditMode ? '(Kosongkan jika tidak ingin mengubah)' : ''}`}
        type="password"
        placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan password"}
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        icon={Lock}
      />

      

      {/* Role */}
      <ApiSelect
        name="role_id"
        label="Role"
        value={formData.role_id}
        onChange={handleInputChange}
        options={roleOptions}
        loading={loadingRoles}
        icon={Shield}
        placeholder="Pilih Role"
        loadingText="Memuat role..."
        valueKey="id"
        labelKey="role_name"
      />

      {/* Status */}
      <Select
        name="status"
        label="Status"
        value={formData.status}
        onChange={handleInputChange}
        options={statusOptions}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEditMode ? 'Mengupdate...' : 'Menyimpan...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditMode ? 'Update' : 'Simpan'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}