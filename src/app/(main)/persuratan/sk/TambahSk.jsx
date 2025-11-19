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
import { useData } from '@/context/DataContext'
import dayjs from 'dayjs'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ========================================
// TipTap Editor Component with Dark Mode
// ========================================
const TipTapEditor = ({ 
  name,
  label, 
  value, 
  onChange, 
  error,
  placeholder = 'Ketik di sini...',
  required = false 
}) => {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR for Next.js
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange({ target: { name, value: html } })
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-3',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full" data-error={!!error}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Toolbar */}
      <div className={`border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} rounded-t-lg bg-gray-50 dark:bg-gray-800 px-3 py-2 flex flex-wrap gap-1`}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            editor.isActive('bulletList') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            editor.isActive('orderedList') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${
            editor.isActive('bold') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-sm italic rounded transition-colors ${
            editor.isActive('italic') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            editor.isActive('paragraph') 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Normal Text"
        >
          P
        </button>
      </div>

      {/* Editor Content */}
      <div 
        className={`border-x border-b ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} rounded-b-lg bg-white dark:bg-gray-900 overflow-hidden`}
      >
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Placeholder hint */}
      {!value && placeholder && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{placeholder}</p>
      )}

      {/* Custom styles for editor */}
      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          min-height: 120px;
          color: inherit;
        }
        .tiptap-editor .ProseMirror:focus {
          outline: none;
        }
        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .tiptap-editor .ProseMirror ul li {
          list-style-type: disc;
        }
        .tiptap-editor .ProseMirror ol li {
          list-style-type: decimal;
        }
        .tiptap-editor .ProseMirror li {
          margin: 0.25rem 0;
        }
        .tiptap-editor .ProseMirror p {
          margin: 0.5rem 0;
        }
        .tiptap-editor .ProseMirror strong {
          font-weight: 600;
        }
        .tiptap-editor .ProseMirror em {
          font-style: italic;
        }
        /* Dark mode text color */
        .dark .tiptap-editor .ProseMirror {
          color: #e5e7eb;
        }
      `}</style>
    </div>
  )
}

// ========================================
// Main TambahSk Component
// ========================================
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
    menetapkan: '',
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

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // ✅ Load data saat edit mode
  useEffect(() => {
    if (isEditMode && editingSk) {
      let formattedTgl = ''
      if (editingSk.tgl) {
        try {
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
        menetapkan: editingSk.menetapkan || '',
        satu: editingSk.satu || '',
        dua: editingSk.dua || '',
        tiga: editingSk.tiga || '',
        empat: editingSk.empat || '',
        lokasi: editingSk.lokasi || '',
        tembusan: editingSk.tembusan || '',
        unit: editingSk.unit || '',
        lampiran: null,
        existingLampiran: editingSk.lampiran || null,
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // ✅ Handler khusus untuk file upload
  const handleFileChange = (event) => {
    setErrors(prev => ({
      ...prev,
      lampiran: undefined
    }))

    let file = null
    if (event && event.target) {
      file = event.target.value
      if (event.target.error) {
        setErrors(prev => ({
          ...prev,
          lampiran: event.target.error
        }))
        return
      }
    } else if (event instanceof File || event instanceof Blob) {
      file = event
    } else {
      file = null
    }

    if (!file) {
      setFormData(prev => ({
        ...prev,
        lampiran: null
      }))
      return
    }

    if (!(file instanceof File) && !(file instanceof Blob)) {
      setErrors(prev => ({
        ...prev,
        lampiran: 'File tidak valid'
      }))
      return
    }

    if (!file.name || typeof file.name !== 'string') {
      setErrors(prev => ({
        ...prev,
        lampiran: 'Nama file tidak valid'
      }))
      return
    }

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

    const maxSize = 10 * 1024 * 1024
    if (file.size && file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        lampiran: 'Ukuran file maksimal 10MB'
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      lampiran: file
    }))
  }

  // ✅ Validasi form dengan HTML content check
  const validateForm = () => {
    const validateHtmlContent = (value) => {
      if (!value || value.trim() === '' || value === '<p></p>' || value === '<p><br></p>') {
        return false
      }
      const textContent = value.replace(/<[^>]*>/g, '').trim()
      return textContent.length > 0
    }

    const dataToValidate = { ...formData }
    const htmlErrors = {}

    if (!validateHtmlContent(formData.menimbang)) {
      htmlErrors.menimbang = 'Menimbang wajib diisi'
    }
    if (!validateHtmlContent(formData.mengingat)) {
      htmlErrors.mengingat = 'Mengingat wajib diisi'
    }
    if (!validateHtmlContent(formData.memperhatikan)) {
      htmlErrors.memperhatikan = 'Memperhatikan wajib diisi'
    }
    if (!validateHtmlContent(formData.menetapkan)) {
      htmlErrors.menetapkan = 'Menetapkan wajib diisi'
    }

    const validation = validate(dataToValidate, constraints)
    
    let allErrors = { ...htmlErrors }
    
    if (validation) {
      Object.keys(validation).forEach(key => {
        if (!['menimbang', 'mengingat', 'memperhatikan', 'menetapkan'].includes(key)) {
          if (Array.isArray(validation[key])) {
            allErrors[key] = validation[key][0]
          } else if (typeof validation[key] === 'object' && validation[key].message) {
            allErrors[key] = validation[key].message
          } else {
            allErrors[key] = validation[key]
          }
        }
      })
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return false
    }

    setErrors({})
    return true
  }

  // ✅ Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
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

      const hasNewFile = formData.lampiran && formData.lampiran instanceof File
      
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
        
        if (isEditMode && formData.existingLampiran && !hasNewFile) {
          submitData.lampiran = formData.existingLampiran
        }
      }

      if (postSk) await postSk(submitData)
      
      if (onSuccess) onSuccess(submitData)
      
      if (onClose) onClose()

    } catch (error) {
      console.error('Error saving SK:', error)
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Terjadi kesalahan saat menyimpan data'
        setErrors({ general: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Reset form saat keluar dari edit mode
  useEffect(() => {
    if (!isEditMode && !editingSk) {
      setFormData({
        tgl: '',
        tentang: '',
        menimbang: '',
        mengingat: '',
        memperhatikan: '',
        menetapkan: '',
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

  // ✅ Update unit saat units sudah ter-load
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isEditMode ? 'Edit SK' : 'Tambah SK'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ General Error */}
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-400 text-sm font-medium">❌ {errors.general}</p>
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

          {/* Menimbang - TipTap Editor */}
          <TipTapEditor
            name="menimbang"
            label="Menimbang"
            value={formData.menimbang}
            onChange={handleInputChange}
            error={errors.menimbang}
            placeholder="Masukkan pertimbangan..."
            required
          />

          {/* Mengingat - TipTap Editor */}
          <TipTapEditor
            name="mengingat"
            label="Mengingat"
            value={formData.mengingat}
            onChange={handleInputChange}
            error={errors.mengingat}
            placeholder="Masukkan dasar hukum..."
            required
          />

          {/* Memperhatikan - TipTap Editor */}
          <TipTapEditor
            name="memperhatikan"
            label="Memperhatikan"
            value={formData.memperhatikan}
            onChange={handleInputChange}
            error={errors.memperhatikan}
            placeholder="Masukkan hal yang diperhatikan..."
            required
          />

          {/* Menetapkan - TipTap Editor */}
          <TipTapEditor
            name="menetapkan"
            label="Menetapkan"
            value={formData.menetapkan}
            onChange={handleInputChange}
            error={errors.menetapkan}
            placeholder="Masukkan diktum menetapkan..."
            required
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
            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
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
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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