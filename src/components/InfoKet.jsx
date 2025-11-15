'use client'
import { useState, useEffect } from 'react'
import { AlertTriangle, X, Send } from 'lucide-react'
import Modal from './Modal'
import Textarea from './Textarea'

export default function InfoKet({ 
  isOpen = false,
  onClose = null,
  onConfirm = null,
  title = 'Batalkan Surat Keputusan',
  message = 'Apakah Anda yakin ingin membatalkan surat keputusan ini?',
  itemName = '',
  loading = false,
  confirmText = 'Ya, Batalkan',
  cancelText = 'Batal'
}) {
  const [keterangan, setKeterangan] = useState('')
  const [error, setError] = useState('')

  // Reset form saat modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) {
      setKeterangan('')
      setError('')
    }
  }, [isOpen])

  const handleConfirm = async () => {
    // Validasi keterangan harus diisi
    if (!keterangan.trim()) {
      setError('Keterangan harus diisi')
      return
    }

    setError('')
    if (onConfirm) {
      await onConfirm(keterangan.trim())
    }
  }

  const handleClose = () => {
    setKeterangan('')
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
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                  Item yang akan dibatalkan:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {itemName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Keterangan */}
        <div className="space-y-2">
          <Textarea
            name="keterangan"
            label="Keterangan *"
            value={keterangan}
            onChange={(e) => {
              setKeterangan(e.target.value)
              if (error) setError('')
            }}
            error={error}
            rows={4}
            placeholder="Masukkan alasan pembatalan surat keputusan..."
            required
          />
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="text-sm text-red-700 dark:text-red-300">
            <p>
              Surat keputusan akan dikembalikan dengan status "Dikembalikan". Pastikan keterangan sudah diisi dengan benar.
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
            disabled={loading || !keterangan.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Membatalkan...
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

