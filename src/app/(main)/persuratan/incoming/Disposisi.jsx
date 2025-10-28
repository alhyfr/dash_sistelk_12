'use client'
import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import { useData } from '@/context/DataContext'
import api from '@/utils/api'

export default function Disposisi({ disposisiSurat, isDisposisiMode, onClose, onSuccess }) {
  const [selectedDisposisi, setSelectedDisposisi] = useState('')
  const [loading, setLoading] = useState(false)
  const [catatan, setCatatan] = useState('')
  const [hp, setHp] = useState('')
  const { roles, getRoles } = useData()

  
  // Load data disposisi jika dalam mode edit
  useEffect(() => {
    getRoles()
  }, [])

  useEffect(() => {
    if (isDisposisiMode && disposisiSurat?.disposisi) {
      // Ambil disposisi pertama jika ada multiple (untuk kompatibilitas)
      const disposisiArray = disposisiSurat.disposisi.split(',').filter(Boolean)
      setSelectedDisposisi(disposisiArray[0] || '')
      setCatatan(disposisiSurat.ket || '')
      setHp(disposisiSurat.hp || '')
    }
  }, [isDisposisiMode, disposisiSurat])

  const handleRadioChange = (value) => {
    setSelectedDisposisi(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put(`/sisfo/incoming/${disposisiSurat.id}/disposisi`, {
        disposisi: selectedDisposisi,
        ket: catatan,
        hp:hp
      })
      if (response.data.status === "success") {
        onSuccess(response.data.data)
      }


    } catch (error) {
      console.error('Error saving disposisi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedDisposisi('')
    setCatatan('')
    setHp('')
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Disposisi Surat
        </h3>
        <p className="text-sm text-gray-600">
          Pilih satu pihak yang akan menerima disposisi surat ini
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Selection */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border-2 border-red-600 flex items-center justify-center">
              {selectedDisposisi && <div className="w-2 h-2 bg-red-600 rounded-full"></div>}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {selectedDisposisi ? 'Satu disposisi dipilih' : 'Belum ada disposisi dipilih'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Pilih salah satu
          </span>
        </div>

        {/* Radio Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((option) => (
            <div key={option.id} className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
              selectedDisposisi === option.role_name 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200'
            }`}>
              <input
                type="radio"
                id={option.id}
                name="disposisi"
                value={option.role_name}
                checked={selectedDisposisi === option.role_name}
                onChange={() => handleRadioChange(option.role_name)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor={option.id} className="ml-3 text-sm font-medium text-gray-900 cursor-pointer flex-1">
                {option.deskripsi}
              </label>
            </div>
          ))}
        </div>

        {/* No HP Field */}
        <div>
          <label htmlFor="hp" className="block text-sm font-medium text-gray-700 mb-2">
            No. HP <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Masukkan nomor HP"
            required
          />
        </div>

        {/* Keterangan Field */}
        <div>
          <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan
          </label>
          <textarea
            id="keterangan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            placeholder="Tambahkan keterangan untuk disposisi ini..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !selectedDisposisi || !hp}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Disposisi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}