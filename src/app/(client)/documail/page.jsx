'use client'
import { useState } from 'react'
import Formulir from './Formulir'
import Modal from '@/components/Modal'
import api from '@/utils/api'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle, Copy, X } from 'lucide-react'

export default function Esurat() {
  const [kodeSurat, setKodeSurat] = useState('')
  const [showQRModal, setShowQRModal] = useState(false)
  
  const postSurat = async (form) => {
    try {
      const response = await api.post('/sisfo/incoming', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Set kode surat dan tampilkan modal QR
      const kode = response.data.data.kode
      setKodeSurat(kode)
      setShowQRModal(true)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error posting surat:', error)
      return { success: false, message: 'Terjadi kesalahan saat mengirim surat' }
    }
  }

  const qrUrl = `http://track.sistelk.id/${kodeSurat}`
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      alert('URL berhasil disalin ke clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Gagal menyalin URL')
    }
  }

  const handleCloseQRModal = () => {
    setShowQRModal(false)
    setKodeSurat('')
    
    // Redirect ke website SMK Telkom Makassar
    window.location.href = 'https://smktelkom-mks.sch.id'
  }

  return (
    <div>
      <Formulir postSurat={postSurat} />
      
      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={handleCloseQRModal}
        title="Kode QR"
        width="500px"
        height="auto"
        position="center"
        backdropBlur="sm"
        closeOnOverlayClick={false}
        showCloseButton={true}
      >
        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Formulir Berhasil Dikirim!
            </h3>
            <p className="text-gray-600">
              Surat Anda telah berhasil dikirim dengan silahkan screenshoot QR Code di bawah ini untuk melihat status surat Anda.
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Scan QR Code untuk melihat surat
            </h4>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* URL Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              atau dengan menyalin link di bawah ini:
            </h5>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-gray-800 bg-white px-3 py-2 rounded border">
                {qrUrl}
              </code>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                title="Salin URL"
              >
                <Copy className="w-4 h-4" />
                Salin
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p>
              <strong>Instruksi:</strong> Scan QR code di atas atau salin URL untuk melihat status surat Anda.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCloseQRModal}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}