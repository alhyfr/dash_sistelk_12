'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import FadePageIn from '@/components/FadePageIn'
import Breadcrumbs from '@/components/Breadcrumbs'
import { ArrowLeft, FileText, Calendar, Building2, MapPin, Mail, File, AlertCircle } from 'lucide-react'
import dayjs from 'dayjs'
import ViewLampiran from '../ViewLampiran'
import parse from 'html-react-parser'

export default function DetailSK() {
  const params = useParams()
  const router = useRouter()
  const [skData, setSkData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const skId = params.detail

  useEffect(() => {
    // Ambil data dari sessionStorage yang dikirim dari DataSk.jsx
    if (typeof window !== 'undefined') {
      try {
        const storedData = sessionStorage.getItem('skDetailData')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          // Verifikasi bahwa ID sesuai dengan route
          if (parsedData.id && parsedData.id.toString() === skId) {
            setSkData(parsedData)
            setLoading(false)
          } else {
            setError('Data tidak sesuai dengan ID yang diminta')
            setLoading(false)
          }
        } else {
          setError('Data tidak ditemukan. Silakan kembali ke halaman sebelumnya.')
          setLoading(false)
        }
      } catch (error) {
        console.error('Error parsing stored data:', error)
        setError('Gagal memuat data surat keputusan')
        setLoading(false)
      }
    }
  }, [skId])

  const breadcrumbItems = [
    {
      label: 'Persuratan',
      href: '/persuratan/sk',
      icon: null,
    },
    {
      label: 'Surat Keputusan',
      href: '/persuratan/sk',
      icon: null,
    },
    {
      label: skData?.ns || 'Detail',
      href: null,
      icon: FileText,
      isLast: true,
    },
  ]

  if (loading) {
    return (
      <ProtectedRoute>
        <FadePageIn>
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-100 rounded-full mx-auto mb-4">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
              </div>
            </div>
          </div>
        </FadePageIn>
      </ProtectedRoute>
    )
  }

  if (error || !skData) {
    return (
      <ProtectedRoute>
        <FadePageIn>
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <p className="font-medium">{error || 'Data tidak ditemukan'}</p>
              </div>
              <button
                onClick={() => router.back()}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </FadePageIn>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <FadePageIn>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Header */}
          <div className="bg-white  rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detail Surat Keputusan</h1>
                    <p className="text-gray-600 mt-1">
                      {skData.ns || 'Belum divalidasi'}
                    </p>
                  </div>
                </div>
                {skData.status && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    skData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    skData.status === 'proses' ? 'bg-blue-100 text-blue-800' :
                    skData.status === 'dikembalikan' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {skData.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informasi Umum */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Informasi Umum
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {skData.tgl ? dayjs(skData.tgl).format('DD MMMM YYYY') : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {skData.unit || '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Tentang</label>
                    <p className="mt-1 text-gray-900">{ parse(skData.tentang) }</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Perihal</label>
                    <p className="mt-1 text-gray-900">{skData.perihal || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Diktum Surat Keputusan */}
              <div className="bg-white tiptap-display rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Diktum Surat Keputusan</h2>
                <div className="space-y-4">
                  {skData.menimbang && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Menimbang</label>
                      <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {skData.menimbang ? parse(skData.menimbang) : '-'}
                      </div>
                    </div>
                  )}
                  {skData.mengingat && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Mengingat</label>
                      <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        { parse(skData.mengingat) }
                      </div>
                    </div>
                  )}
                  {skData.memperhatikan && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Memperhatikan</label>
                      <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        { parse(skData.memperhatikan) }
                      </div>
                    </div>
                  )}
                  {skData.satu && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Kesatu</label>
                      <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {skData.satu}
                      </div>
                    </div>
                  )}
                  {skData.dua && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Kedua</label>
                      <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {skData.dua}
                      </p>
                    </div>
                  )}
                  {skData.tiga && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Ketiga</label>
                      <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {skData.tiga}
                      </p>
                    </div>
                  )}
                  {skData.empat && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Keempat</label>
                      <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {skData.empat}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informasi Tambahan */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h2>
                <div className="space-y-4">
                  {skData.lokasi && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        Lokasi
                      </label>
                      <p className="text-gray-900">{skData.lokasi}</p>
                    </div>
                  )}
                  {skData.tembusan && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Tembusan
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {skData.tembusan}
                      </p>
                    </div>
                  )}
                  {skData.ket && skData.status === 'dikembalikan' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Keterangan Pengembalian</label>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-red-900 whitespace-pre-wrap">{skData.ket}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lampiran */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <File className="w-5 h-5 text-red-600" />
                  Lampiran
                </h2>
                <div className="mt-4">
                  {skData.lampiran ? (
                    <ViewLampiran item={skData.lampiran} />
                  ) : (
                    <p className="text-gray-500 text-sm italic">Tidak ada lampiran</p>
                  )}
                </div>
              </div>

              {/* Informasi Sistem */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-gray-500">Dibuat</label>
                    <p className="text-gray-900 mt-1">
                      {skData.created_at ? dayjs(skData.created_at).format('DD MMMM YYYY HH:mm') : '-'}
                    </p>
                  </div>
                  {skData.updated_at && (
                    <div>
                      <label className="text-gray-500">Diperbarui</label>
                      <p className="text-gray-900 mt-1">
                        {dayjs(skData.updated_at).format('DD MMMM YYYY HH:mm')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadePageIn>
    </ProtectedRoute>
  )
}

