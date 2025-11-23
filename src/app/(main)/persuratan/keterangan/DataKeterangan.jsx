'use client'
import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import DeleteModal from "@/components/Delete";
import ExportModal from "@/components/ExportModal";
import NomorSuratModal from "@/components/NomorSuratModal";
import TambahKeterangan from "./TambahKeterangan";
import BtnDrop from "@/components/BtnDrop";
import { MailCheck, Edit, Trash2 } from "lucide-react";
import api from "@/utils/api";
import dayjs from "dayjs";
import { useData } from "@/context/DataContext";
import { useRouter } from "next/navigation";
import PdfKet from "./PdfKet";
export default function DataKeterangan() {
    const { units, kepsek, ta, getKepsek, getTa } = useData();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSket, setEditingSket] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSket, setDeletingSket] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [bulkDeleteIds, setBulkDeleteIds] = useState([]);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

    const [showExportModal, setShowExportModal] = useState(false);

    const [showBatalModal, setShowBatalModal] = useState(false);
    const [batalingSk, setBatalingSk] = useState(null);
    const [batalLoading, setBatalLoading] = useState(false);

    const [showKetModal, setShowKetModal] = useState(false);
    const [ketSket, setKetSket] = useState(null);

    // Nomor surat modal state
    const [showNomorSuratModal, setShowNomorSuratModal] = useState(false);
    const [nomorSuratSket, setNomorSuratSket] = useState(null);
    const [nomorSuratLoading, setNomorSuratLoading] = useState(false);
    const [generatedNomorSurat, setGeneratedNomorSurat] = useState('');
    const [fetchingNomorSurat, setFetchingNomorSurat] = useState(false);

    const columns = [
        {
            key: 'ns',
            title: 'Nomor Surat',
            searchable: true,
            sortable: true,
            wrap: true,
            minWidth: '200px',

        },
        {
            key: 'nis',
            title: 'NIS',
            searchable: true,
            sortable: true,
        },
        {
            key: "nama",
            title: "Nama",
            searchable: true,
            sortable: true,
        },
        {
            key: "npsn",
            title: "NPSN",
            searchable: true,
            sortable: true,
        },
        {
            key: "kelas",
            title: "Kelas",
            searchable: true,
            sortable: true,
        },
        {
            key: "prodi",
            title: "Program studi",
            searchable: true,
            sortable: true,

        },
        {
            key: "status",
            title: "Status",
            searchable: true,
            sortable: true,
            filterable: true,
            filterOptions: [
                { label: "Semua", value: "all" },
                { label: "Disetujui", value: "disetujui" },
                { label: "Ditolak", value: "ditolak" },
                { label: "Pending", value: "pending" },
            ],
        },
        {
            key: 'pdf',
            title: 'PDF',
            width: '150px',
            sortable: false,
            render: (_, item) => (
                <div className="flex items-center gap-2">
                    <PdfKet item={item} kepsek={kepsek} ta={ta} />
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Aksi',
            width: '150px',
            sortable: false,
            render: (_, item) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1 transition-colors text-green-600 hover:text-green-900"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-1 transition-colors text-red-600 hover:text-red-900"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {
                        item.status === 'disetujui' && (
                            <button
                                onClick={() => handleNomorSurat(item)}
                                className="p-1 transition-colors text-blue-600 hover:text-blue-900"
                                title="beri nomor surat"
                            >
                                <MailCheck className="w-4 h-4" />
                            </button>
                        )
                    }

                    {
                        item.status !== 'valid' && (
                            <BtnDrop
                                items={[
                                    {
                                        label: 'disetujui',
                                        onClick: () => handleStatus(item, 'disetujui')
                                    },
                                    {
                                        label: 'ditolak',
                                        onClick: () => handleStatus(item, 'ditolak')
                                    },
                                    {
                                        label: 'pending',
                                        onClick: () => handleStatus(item, 'pending')
                                    }
                                ]}
                            />
                        )
                    }
                </div>
            )
        }
    ]
    const getSket = async (params = {}, showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true)
            }
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
            const queryParams = new URLSearchParams({
                page: params.page || currentPage,
                per_page: params.per_page || itemsPerPage
            })

            const searchValue = params.search !== undefined ? params.search : searchTerm
            if (searchValue && searchValue.trim() !== '') {
                queryParams.append('search', searchValue)
            }

            if (params.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value) {
                        queryParams.append(key, value)
                    }
                })
            }
            console.log('Fetching users with params:', queryParams.toString())
            const [response] = await Promise.all([
                api.get(`/sisfo/persuratan/sket?${queryParams}`),
                minLoadingTime
            ])

            if (response.data.status === 'success') {
                setData(response.data.data)
                setTotal(response.data.total)
                setCurrentPage(response.data.page)
                setItemsPerPage(response.data.per_page)
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
    const postSket = async (form) => {
        try {
            console.log(form)
            let response
            if (editingSket && editingSket.id) {
                // Update existing user
                response = await api.put(`/sisfo/persuratan/sket/${editingSket.id}`, form)
            } else {
                // Create new user
                response = await api.post('/sisfo/persuratan/sket', form)
            }

            if (response.data.status === 'success') {
                // Refresh data setelah berhasil
                getSket()
                setShowAddModal(false)
                setEditingSket(null)
                setIsEditMode(false)
                return response.data
            }
        } catch (error) {
            console.error('Error saving sket:', error)
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
        getSket(params, true)
    }
    useEffect(() => {
        getSket()
        getKepsek()
        getTa()
    }, [])
    const handleDelete = (sket) => {
        setDeletingSket(sket)
        setShowDeleteModal(true)
    }
    const handleEdit = (sket) => {
        setEditingSket(sket)
        setShowAddModal(true)
        setIsEditMode(true)
    }
    const handleDetail = (sket) => {
        console.log('Detail:', sket)
        // TODO: Implement detail view
    }
    const handleConfirmDelete = async () => {
        if (!deletingSket) return

        setDeleteLoading(true)
        try {
            await api.delete(`/sisfo/persuratan/sket/${deletingSket.id}`)
            getSket()
            setShowDeleteModal(false)
            setDeletingSket(null)
        } catch (error) {
            console.error('Error deleting sket:', error)
        } finally {
            setDeleteLoading(false)
        }
    }
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setDeletingSket(null)
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
            const deletePromises = bulkDeleteIds.map(id => api.delete(`/sisfo/persuratan/sket/${id}`))
            await Promise.all(deletePromises)
            getSket()
            setShowBulkDeleteModal(false)
            setBulkDeleteIds([])
        } catch (error) {
            console.error('Error bulk deleting :', error)
        } finally {
            setBulkDeleteLoading(false)
        }
    }
    const handleCloseBulkDeleteModal = () => {
        setShowBulkDeleteModal(false)
        setBulkDeleteIds([])
        setBulkDeleteLoading(false)
    }
    const handleAdd = () => {
        setEditingSket(null)
        setIsEditMode(false)
        setShowAddModal(true)
    }
    const handleCloseAddModal = () => {
        setShowAddModal(false)
        setEditingSket(null)
        setIsEditMode(false)
    }
    const handleAddSuccess = (newSket) => {
        getSket()
        setShowAddModal(false)
        setEditingSket(null)
        setIsEditMode(false)
    }
    const handleExport = () => {
        setShowExportModal(true)
    }
    const handleStatus = async (sket, status) => {
        try {
            const response = await api.put(`/sisfo/persuratan/sket/${sket.id}/status`, { status })
            getSket()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }
    const handleNomorSurat = async (item) => {
        // Set data yang akan diberi nomor surat
        setNomorSuratSket(item)
        setFetchingNomorSurat(true)
        setGeneratedNomorSurat('')

        try {
            // Ambil nomor surat yang di-generate dari API
            const response = await api.get(`/sisfo/persuratan/sket/nomor`)
            if (response.data.status === 'success' && response.data.data) {
                setGeneratedNomorSurat(response.data.data)
            } else {
                // Jika API tidak mengembalikan nomor, set empty string
                setGeneratedNomorSurat('')
            }
        } catch (error) {
            console.error('Error fetching nomor surat:', error)
            // Jika error, tetap buka modal dengan nomor surat kosong
            setGeneratedNomorSurat('')
        } finally {
            setFetchingNomorSurat(false)
            // Buka modal setelah nomor surat di-fetch
            setShowNomorSuratModal(true)
        }
    }
    const handleConfirmNomorSurat = async (nomorSurat) => {
        if (!nomorSuratSket) return

        setNomorSuratLoading(true)
        try {
            const response = await api.put(`/sisfo/persuratan/sket/${nomorSuratSket.id}/nomorSurat`, {
                ns: nomorSurat,
                status: 'valid'
            })

            if (response.data.status === 'success') {
                getSket({}, true) // Refresh data setelah berhasil
                setShowNomorSuratModal(false)
                setNomorSuratSket(null)
            }
        } catch (error) {
            console.error('Error memberi nomor surat:', error)
            alert('Gagal memberi nomor surat: ' + (error.response?.data?.message || error.message))
        } finally {
            setNomorSuratLoading(false)
        }
    }
    const handleCloseNomorSuratModal = () => {
        setShowNomorSuratModal(false)
        setNomorSuratSket(null)
        setNomorSuratLoading(false)
        setGeneratedNomorSurat('')
        setFetchingNomorSurat(false)
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
                title="Data Surat Keterangan"
                subtitle="Kelola data surat keterangan "
                // Server-side props
                serverSide={true}
                onDataChange={handleDataChange}
                total={total}
                loading={loading}
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
                <TambahKeterangan
                    onClose={handleCloseAddModal}
                    onSuccess={handleAddSuccess}
                    postSket={postSket}
                    editingSket={editingSket}
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
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Siswa"
                message="Apakah Anda yakin ingin menghapus data ini?"
                loading={deleteLoading}
                confirmText="Ya, Hapus Siswa"
                cancelText="Batal"
            />
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                data={data}
                columns={columns}
                title="Export Data Surat Keterangan"
                filename="surat_keterangan_export"
            />
            <NomorSuratModal
                isOpen={showNomorSuratModal}
                onClose={handleCloseNomorSuratModal}
                onConfirm={handleConfirmNomorSurat}
                title="Beri Nomor Surat"
                message="Masukkan nomor surat untuk surat keterangan ini"
                itemName={nomorSuratSket ? `SK: ${nomorSuratSket.tentang || 'Surat Keterangan Siswa'}` : ''}
                loading={nomorSuratLoading}
                confirmText="Ya, Beri Nomor Surat"
                cancelText="Batal"
                initialValue={generatedNomorSurat}
                fetching={fetchingNomorSurat}
            />
        </div>
    )
}