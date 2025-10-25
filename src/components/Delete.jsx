'use client'
import { useState } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import Modal from './Modal'

export default function DeleteModal({ 
  isOpen = false,
  onClose = null,
  onConfirm = null,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini?',
  itemName = '',
  loading = false,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal'
}) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="400px"
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
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {message}
            </p>
            {itemName && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Item yang akan dihapus:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {itemName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-1">
          <div className="flex">
            
            <div className="ml-3">
              
              <div className="text-sm text-red-700">
                <p>
                  Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}