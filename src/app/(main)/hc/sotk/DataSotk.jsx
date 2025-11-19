'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import DeleteModal from '@/components/Delete'
import ExportModal from '@/components/ExportModal'
import TambahSotk from './TambahSotk'
import { Eye, Edit, Trash2 } from 'lucide-react'
import api from '@/utils/api'
export default function DataSotk() {
  const [data, setData] = useState([])          
  const [total, setTotal] = useState(0)         
  const [loading, setLoading] = useState(false) 
  const [currentPage, setCurrentPage] = useState(1)     
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filters, setFilters] = useState({})

  const [showAddModal, setShowAddModal] = useState(false)     
  const [editingSotk, setEditingSotk] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)     
  const [deletingSotk, setDeletingSotk] = useState(null)           
  const [deleteLoading, setDeleteLoading] = useState(false) 

  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false) 
  const [bulkDeleteIds, setBulkDeleteIds] = useState([])
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)  

  const [showExportModal, setShowExportModal] = useState(false)  

  const columns = [
    {
      key: 'nip',
      title: 'NIP',
      searchable: true,
      sortable: true
    },
    {
      key: 'nama',
      title: 'Nama',
      searchable: true,
      sortable: true
    },
    {
      key: 'jabatan',
      title: 'Jabatan',
      searchable: true,
      sortable: true
    },
    {
      key: 'unit',
      title: 'Unit',
      searchable: true,
      sortable: true
    },
    {
      key: 'foto',
      title: 'Foto',
      searchable: true,
      sortable: true
    },
    {
      key: 'kodejab',
      title: 'Kode Jabatan',
      searchable: true,
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      searchable: false,
      sortable: false,
      actions: [
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
  const getSotk = async (params = {}, showLoading = true) => {
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
        api.get(`/sisfo/hc/sotk?${queryParams}`),  // 🔧 GANTI: endpoint API Anda (contoh: /sisfo/products, /sisfo/categories)
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
  const postSotk = async (form) => {
    try {
      let response
      if (editingSotk && editingSotk.id) {
        response = await api.put(`/sisfo/hc/sotk/${editingSotk.id}`, form)
      } else {
        response = await api.post('/sisfo/hc/sotk', form)
      }
      if (response.data.status === 'success') {
        getSotk()
        setShowAddModal(false)
        setEditingSotk(null)
        setIsEditMode(false)
        return response.data
      }
    } catch (error) {
      console.error('Error saving user:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.message) {
        throw error
      } else {
        throw new Error('Terjadi kesalahan saat menyimpan data')
      }
    }
  }
  const handleDataChange = (params) => {
    setSearchTerm(params.search || '')      
    setFilters(params.filters || {})
    getSotk(params, true)                  
  }
  useEffect(() => {
    getSotk()  
  }, [])

  const handleDelete = (sotk) => {
    setDeletingSotk(sotk)                   
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingSotk) return
    setDeleteLoading(true)
    try {
      await api.delete(`/sisfo/hc/sotk/${deletingUser}`)  
      getSotk()
      setShowDeleteModal(false)
      setDeletingSotk(null)  
    } catch (error) {
      console.error('Error deleting sotk:', error)  
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingSotk(null)  
    setDeleteLoading(false)
  }
  const handleBulkDelete = (selectedIds) => {
    setBulkDeleteIds(selectedIds)
    setShowBulkDeleteModal(true)
  }

  const handleConfirmBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return

    setBulkDeleteLoading(true)
    try {
      const deletePromises = bulkDeleteIds.map(id => api.delete(`/sisfo/hc/sotk/${id}`))  
      await Promise.all(deletePromises)
      getSotk()  
      setShowBulkDeleteModal(false)
      setBulkDeleteIds([])
    } catch (error) {
      console.error('Error bulk deleting sotk:', error)  
    } finally {
      setBulkDeleteLoading(false)
    }
  }

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false)
    setBulkDeleteIds([])
    setBulkDeleteLoading(false)
  }
  const handleView = (item) => {
    console.log('View user:', item)  // 🔧 GANTI: sesuaikan pesan log dan logic
    // 🔧 IMPLEMENT: logic view sesuai kebutuhan
  }
  const handleAdd = () => {
    setEditingSotk(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setEditingSotk(item)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(true)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingSotk(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
  }
  const handleAddSuccess = (newSotk) => {
    getSotk()  
    setShowAddModal(false)
    setEditingSotk(null)  
    setIsEditMode(false)
  }
  const handleExport = () => {
    setShowExportModal(true)
  }

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onExport={handleExport}               
        onBulkDelete={handleBulkDelete}       
        searchable={true}                     
        filterable={true}
        sortable={true}
        selectable={true}
        pagination={true}
        itemsPerPageOptions={[5, 10, 25, 50]}
        defaultItemsPerPage={10}
        // Title props
        title="Data SOTK"
        subtitle="Kelola data SOTK"
        // Server-side props
        serverSide={true}
        onDataChange={handleDataChange}       
        total={total}
        loading={loading}
      />
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title={isEditMode ? "Edit SOTK" : "Tambah SOTK Baru"}
        width="800px"
        height="auto"
        maxHeight="90vh"
        position="top"
        backdropBlur="none"
        closeOnOverlayClick={true}
      >
        <TambahSotk
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
          postSotk={postSotk}
          editingSotk={editingSotk}
          isEditMode={isEditMode}
        />
      </Modal>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus SOTK"
        message="Apakah Anda yakin ingin menghapus data ini?"
        loading={deleteLoading}
        confirmText="Ya, Hapus SOTK"
        cancelText="Batal"
      />
        <DeleteModal
        isOpen={showBulkDeleteModal}
        onClose={handleCloseBulkDeleteModal}
        onConfirm={handleConfirmBulkDelete}
        title="Hapus Multiple SOTK"
        message={`Apakah Anda yakin ingin menghapus ${bulkDeleteIds.length} SOTK yang dipilih?`}
        itemName={`${bulkDeleteIds.length} SOTK akan dihapus`}
        loading={bulkDeleteLoading}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
      />
       <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={data}
        columns={columns}
        title="Export Data SOTK"
        filename="sotk_export"
      />
    </div>
  )
}