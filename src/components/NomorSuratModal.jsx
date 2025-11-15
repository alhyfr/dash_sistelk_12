'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, X, Send } from 'lucide-react'
import Modal from './Modal'
import Input from './Input'

export default function NomorSuratModal({ 
  isOpen = false,
  onClose = null,
  onConfirm = null,
  title = 'Beri Nomor Surat',
  message = 'Masukkan nomor surat untuk surat keputusan ini',
  itemName = '',
  loading = false,
  confirmText = 'Ya, Beri Nomor Surat',
  cancelText = 'Batal',
  initialValue = '',
  fetching = false
}) {
  const [nomorSurat, setNomorSurat] = useState('')
  const [error, setError] = useState('')

  // Set initial value saat modal dibuka atau initialValue berubah
  useEffect(() => {
    if (isOpen) {
      if (initialValue) {
        setNomorSurat(initialValue)
      } else {
        setNomorSurat('')
      }
      setError('')
    }
  }, [isOpen, initialValue])

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setNomorSurat('')
      setError('')
    }
  }, [isOpen])

  const handleConfirm = async () => {
    // Validasi nomor surat harus diisi
    if (!nomorSurat.trim()) {
      setError('Nomor surat harus diisi')
      return
    }

    setError('')
    if (onConfirm) {
      await onConfirm(nomorSurat.trim())
    }
  }

  const handleClose = () => {
    setNomorSurat('')
    setError('')
    if (onClose) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      width="500px"
      height="auto"
      position="center"
      backdropBlur="sm"
      closeOnOverlayClick={false}
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Icon dan Pesan */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
            {itemName && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Surat Keputusan:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {itemName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Nomor Surat */}
        <div className="space-y-2">
          {fetching ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mengambil nomor surat...</p>
              </div>
            </div>
          ) : (
            <Input
              name="nomorSurat"
              label="Nomor Surat *"
              value={nomorSurat}
              onChange={(e) => {
                setNomorSurat(e.target.value)
                if (error) setError('')
              }}
              error={error}
              placeholder="Masukkan nomor surat..."
              required
            />
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>
              Setelah nomor surat diberikan, status surat keputusan akan berubah menjadi "Validasi".
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !nomorSurat.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

