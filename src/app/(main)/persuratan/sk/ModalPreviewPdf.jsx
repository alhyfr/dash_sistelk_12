'use client'

import { X, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import DownloadPdf from './DownloadPdf'

export default function ModalPreviewPdf({ isOpen, onClose, sk }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)

  const handlePdfGenerated = (url, blob) => {
    setPdfUrl(url)
    setPdfBlob(blob)
  }

  const handleDownload = () => {
    if (pdfBlob) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(pdfBlob)
      link.download = `SK_${sk.ns || 'document'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Preview PDF - {sk?.nomor_sk}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-[calc(90vh-120px)] border border-slate-200 dark:border-slate-700 rounded-lg"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Generating PDF...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Generate PDF Component */}
        {sk && <DownloadPdf sk={sk} onPdfGenerated={handlePdfGenerated} />}
      </div>
    </div>
  )
}