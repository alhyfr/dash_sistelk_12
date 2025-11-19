// utils/constraints.js
import validate from 'validate.js'

// ✅ Custom validator untuk file type
validate.validators.fileType = function(value, options) {
  if (!value) {
    // Jika tidak ada file dan field optional, return null (valid)
    return null
  }

  // Jika value adalah File object
  if (value instanceof File) {
    const fileName = value.name.toLowerCase()
    const allowedExtensions = options.extensions || []
    const fileExtension = fileName.split('.').pop()

    if (!allowedExtensions.includes(fileExtension)) {
      return options.message || `File harus berformat ${allowedExtensions.join(', ')}`
    }
  }

  return null
}

// ✅ Custom validator untuk file size (opsional, untuk batasi ukuran)
validate.validators.fileSize = function(value, options) {
  if (!value || !(value instanceof File)) {
    return null
  }

  const maxSize = options.maximum || 5242880 // default 5MB
  if (value.size > maxSize) {
    return options.message || `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)}MB`
  }

  return null
}

const constraints = {
  tgl: {
    presence: { allowEmpty: false, message: "^Tanggal wajib diisi" },
  },
  tentang: {
    presence: { allowEmpty: false, message: "^Tentang wajib diisi" },
    length: {
      minimum: 3,
      message: "^Tentang minimal 3 karakter"
    }
  },
  // perihal: {
  //   presence: { allowEmpty: false, message: "^Perihal wajib diisi" },
  // },
  menimbang: {
    presence: { allowEmpty: false, message: "^Menimbang wajib diisi" },
  },
  mengingat: {
    presence: { allowEmpty: false, message: "^Mengingat wajib diisi" },
  },
  memperhatikan: {
    presence: { allowEmpty: false, message: "^Memperhatikan wajib diisi" },
  },
  menetapkan: {
    presence: { allowEmpty: false, message: "^Menetapkan wajib diisi" },
  },
  satu: {
    presence: { allowEmpty: false, message: "^Satu wajib diisi" },
  },
  // dua, tiga, empat bisa optional
  lokasi: {
    presence: { allowEmpty: false, message: "^Lokasi wajib diisi" },
  },
  unit: {
    presence: { allowEmpty: false, message: "^Unit wajib diisi" },
  },
  // ✅ Validasi lampiran: optional, tapi jika ada harus doc/docx/pdf
  lampiran: {
    fileType: {
      extensions: ['doc', 'docx', 'pdf'],
      message: "^File lampiran harus berformat DOC, DOCX, atau PDF"
    },
    fileSize: {
      maximum: 10485760, // 10MB
      message: "^Ukuran file lampiran maksimal 10MB"
    }
  },
  kodejab: {
    presence: { allowEmpty: false, message: "^Kode Jabatan wajib diisi" },
  },
  jabatan: {
    presence: { allowEmpty: false, message: "^Jabatan wajib diisi" },
  },
  nip: {
    presence: { allowEmpty: false, message: "^NIP wajib diisi" },
  },
  nama: {
    presence: { allowEmpty: false, message: "^Nama wajib diisi" },
  },
  unit: {
    presence: { allowEmpty: false, message: "^Unit wajib diisi" },
  },
}

export default constraints