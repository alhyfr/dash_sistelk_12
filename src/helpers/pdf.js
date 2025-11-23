'use client'

// Build absolute file URL from various possible inputs:
// - string filename (e.g., "file_123.pdf")
// - string relative path (e.g., "/api/storage/file_123.pdf")
// - absolute URL (e.g., "http://localhost:3005/api/storage/file_123.pdf")
// - object with fields: file_url | file | kode | id
export function toPdfUrl(input, base = 'https://rest1.sistelk.id') {
  // export function toPdfUrl(input, base = 'http://localhost:3005') {
  if (!input) return ''

  const build = (value) => {
    if (!value) return ''
    if (typeof value !== 'string') return ''
    if (value.startsWith('http')) return value
    const cleaned = value
      .replace(/^\/?api\/storage\/?/, '') // strip leading api/storage
      .replace(/^\//, '') // strip any other leading slash
    return `${base}/api/storage/${cleaned}`
  }

  if (typeof input === 'string') {
    return build(input)
  }

  // object support
  if (input.file_url) return build(input.file_url)
  if (input.file) return build(input.file)
  if (input.kode || input.id) return build(`${input.kode || input.id}.pdf`)

  return ''
}

// ✅ Deteksi tipe file dari URL/filename
export function getFileType(url) {
  if (!url) return 'unknown'

  const urlLower = url.toLowerCase()
  if (urlLower.endsWith('.pdf')) return 'pdf'
  if (urlLower.endsWith('.doc')) return 'doc'
  if (urlLower.endsWith('.docx')) return 'docx'

  return 'unknown'
}

// ✅ Dapatkan viewer URL berdasarkan tipe file
export function getViewerUrl(fileUrl) {
  if (!fileUrl) return ''

  const fileType = getFileType(fileUrl)

  // PDF: langsung gunakan URL dari server backend
  if (fileType === 'pdf') {
    return fileUrl
  }

  // DOC/DOCX: gunakan Microsoft Office Online Viewer untuk menampilkan dari server backend
  if (fileType === 'doc' || fileType === 'docx') {
    const encodedUrl = encodeURIComponent(fileUrl)
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
  }

  return fileUrl
}


