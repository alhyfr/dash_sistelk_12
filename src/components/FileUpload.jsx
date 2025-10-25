'use client'
import { forwardRef, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'

const FileUpload = forwardRef(({
  name,
  label,
  value,
  onChange,
  placeholder = 'Pilih file atau drag and drop',
  icon: Icon = Upload,
  error = '',
  className = '',
  disabled = false,
  required = false,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ],
  showFileInfo = true,
  dragDropText = 'atau drag and drop',
  sizeText = 'hingga 10MB',
  ...props
}, ref) => {
  const [dragActive, setDragActive] = useState(false)

  const validateFile = (file) => {
    if (!file) return true
    
    // Validasi ukuran file
    if (file.size > maxSize) {
      return {
        valid: false,
        message: `Ukuran file tidak boleh lebih dari ${(maxSize / 1024 / 1024).toFixed(0)}MB`
      }
    }
    
    // Validasi tipe file
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Tipe file tidak didukung. Gunakan PDF, DOC, DOCX, JPG, atau PNG'
      }
    }
    
    return { valid: true }
  }

  const handleFileChange = (file) => {
    const validation = validateFile(file)
    
    if (validation.valid) {
      if (onChange) {
        const event = {
          target: {
            name: name,
            value: file,
            files: [file]
          }
        }
        onChange(event)
      }
    } else {
      // Trigger error through onChange with error info
      if (onChange) {
        const event = {
          target: {
            name: name,
            value: null,
            files: [],
            error: validation.message
          }
        }
        onChange(event)
      }
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      handleFileChange(file)
    }
  }

  const removeFile = () => {
    if (onChange) {
      const event = {
        target: {
          name: name,
          value: null,
          files: []
        }
      }
      onChange(event)
    }
    
    // Reset file input
    if (ref && ref.current) {
      ref.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* File Upload Area */}
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
          dragActive 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && ref && ref.current) {
            ref.current.click()
          }
        }}
      >
        <div className="space-y-1 text-center">
          <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-red-500' : 'text-gray-400'}`} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={name}
              className={`relative font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 ${
                disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-red-600 hover:text-red-500'
              }`}
            >
              <span>Upload file</span>
              <input
                ref={ref}
                id={name}
                name={name}
                type="file"
                className="sr-only"
                onChange={handleInputChange}
                accept={accept}
                disabled={disabled}
                {...props}
              />
            </label>
            <p className="pl-1">{dragDropText}</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, JPG, PNG {sizeText}
          </p>
        </div>
      </div>

      {/* File Info */}
      {showFileInfo && value && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                {value.name}
              </span>
              <span className="text-xs text-green-600">
                ({formatFileSize(value.size)})
              </span>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={removeFile}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Hapus file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
})

FileUpload.displayName = 'FileUpload'

export default FileUpload
