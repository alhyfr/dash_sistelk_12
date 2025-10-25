'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import DeleteModal from '@/components/Delete'
import ExportModal from '@/components/ExportModal'
import TambahUser from './TambahUser'
import { Eye, Edit, Trash2 } from 'lucide-react'
import api from '@/utils/api'

export default function DataUsers() {
  // ========================================
  // 🔄 REUSABLE - State management (SAMA untuk semua halaman)
  // State ini bisa digunakan untuk halaman data table apapun
  // ========================================
  const [data, setData] = useState([])           // Data yang ditampilkan di table
  const [total, setTotal] = useState(0)         // Total data dari server (untuk pagination)
  const [loading, setLoading] = useState(false) // Loading state saat fetch data
  const [currentPage, setCurrentPage] = useState(1)     // Halaman aktif
  const [itemsPerPage, setItemsPerPage] = useState(10) // Jumlah item per halaman
  const [searchTerm, setSearchTerm] = useState('')      // Kata kunci pencarian
  const [sortField, setSortField] = useState('')       // Field yang di-sort
  const [sortDirection, setSortDirection] = useState('asc') // Arah sorting (asc/desc)
  const [filters, setFilters] = useState({})           // Filter yang aktif
  
  // ========================================
  // 🔧 CUSTOMIZE - Modal state (SESUAIKAN dengan kebutuhan halaman)
  // State modal ini spesifik untuk halaman users, sesuaikan untuk halaman lain
  // ========================================
  const [showAddModal, setShowAddModal] = useState(false)     // Modal tambah/edit data
  const [editingUser, setEditingUser] = useState(null)        // Data yang sedang diedit
  const [isEditMode, setIsEditMode] = useState(false)         // Mode edit (true) atau tambah (false)
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)     // Modal konfirmasi hapus
  const [deletingUser, setDeletingUser] = useState(null)           // Data yang akan dihapus
  const [deleteLoading, setDeleteLoading] = useState(false)        // Loading saat proses hapus
  
  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false) // Modal konfirmasi hapus multiple
  const [bulkDeleteIds, setBulkDeleteIds] = useState([])               // Array ID yang akan dihapus
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)    // Loading saat proses hapus multiple
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false)        // Modal export data

  // ========================================
  // ⚙️ CUSTOMIZE - Column configuration (SESUAIKAN dengan data Anda)
  // Konfigurasi kolom ini HARUS disesuaikan untuk setiap halaman data table
  // ========================================
  const columns = [
    {
      key: 'username',           // 🔧 GANTI: field dari API response
      title: 'Username',         // 🔧 GANTI: judul kolom
      searchable: true,          // 🔧 OPSIONAL: apakah bisa di-search
      sortable: true             // 🔧 OPSIONAL: apakah bisa di-sort
    },
    {
      key: 'email',              // 🔧 GANTI: field dari API response
      title: 'Email',            // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true
    },
    {
      key: 'role_name',          // 🔧 GANTI: field dari API response
      title: 'Role',             // 🔧 GANTI: judul kolom
      sortable: true,
      filterable: true,          // 🔧 OPSIONAL: apakah ada filter
      filterOptions: [           // 🔧 GANTI: opsi filter sesuai data
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Moderator' },
        { value: 7, label: 'User' }
      ]
    },
    {
      key: 'status',             // 🔧 GANTI: field dari API response
      title: 'Status',           // 🔧 GANTI: judul kolom
      type: 'badge',             // 🔧 OPSIONAL: tipe kolom (badge, date, dll)
      sortable: true,
      filterable: true,
      filterOptions: [           // 🔧 GANTI: opsi filter sesuai data
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      badgeClasses: {            // 🔧 GANTI: warna badge sesuai data
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-red-100 text-red-800'
      }
    },
    {
      key: 'created_at',         // 🔧 GANTI: field dari API response
      title: 'Created At',       // 🔧 GANTI: judul kolom
      type: 'date',              // 🔧 OPSIONAL: tipe kolom untuk format tanggal
      sortable: true
    },
    {
      key: 'actions',            // 🔧 GANTI: kolom untuk actions
      title: 'Aksi',             // 🔧 GANTI: judul kolom
      type: 'actions',           // 🔧 OPSIONAL: tipe kolom untuk actions
      sortable: false,           // 🔧 OPSIONAL: actions tidak bisa di-sort
      actions: [                 // 🔧 GANTI: array actions
        {
          icon: Eye,
          title: 'Lihat',
          className: 'text-blue-600 hover:text-blue-900',
          onClick: (item) => handleView(item)
        },
        {
          icon: Edit,
          title: 'Edit',
          className: 'text-green-600 hover:text-green-900',
          onClick: (item) => handleEdit(item)
        },
        {
          icon: Trash2,
          title: 'Hapus',
          className: 'text-red-600 hover:text-red-900',
          onClick: (item) => handleDelete(item)
        }
      ]
    }
  ]

  // ========================================
  // 🔧 CUSTOMIZE - Fetch data function (SESUAIKAN endpoint API)
  // Function ini HARUS disesuaikan untuk setiap halaman data table
  // Ganti endpoint API, response structure, dan field mapping
  // ========================================
  const getUsers = async (params = {}, showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      
      // Add minimum loading delay for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: params.page || currentPage,
        per_page: params.per_page || itemsPerPage
      })

      // Add search parameter (even if empty)
      const searchValue = params.search !== undefined ? params.search : searchTerm
      if (searchValue && searchValue.trim() !== '') {
        queryParams.append('search', searchValue)
      }

      // Add filter parameters to query
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value)
          }
        })
      }

      console.log('Fetching users with params:', queryParams.toString())
      
      // Wait for both API call and minimum loading time
      const [response] = await Promise.all([
        api.get(`/sisfo/users?${queryParams}`),  // 🔧 GANTI: endpoint API Anda (contoh: /sisfo/products, /sisfo/categories)
        minLoadingTime
      ])
      
      if (response.data.status === 'success') {
        setData(response.data.data)              // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.products)
        setTotal(response.data.total)            // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.total_count)
        setCurrentPage(response.data.page)       // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.current_page)
        setItemsPerPage(response.data.per_page)  // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.per_page)
        // console.log(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setData([])
      setTotal(0)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }
  // ========================================
  // 🔧 CUSTOMIZE - CRUD operations (SESUAIKAN dengan endpoint API)
  // Function ini HARUS disesuaikan untuk setiap halaman data table
  // Ganti endpoint API dan field mapping sesuai dengan data yang dikelola
  // ========================================
  const postUser = async (form) => {
    try {
      let response
      
      // Check if we have editingUser to determine if it's update or create
      if (editingUser && editingUser.id) {
        // Update existing user
        response = await api.put(`/sisfo/users/${editingUser.id}`, form)  // 🔧 GANTI: endpoint update (contoh: /sisfo/products/${id})
      } else {
        // Create new user
        response = await api.post('/sisfo/users', form)  // 🔧 GANTI: endpoint create (contoh: /sisfo/products)
      }
      
      if (response.data.status === 'success') {
        // Refresh data setelah berhasil
        getUsers()
        setShowAddModal(false)
        setEditingUser(null)
        setIsEditMode(false)
        return response.data
      }
    } catch (error) {
      console.error('Error saving user:', error)
      // Re-throw error agar bisa ditangani di TambahUser component
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.message) {
        throw error
      } else {
        throw new Error('Terjadi kesalahan saat menyimpan data')
      }
    }
  }

  // ========================================
  // 🔄 REUSABLE - Handle data change (SAMA untuk semua halaman)
  // Function ini bisa digunakan untuk halaman data table apapun
  // ========================================
  const handleDataChange = (params) => {
    setSearchTerm(params.search || '')      // Update search term
    setFilters(params.filters || {})        // Update filters
    
    // getUsers will handle loading state
    getUsers(params, true)                  // 🔧 GANTI: sesuaikan nama function (contoh: getProducts, getCategories)
  }

  // ========================================
  // 🔄 REUSABLE - Initial load (SAMA untuk semua halaman)
  // useEffect ini bisa digunakan untuk halaman data table apapun
  // ========================================
  useEffect(() => {
    getUsers()  // 🔧 GANTI: sesuaikan nama function (contoh: getProducts, getCategories)
  }, [])

  // ========================================
  // 🔧 CUSTOMIZE - Event handlers (SESUAIKAN dengan kebutuhan Anda)
  // Handler ini HARUS disesuaikan untuk setiap halaman data table
  // Ganti endpoint API, nama variable, dan logic sesuai dengan data yang dikelola
  // ========================================

  // Delete handlers
  const handleDelete = (user) => {
    setDeletingUser(user)                    // 🔧 GANTI: sesuaikan nama variable (contoh: deletingProduct, deletingCategory)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return

    setDeleteLoading(true)
    try {
      await api.delete(`/sisfo/users/${deletingUser}`)  // 🔧 GANTI: endpoint delete (contoh: /sisfo/products/${id})
      // Refresh data after delete
      getUsers()  // 🔧 GANTI: sesuaikan nama function (contoh: getProducts, getCategories)
      setShowDeleteModal(false)
      setDeletingUser(null)  // 🔧 GANTI: sesuaikan nama variable
    } catch (error) {
      console.error('Error deleting user:', error)  // 🔧 GANTI: sesuaikan pesan error
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingUser(null)  // 🔧 GANTI: sesuaikan nama variable
    setDeleteLoading(false)
  }

  // Bulk delete handlers
  const handleBulkDelete = (selectedIds) => {
    setBulkDeleteIds(selectedIds)
    setShowBulkDeleteModal(true)
  }

  const handleConfirmBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return

    setBulkDeleteLoading(true)
    try {
      // Delete multiple users
      const deletePromises = bulkDeleteIds.map(id => api.delete(`/sisfo/users/${id}`))  // 🔧 GANTI: endpoint delete
      await Promise.all(deletePromises)
      
      // Refresh data after delete
      getUsers()  // 🔧 GANTI: sesuaikan nama function
      setShowBulkDeleteModal(false)
      setBulkDeleteIds([])
    } catch (error) {
      console.error('Error bulk deleting users:', error)  // 🔧 GANTI: sesuaikan pesan error
    } finally {
      setBulkDeleteLoading(false)
    }
  }

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false)
    setBulkDeleteIds([])
    setBulkDeleteLoading(false)
  }

  // CRUD handlers
  const handleView = (item) => {
    console.log('View user:', item)  // 🔧 GANTI: sesuaikan pesan log dan logic
    // 🔧 IMPLEMENT: logic view sesuai kebutuhan
  }

  const handleAdd = () => {
    setEditingUser(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setEditingUser(item)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(true)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingUser(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
  }

  const handleAddSuccess = (newUser) => {
    console.log('User added successfully:', newUser)  // 🔧 GANTI: sesuaikan pesan log
    // Refresh data after successful add
    getUsers()  // 🔧 GANTI: sesuaikan nama function
    setShowAddModal(false)
    setEditingUser(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
  }

  // Export handler
  const handleExport = () => {
    setShowExportModal(true)
  }

  return (
    <>
      {/* ========================================
          🔄 REUSABLE - DataTable component (SAMA untuk semua halaman)
          DataTable ini bisa digunakan untuk halaman data table apapun
          ======================================== */}
      <DataTable
        data={data}                          // Data yang ditampilkan
        columns={columns}                     // Konfigurasi kolom (HARUS disesuaikan)
        onAdd={handleAdd}                     // Handler tambah data
        onExport={handleExport}               // Handler export data
        onBulkDelete={handleBulkDelete}       // Handler bulk delete
        searchable={true}                     // 🔧 OPSIONAL: enable/disable search
        filterable={true}                     // 🔧 OPSIONAL: enable/disable filter
        sortable={true}                       // 🔧 OPSIONAL: enable/disable sort
        selectable={true}                     // 🔧 OPSIONAL: enable/disable selection
        pagination={true}                     // 🔧 OPSIONAL: enable/disable pagination
        itemsPerPageOptions={[5, 10, 25, 50]} // 🔧 OPSIONAL: opsi items per page
        defaultItemsPerPage={10}              // 🔧 OPSIONAL: default items per page
        // Title props
        title="Data Users"                    // 🔧 OPSIONAL: judul tabel
        subtitle="Kelola data pengguna sistem" // 🔧 OPSIONAL: subjudul tabel
        // Server-side props
        serverSide={true}                     // 🔧 OPSIONAL: true untuk server-side, false untuk client-side
        onDataChange={handleDataChange}       // 🔄 REUSABLE: handler untuk data change
        total={total}                         // 🔄 REUSABLE: total data dari server
        loading={loading}                     // 🔄 REUSABLE: loading state
      />

      {/* ========================================
          🔧 CUSTOMIZE - Modal components (SESUAIKAN dengan kebutuhan halaman)
          Modal ini HARUS disesuaikan untuk setiap halaman data table
          Ganti nama modal, title, dan component sesuai dengan data yang dikelola
          ======================================== */}

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title={isEditMode ? "Edit User" : "Tambah User Baru"}
        width="800px"
        height="auto"
        maxHeight="90vh"
        position="top"
        backdropBlur="none"
        closeOnOverlayClick={true}
      >
        <TambahUser
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
          postUser={postUser}
          editingUser={editingUser}
          isEditMode={isEditMode}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus User"
        message="Apakah Anda yakin ingin menghapus data ini?"
        loading={deleteLoading}
        confirmText="Ya, Hapus User"
        cancelText="Batal"
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showBulkDeleteModal}
        onClose={handleCloseBulkDeleteModal}
        onConfirm={handleConfirmBulkDelete}
        title="Hapus Multiple User"
        message={`Apakah Anda yakin ingin menghapus ${bulkDeleteIds.length} user yang dipilih?`}
        itemName={`${bulkDeleteIds.length} user akan dihapus`}
        loading={bulkDeleteLoading}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={data}
        columns={columns}
        title="Export Data Users"
        filename="users_export"
      />
    </>
  )
}