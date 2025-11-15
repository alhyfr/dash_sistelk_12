'use client'

import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import DatePicker from '@/components/DatePicker'
import FileUpload from '@/components/FileUpload'
import Button from '@/components/Button'
import constraints from '@/utils/constraints'
import validate from 'validate.js'
import {useData} from '@/context/DataContext'
import dayjs from 'dayjs'

export default function TambahSk({ 
  onClose = null, 
  onSuccess = null, 
  postSk, 
  editingSk = null, 
  isEditMode = false 
}) {
  const { units } = useData()
  const [formData, setFormData] = useState({
    tgl: '',
    tentang: '',
    menimbang: '',
    mengingat: '',
    memperhatikan: '',
    menetapkan:'',
    satu: '',
    dua: '',
    tiga: '',
    empat: '',
    lokasi: '',
    tembusan: '',
    unit: '',
    lampiran: null,
    existingLampiran: null, // Untuk menyimpan path lampiran yang sudah ada saat edit mode
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
 

  // ✅ Load data saat edit mode
  useEffect(() => {
    if (isEditMode && editingSk) {
      // Konversi format tanggal dari API ke format YYYY-MM-DD untuk DatePicker
      let formattedTgl = ''
      if (editingSk.tgl) {
        try {
          // Coba parse dengan dayjs, jika berhasil format ke YYYY-MM-DD
          const parsedDate = dayjs(editingSk.tgl)
          if (parsedDate.isValid()) {
            formattedTgl = parsedDate.format('YYYY-MM-DD')
          } else {
            formattedTgl = editingSk.tgl || ''
          }
        } catch (error) {
          formattedTgl = editingSk.tgl || ''
        }
      }

      setFormData({
        ns: editingSk.ns || '',
        tgl: formattedTgl,
        tentang: editingSk.tentang || '',
        menimbang: editingSk.menimbang || '',
        mengingat: editingSk.mengingat || '',
        memperhatikan: editingSk.memperhatikan || '',
        menetapkan:editingSk.menetapkan || '',
        satu: editingSk.satu || '',
        dua: editingSk.dua || '',
        tiga: editingSk.tiga || '',
        empat: editingSk.empat || '',
        lokasi: editingSk.lokasi || '',
        tembusan: editingSk.tembusan || '',
        unit: editingSk.unit || '',
        lampiran: null, // Set null untuk lampiran, karena FileUpload tidak bisa handle string path
        existingLampiran: editingSk.lampiran || null, // Simpan path lampiran yang sudah ada
      })
    }
  }, [isEditMode, editingSk])

  // ✅ Handler untuk input text biasa
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
        [name]: undefined
      }))
    }
  }

  // ✅ Handler khusus untuk file upload dengan validasi real-time
  const handleFileChange = (event) => {
    // Reset error lampiran dulu
    setErrors(prev => ({
      ...prev,
      lampiran: undefined
    }))

    // Handle event object dari FileUpload atau file langsung
    let file = null
    if (event && event.target) {
      // Jika event object dari FileUpload
      file = event.target.value
      // Handle error dari FileUpload
      if (event.target.error) {
        setErrors(prev => ({
          ...prev,
          lampiran: event.target.error
        }))
        return
      }
    } else if (event instanceof File || event instanceof Blob) {
      // Jika langsung file object
      file = event
    } else {
      // Jika null atau undefined
      file = null
    }

    // Jika tidak ada file (user cancel/clear), set null
    if (!file) {
      setFormData(prev => ({
        ...prev,
        lampiran: null
      }))
      return
    }

    // Validasi bahwa file adalah instance File/Blob dan memiliki name
    if (!(file instanceof File) && !(file instanceof Blob)) {
      setErrors(prev => ({
        ...prev,
        lampiran: 'File tidak valid'
      }))
      return
    }

    // Validasi bahwa file memiliki name property
    if (!file.name || typeof file.name !== 'string') {
      setErrors(prev => ({
        ...prev,
        lampiran: 'Nama file tidak valid'
      }))
      return
    }

    // Validasi file type
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['doc', 'docx', 'pdf']
    const fileExtension = fileName.split('.').pop()

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setErrors(prev => ({
        ...prev,
        lampiran: 'File harus berformat DOC, DOCX, atau PDF'
      }))
      return
    }

    // Validasi file size (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size && file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        lampiran: 'Ukuran file maksimal 10MB'
      }))
      return
    }

    // Jika lolos validasi, set file
    setFormData(prev => ({
      ...prev,
      lampiran: file
    }))
  }

  // ✅ Validasi form menggunakan validate.js
  const validateForm = () => {
    const validation = validate(formData, constraints)
    
    if (validation) {
      // Convert validate.js format to our error format
      const formattedErrors = {}
      Object.keys(validation).forEach(key => {
        if (Array.isArray(validation[key])) {
          formattedErrors[key] = validation[key][0]
        } else if (typeof validation[key] === 'object' && validation[key].message) {
          formattedErrors[key] = validation[key].message
        } else {
          formattedErrors[key] = validation[key]
        }
      })
      setErrors(formattedErrors)
      return false
    }

    setErrors({})
    return true
  }

  // ✅ Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi form
    if (!validateForm()) {
      // Scroll ke error pertama
      const firstErrorField = document.querySelector('[data-error="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)
    setErrors({})

    try {
      let submitData
      const ensureString = (value) => value == null ? "" : String(value)

      // Cek apakah ada file baru yang diupload
      const hasNewFile = formData.lampiran && formData.lampiran instanceof File
      
      // Jika ada file baru atau mode edit dengan file baru, gunakan FormData
      if (hasNewFile) {
        submitData = new FormData()
        submitData.append('tgl', ensureString(formData.tgl))
        submitData.append('tentang', ensureString(formData.tentang))
        submitData.append('menimbang', ensureString(formData.menimbang))
        submitData.append('mengingat', ensureString(formData.mengingat))
        submitData.append('memperhatikan', ensureString(formData.memperhatikan))
        submitData.append('menetapkan', ensureString(formData.menetapkan))
        submitData.append('satu', ensureString(formData.satu))
        submitData.append('dua', ensureString(formData.dua))
        submitData.append('tiga', ensureString(formData.tiga))
        submitData.append('empat', ensureString(formData.empat))
        submitData.append('lokasi', ensureString(formData.lokasi))
        submitData.append('tembusan', ensureString(formData.tembusan))
        submitData.append('unit', ensureString(formData.unit))
        submitData.append('lampiran', formData.lampiran)
      } else {
        // Jika tidak ada file baru, gunakan JSON object biasa
        submitData = {
          tgl: ensureString(formData.tgl),
          tentang: ensureString(formData.tentang),
          menimbang: ensureString(formData.menimbang),
          mengingat: ensureString(formData.mengingat),
          memperhatikan: ensureString(formData.memperhatikan),
          menetapkan: ensureString(formData.menetapkan),
          satu: ensureString(formData.satu),
          dua: ensureString(formData.dua),
          tiga: ensureString(formData.tiga),
          empat: ensureString(formData.empat),
          lokasi: ensureString(formData.lokasi),
          tembusan: ensureString(formData.tembusan),
          unit: ensureString(formData.unit),
        }
        
        // Jika mode edit dan ada existing lampiran (tidak ada file baru), kirim existing lampiran
        if (isEditMode && formData.existingLampiran && !hasNewFile) {
          submitData.lampiran = formData.existingLampiran
        }
      }

      // Panggil API
      if (postSk) await postSk(submitData)
      
      // Callback success
      if (onSuccess) onSuccess(submitData)
      
      // Close modal/form
      if (onClose) onClose()

    } catch (error) {
      console.error('Error saving SK:', error)
      
      // Handle error dari backend
      if (error.response?.data?.errors) {
        // Jika backend return validation errors
        setErrors(error.response.data.errors)
      } else {
        // Generic error
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Terjadi kesalahan saat menyimpan data'
        setErrors({ general: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }
  // ✅ Reset form saat keluar dari edit mode (editingSk menjadi null)
  useEffect(() => {
    if (!isEditMode && !editingSk) {
      setFormData({
        tgl: '',
        tentang: '',
        menimbang: '',
        mengingat: '',
        memperhatikan: '',
        menetapkan:'',
        satu: '',
        dua: '',
        tiga: '',
        empat: '',
        lokasi: '',
        tembusan: '',
        unit: '',
        lampiran: null,
        existingLampiran: null,
      })
      setErrors({})
    }
  }, [isEditMode, editingSk])

  // ✅ Update unit saat units sudah ter-load (hanya untuk mode tambah baru)
  useEffect(() => {
    if (!isEditMode && !editingSk && units?.role_name) {
      setFormData(prev => ({
        ...prev,
        unit: units.role_name
      }))
    }
  }, [units, isEditMode, editingSk])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit SK' : 'Tambah SK'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm font-medium">❌ {errors.general}</p>
          </div>
        )}

        {/* ✅ Form Fields */}
        <div className="space-y-4">
          {/* Tanggal */}
          <DatePicker
            name="tgl"
            label="Tanggal *"
            value={formData.tgl}
            onChange={handleInputChange}
            error={errors.tgl}
            data-error={!!errors.tgl}
          />

          {/* Tentang */}
          <Input
            name="tentang"
            label="Tentang *"
            value={formData.tentang}
            onChange={handleInputChange}
            error={errors.tentang}
            placeholder="Masukkan tentang SK"
            data-error={!!errors.tentang}
          />

         

          {/* Menimbang */}
          <Textarea
            name="menimbang"
            label="Menimbang *"
            value={formData.menimbang}
            onChange={handleInputChange}
            error={errors.menimbang}
            rows={4}
            placeholder="Masukkan pertimbangan..."
            data-error={!!errors.menimbang}
          />

          {/* Mengingat */}
          <Textarea
            name="mengingat"
            label="Mengingat *"
            value={formData.mengingat}
            onChange={handleInputChange}
            error={errors.mengingat}
            rows={4}
            placeholder="Masukkan dasar hukum..."
            data-error={!!errors.mengingat}
          />

          {/* Memperhatikan */}
          <Textarea
            name="memperhatikan"
            label="Memperhatikan *"
            value={formData.memperhatikan}
            onChange={handleInputChange}
            error={errors.memperhatikan}
            rows={4}
            placeholder="Masukkan hal yang diperhatikan..."
            data-error={!!errors.memperhatikan}
          />
          <Textarea
            name="menetapkan"
            label="Menetapkan *"
            value={formData.menetapkan}
            onChange={handleInputChange}
            error={errors.menetapkan}
            rows={4}
            placeholder="Masukkan diktum menetapkan..."
            data-error={!!errors.menetapkan}
          />

          {/* Satu */}
          <Textarea
            name="satu"
            label="Kesatu *"
            value={formData.satu}
            onChange={handleInputChange}
            error={errors.satu}
            rows={3}
            placeholder="Masukkan diktum kesatu..."
            data-error={!!errors.satu}
          />

          {/* Dua */}
          <Textarea
            name="dua"
            label="Kedua"
            value={formData.dua}
            onChange={handleInputChange}
            error={errors.dua}
            rows={3}
            placeholder="Masukkan diktum kedua (opsional)..."
            data-error={!!errors.dua}
          />

          {/* Tiga */}
          <Textarea
            name="tiga"
            label="Ketiga"
            value={formData.tiga}
            onChange={handleInputChange}
            error={errors.tiga}
            rows={3}
            placeholder="Masukkan diktum ketiga (opsional)..."
            data-error={!!errors.tiga}
          />

          {/* Empat */}
          <Textarea
            name="empat"
            label="Keempat"
            value={formData.empat}
            onChange={handleInputChange}
            error={errors.empat}
            rows={3}
            placeholder="Masukkan diktum keempat (opsional)..."
            data-error={!!errors.empat}
          />

          {/* Lokasi */}
          <Input
            name="lokasi"
            label="Lokasi *"
            value={formData.lokasi}
            onChange={handleInputChange}
            error={errors.lokasi}
            placeholder="Contoh: Jakarta"
            data-error={!!errors.lokasi}
          />

          {/* Tembusan */}
          <Textarea
            name="tembusan"
            label="Tembusan"
            value={formData.tembusan}
            onChange={handleInputChange}
            error={errors.tembusan}
            rows={3}
            placeholder="Masukkan tembusan (opsional)..."
            data-error={!!errors.tembusan}
          />

          {/* Unit */}
          <Input
            name="unit"
            label="Unit *"
            value={formData.unit}
            onChange={handleInputChange}
            readOnly={true}
            className="bg-gray-100 cursor-not-allowed"
          />

          {/* Lampiran */}
          <FileUpload
            name="lampiran"
            label="Lampiran"
            value={formData.lampiran}
            onChange={handleFileChange}
            error={errors.lampiran}
            accept=".doc,.docx,.pdf"
            data-error={!!errors.lampiran}
          />
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          {onClose && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              icon={X}
              disabled={loading}
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            loading={loading}
            icon={Save}
            loadingText="Menyimpan..."
          >
            {isEditMode ? 'Update SK' : 'Simpan SK'}
          </Button>
        </div>
      </form>
    </div>
  )
}