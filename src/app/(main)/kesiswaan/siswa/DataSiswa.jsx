'use client'
import TambahSiswa from "./TambahSiswa"
import { useState, useEffect } from 'react'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import DeleteModal from '@/components/Delete'
import ExportModal from '@/components/ExportModal'
import { Eye, Edit, Trash2 } from 'lucide-react'
import api from '@/utils/api'
export default function DataSiswa() {
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
    const [editingSiswa, setEditingSiswa] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingSiswa, setDeletingSiswa] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
    const [bulkDeleteIds, setBulkDeleteIds] = useState([])
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)

    const [showExportModal, setShowExportModal] = useState(false)

    const columns = [
        {
            key: 'nis',
            title: 'NIS',
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
            key: 'prodi',
            title: 'Jurusan',
            searchable: true,
            sortable: true
        },
        {
            key: 'angkatan',
            title: 'Angkatan',
            searchable: true,
            sortable: true
        },
        {
            key: 'status',
            title: 'Status',
            sortable: true
        },
        {
            key: 'actions',
            title: 'Aksi',
            type: 'actions',
            sortable: false,
            actions: [
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
    const getSiswa = async (params = {}, showLoading = true) => {
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
                api.get(`/sisfo/siswa?${queryParams}`),  // 🔧 GANTI: endpoint API Anda (contoh: /sisfo/products, /sisfo/categories)
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
    const postSiswa = async (form) => {
        try {
            let response

            // Check if we have editingUser to determine if it's update or create
            if (editingSiswa && editingSiswa.id) {
                // Update existing user
                response = await api.put(`/sisfo/siswa/${editingSiswa.id}`, form)  // 🔧 GANTI: endpoint update (contoh: /sisfo/products/${id})
            } else {
                // Create new user
                response = await api.post('/sisfo/siswa', form)  // 🔧 GANTI: endpoint create (contoh: /sisfo/products)
            }

            if (response.data.status === 'success') {
                // Refresh data setelah berhasil
                getSiswa()
                setShowAddModal(false)
                setEditingSiswa(null)
                setIsEditMode(false)
                return response.data
            }
        } catch (error) {
            console.error('Error saving siswa:', error)
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
    const handleDataChange = (params) => {
        setSearchTerm(params.search || '')
        setFilters(params.filters || {})
        getSiswa(params, true)
    }
    useEffect(() => {
        getSiswa()
    }, [])

    const handleDelete = (siswa) => {
        setDeletingSiswa(siswa)
        setShowDeleteModal(true)
    }
    const handleConfirmDelete = async () => {
        if (!deletingSiswa) return

        setDeleteLoading(true)
        try {
            await api.delete(`/sisfo/siswa/${deletingSiswa.id}`)
            getSiswa()
            setShowDeleteModal(false)
            setDeletingUser(null)
        } catch (error) {
            console.error('Error deleting siswa:', error)
        } finally {
            setDeleteLoading(false)
        }
    }
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setDeletingSiswa(null)
        setDeleteLoading(false)
    }
    const handleBulkDelete = (selectedIds) => {
        setBulkDeleteIds(selectedIds)
        setShowBulkDeleteModal(true)``
    }
    const handleConfirmBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return
        setBulkDeleteLoading(true)
        try {
            const deletePromises = bulkDeleteIds.map(id => api.delete(`/sisfo/siswa/${id}`))
            await Promise.all(deletePromises)
            getSiswa()
            setShowBulkDeleteModal(false)
            setBulkDeleteIds([])
        } catch (error) {
            console.error('Error bulk deleting siswa:', error)
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
        console.log('View siswa:', item)
    }
    const handleAdd = () => {
        setEditingSiswa(null)
        setIsEditMode(false)
        setShowAddModal(true)
    }

    const handleEdit = (item) => {
        setEditingSiswa(item)
        setIsEditMode(true)
        setShowAddModal(true)
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false)
        setEditingSiswa(null)
        setIsEditMode(false)
    }

    const handleAddSuccess = (newUser) => {
        getSiswa()
        setShowAddModal(false)
        setEditingSiswa(null)
        setIsEditMode(false)
    }

    // Export handler
    const handleExport = () => {
        setShowExportModal(true)
    }


    return (
        <div>
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
                title="Data Siswa"                    // 🔧 OPSIONAL: judul tabel
                subtitle="Kelola data siswa sistem" // 🔧 OPSIONAL: subjudul tabel
                // Server-side props
                serverSide={true}                     // 🔧 OPSIONAL: true untuk server-side, false untuk client-side
                onDataChange={handleDataChange}       // 🔄 REUSABLE: handler untuk data change
                total={total}                         // 🔄 REUSABLE: total data dari server
                loading={loading}                     // 🔄 REUSABLE: loading state
            />
            <Modal
                isOpen={showAddModal}
                onClose={handleCloseAddModal}
                title={isEditMode ? "Edit Siswa" : "Tambah Siswa Baru"}
                width="800px"
                height="auto"
                maxHeight="90vh"
                position="top"
                backdropBlur="none"
                closeOnOverlayClick={true}
            >
                <TambahSiswa
                    onClose={handleCloseAddModal}
                    onSuccess={handleAddSuccess}
                    postSiswa={postSiswa}
                    editingSiswa={editingSiswa}
                    isEditMode={isEditMode}
                />
            </Modal>
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Siswa"
                message="Apakah Anda yakin ingin menghapus data ini?"
                loading={deleteLoading}
                confirmText="Ya, Hapus Siswa"
                cancelText="Batal"
            />
            <DeleteModal
                isOpen={showBulkDeleteModal}
                onClose={handleCloseBulkDeleteModal}
                onConfirm={handleConfirmBulkDelete}
                title="Hapus Multiple Siswa"
                message={`Apakah Anda yakin ingin menghapus ${bulkDeleteIds.length} siswa yang dipilih?`}
                itemName={`${bulkDeleteIds.length} siswa akan dihapus`}
                loading={bulkDeleteLoading}
                confirmText="Ya, Hapus Semua"
                cancelText="Batal"
            />
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                data={data}
                columns={columns}
                title="Export Data Siswa"
                filename="siswa_export"
            />
        </div>
    )
}