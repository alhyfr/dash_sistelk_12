'use client'
import { useState } from 'react'
import { FileText, User, Upload, Save, X, Calendar } from 'lucide-react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import FileUpload from '@/components/FileUpload'
import Image from 'next/image'
import Stelk from '@/assets/logo/stelk.png'


export default function Formulir({ postSurat }) {
  const [formData, setFormData] = useState({
    asal_instansi: '',
    nosurat: '',
    perihal: '',
    kontak_person: '',
    tgl_pelaksanaan: '',
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Options untuk asal instansi (bisa diganti dengan data dari API)


  const handleInputChange = (e) => {
    const { name, value, error } = e.target
    
    // Handle file upload errors
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error jika ada perubahan
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }


  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.asal_instansi.trim()) {
      newErrors.asal_instansi = 'Asal instansi harus diisi'
    }
    if (!formData.nosurat.trim()) {
      newErrors.nosurat = 'Nomor surat harus diisi'
    }
    
    if (!formData.perihal.trim()) {
      newErrors.perihal = 'Perihal harus diisi'
    }
    
    if (!formData.kontak_person.trim()) {
      newErrors.kontak_person = 'Kontak person harus diisi'
    }
    
    if (!formData.tgl_pelaksanaan.trim()) {
      newErrors.tgl_pelaksanaan = 'Tanggal pelaksanaan harus diisi'
    }
    
    if (!formData.file) {
      newErrors.file = 'File harus diupload'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      // Buat FormData untuk upload file
      const submitData = new FormData()
      submitData.append('asal_instansi', formData.asal_instansi)
      submitData.append('nosurat', formData.nosurat)
      submitData.append('perihal', formData.perihal)
      submitData.append('kontak_person', formData.kontak_person)
      submitData.append('tgl_pelaksanaan', formData.tgl_pelaksanaan)
      submitData.append('file', formData.file)
      
      // console.log('Form data:', {
      //   asal_instansi: formData.asal_instansi,
      //   perihal: formData.perihal,
      //   kontak_person: formData.kontak_person,
      //   tgl_pelaksanaan: formData.tgl_pelaksanaan,
      //   file: formData.file?.name
      // })
      
      // Simulasi loading 3 detik sebelum mengirim ke API
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Panggil API menggunakan postSurat dari props
      if (postSurat) {
        const result = await postSurat(submitData)
        
        if (result.success) {
          // Reset form setelah berhasil
          setFormData({
            asal_instansi: '',
            nosurat: '',
            perihal: '',
            kontak_person: '',
            tgl_pelaksanaan: '',
            file: null
          })
          
        } else {
          setErrors({ general: result.message || 'Terjadi kesalahan saat mengirim formulir' })
        }
      } else {
        throw new Error('postSurat function tidak tersedia')
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ general: 'Terjadi kesalahan saat mengirim formulir' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      asal_instansi: '',
      nosurat: '',
      perihal: '',
      kontak_person: '',
      tgl_pelaksanaan: '',
      file: null
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src={Stelk} alt="Stelk" width={32} height={32} />
            <h1 className="text-2xl font-bold text-gray-900">Documail</h1>
          </div>
          <p className="text-gray-600">
            Silakan isi formulir di bawah ini untuk mengajukan surat
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Asal Instansi */}
            <Input
              name="asal_instansi"
              label="Asal Instansi"
              type="text"
              placeholder="Masukkan asal instansi"
              value={formData.asal_instansi}
              onChange={handleInputChange}
              error={errors.asal_instansi}
              icon={User}
            />

            {/* Nomor Surat */}

            <Input
              name="nosurat"
              label="Nomor Surat"
              type="text"
              placeholder="Masukkan nomor surat"
              value={formData.nosurat}
              onChange={handleInputChange}
              error={errors.nosurat}
              icon={FileText}
            />

            {/* Perihal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Perihal
              </label>
              <textarea
                name="perihal"
                value={formData.perihal}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                  errors.perihal ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan perihal surat..."
              />
              {errors.perihal && (
                <p className="text-red-600 text-sm mt-1">{errors.perihal}</p>
              )}
            </div>

            {/* Kontak Person */}
            <Input
              name="kontak_person"
              label="Kontak Person"
              type="text"
              placeholder="Masukkan nama kontak person"
              value={formData.kontak_person}
              onChange={handleInputChange}
              error={errors.kontak_person}
              icon={User}
            />

            {/* Tanggal Pelaksanaan */}
            <DatePicker
              name="tgl_pelaksanaan"
              label="Tanggal Pelaksanaan"
              value={formData.tgl_pelaksanaan}
              onChange={handleInputChange}
              placeholder="Pilih tanggal pelaksanaan"
              icon={Calendar}
              error={errors.tgl_pelaksanaan}
              required={true}
              min={new Date().toISOString().split('T')[0]} // Tidak bisa pilih tanggal kemarin
            />

            {/* File Upload */}
            <FileUpload
              name="file"
              label="File Surat"
              value={formData.file}
              onChange={handleInputChange}
              placeholder="Pilih file surat atau drag and drop"
              icon={Upload}
              error={errors.file}
              required={true}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024} // 10MB
              dragDropText="atau drag and drop"
              sizeText="hingga 10MB"
              showFileInfo={true}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Kirim Formulir
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}