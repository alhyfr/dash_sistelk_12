"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import DeleteModal from "@/components/Delete";
import ExportModal from "@/components/ExportModal";
import InfoKet from "@/components/InfoKet";
import NomorSuratModal from "@/components/NomorSuratModal";
import TambahSk from "./TambahSk";
import Input from "@/components/Input";
import { Eye, Edit, Trash2,TrendingUp,TrendingDown,EllipsisVertical, ReceiptText, FileText,ShieldCheck } from "lucide-react";
import api from "@/utils/api";
import dayjs from "dayjs";
import ViewLampiran from "./ViewLampiran";
import { useData } from "@/context/DataContext";
import { useRouter } from "next/navigation";

export default function DataSk() {
  const { units } = useData();
  const router = useRouter();
  const [data, setData] = useState([]); // Data yang ditampilkan di table
  const [total, setTotal] = useState(0); // Total data dari server (untuk pagination)
  const [loading, setLoading] = useState(false); // Loading state saat fetch data
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const [itemsPerPage, setItemsPerPage] = useState(10); // Jumlah item per halaman
  const [searchTerm, setSearchTerm] = useState(""); // Kata kunci pencarian
  const [sortField, setSortField] = useState(""); // Field yang di-sort
  const [sortDirection, setSortDirection] = useState("asc"); // Arah sorting (asc/desc)
  const [filters, setFilters] = useState({});

  const [showAddModal, setShowAddModal] = useState(false); // Modal tambah/edit data
  const [editingSk, setEditingSk] = useState(null); // Data yang sedang diedit
  const [isEditMode, setIsEditMode] = useState(false); // Mode edit (true) atau tambah (false)

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal konfirmasi hapus
  const [deletingSk, setDeletingSk] = useState(null); // Data yang akan dihapus
  const [deleteLoading, setDeleteLoading] = useState(false); // Loading saat proses hapus

  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false); // Modal konfirmasi hapus multiple
  const [bulkDeleteIds, setBulkDeleteIds] = useState([]); // Array ID yang akan dihapus
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false); // Loading saat proses hapus multiple

  const [showExportModal, setShowExportModal] = useState(false);

  // Batal modal state
  const [showBatalModal, setShowBatalModal] = useState(false); // Modal konfirmasi batal
  const [batalingSk, setBatalingSk] = useState(null); // Data yang akan dibatalkan
  const [batalLoading, setBatalLoading] = useState(false); // Loading saat proses batal

  // Keterangan modal state
  const [showKetModal, setShowKetModal] = useState(false); // Modal keterangan
  const [ketSk, setKetSk] = useState(null); // Data SK yang akan ditampilkan keterangannya

  // Nomor surat modal state
  const [showNomorSuratModal, setShowNomorSuratModal] = useState(false); // Modal nomor surat
  const [nomorSuratSk, setNomorSuratSk] = useState(null); // Data SK yang akan diberi nomor surat
  const [nomorSuratLoading, setNomorSuratLoading] = useState(false); // Loading saat proses nomor surat
  const [generatedNomorSurat, setGeneratedNomorSurat] = useState(''); // Nomor surat yang di-generate dari API
  const [fetchingNomorSurat, setFetchingNomorSurat] = useState(false); // Loading saat fetch nomor surat

  const columns = [
    {
      key:'unit',
      title: "Unit",
      searchable: true,
      sortable: true,
    },
    {
      key: "ns",
      title: "Nomor",
      searchable: true,
      sortable: true,
      render: (value, item) => {
        // Cek jika item null atau undefined
        if (!item) {
          return (
            <span className="text-gray-500 dark:text-gray-400 italic">
              -
            </span>
          );
        }
        // Jika ns kosong atau null, tampilkan pesan "Surat belum divalidasi"
        const ns = value || item.ns;
        if (!ns || (typeof ns === 'string' && ns.trim() === '')) {
          return (
            <span className="text-gray-500 dark:text-gray-400 italic">
              Surat belum divalidasi
            </span>
          );
        }
        // Jika ns ada, tampilkan link
        return (
          <div className="text-green-600 text-sm">
            {ns}
          </div>
        );
      },
      
    },
    {
      key: "tentang",
      title: "Tentang",
      searchable: true,
      sortable: true,
      wrap: true,
      minWidth: "300px",

      
    },
    {
      key: "tgl",
      title: "Tanggal SK",
      searchable: true,
      sortable: true,
      render: (item) => {
        return dayjs(item).format("DD-MM-YYYY");
      },
    },
    {
      key: "lampiran",
      title: "Lampiran",
      searchable: true,
      sortable: true,
      render: (value, item) => {
        // Cek jika item null atau undefined
        if (!item) {
          return (
            <span className="text-gray-500 dark:text-gray-400 italic">
              -
            </span>
          );
        }
        // Cek apakah unit sesuai atau user adalah HC
        const isUnitMatch = units?.role_name === item?.unit;
        const isHC = units?.role_name === 'HC';
        
        // Jika tidak sesuai unit dan bukan HC, tampilkan "-"
        if (!isUnitMatch && !isHC) {
          return (
            <span className="text-gray-500 dark:text-gray-400 italic">
              -
            </span>
          );
        }
        // Jika sesuai unit atau HC, tampilkan ViewLampiran
        // Kirim item.lampiran saja karena nama dan extension sudah di database
        return (
          <div className="text-left">
            <ViewLampiran item={item.lampiran} />
          </div>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      searchable: true,
      sortable: true,
      render: (value, item) => {
        // Cek jika item null atau undefined
        if (!item) {
          return (
            <span className="text-gray-500 dark:text-gray-400 italic">
              -
            </span>
          );
        }
        // Gunakan value atau item.status sebagai fallback
        const status = value || item.status || '-';
        const isDikembalikan = status === 'dikembalikan';
        
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 italic">
              {status}
            </span>
            {isDikembalikan && item?.ket && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setKetSk(item);
                  setShowKetModal(true);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Lihat keterangan"
              >
                <EllipsisVertical className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Aksi",
      type: "actions",
      actions: [
        {
          icon: FileText,
          title: "Lihat",
          className: "text-blue-600 hover:text-blue-900",
          onClick: (item) => handleView(item),
          show: (item) => {
            // Tampilkan tombol Lihat hanya jika unit dari useData sama dengan 'HC'
            return units?.role_name === 'HC' || units?.role_name === item?.unit;
          },
        },
        {
          icon: Edit,
          title: "Edit",
          className: "text-green-600 hover:text-green-900",
          onClick: (item) => handleEdit(item),
          show: (item) => {
            // Tampilkan tombol Edit hanya jika unit dari useData sama dengan item.unit
            return units?.role_name === item?.unit;
          },
        },
        {
          icon: Trash2,
          title: "Hapus",
          className: "text-red-600 hover:text-red-900",
          onClick: (item) => handleDelete(item),
          show: (item) => {
            // Tampilkan tombol Hapus hanya jika unit dari useData sama dengan item.unit
            return units?.role_name === item?.unit;
          },
        },
        {
          icon: TrendingUp,
          title: "Aujukan",
          className: "text-yellow-600 hover:text-yellow-900",
          onClick: (item) => handleProses(item),
          show: (item) => {
            return units?.role_name === item?.unit && item?.status === 'pending';
          },
        },
        {
          icon: TrendingDown,
          title: "Kembalikan",
          className: "text-red-600 hover:text-red-900",
          onClick: (item) => handleBatal(item),
          show: (item) => {
            return units?.role_name === 'HC' && item?.status === 'proses';
          },
        },
        {
          icon: ShieldCheck,
          title: "beri nomor surat",
          className: "text-green-600 hover:text-green-900",
          onClick: (item) => handleNomorSurat(item),
          show: (item) => {
            return units?.role_name === 'HC' && item?.status === 'proses';
          },
        }
        
      ],
    },
  ];
  const getSk = async (params = {}, showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      // Add minimum loading delay for better UX
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
  
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: params.page || currentPage,
        per_page: params.per_page || itemsPerPage,
      });
  
      // Add search parameter (even if empty)
      const searchValue =
        params.search !== undefined ? params.search : searchTerm;
      if (searchValue && searchValue.trim() !== "") {
        queryParams.append("search", searchValue);
      }
  
      // Add filter parameters to query
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }
  
      // Wait for both API call and minimum loading time
      const [response] = await Promise.all([
        api.get(`/sisfo/persuratan/sk?${queryParams}`),
        minLoadingTime,
      ]);
  
      if (response.data.status === "success") {
        setData(response.data.data); 
        setTotal(response.data.total);
        setCurrentPage(response.data.page); 
        setItemsPerPage(response.data.per_page); 
      }
    } catch (error) {
      console.error("Error fetching SK:", error);
      setData([]);
      setTotal(0);
    } finally {
      // Selalu set loading ke false di finally block
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const postSk = async (form) => {
    try {
      let response
      
      // Check if we have editingUser to determine if it's update or create
      if (editingSk && editingSk.id) {
        // Update existing user
        // PENTING: Jangan set Content-Type manual untuk FormData, biarkan axios set otomatis dengan boundary
        response = await api.put(`/sisfo/persuratan/sk/${editingSk.id}`, form,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })  // 🔧 GANTI: endpoint update (contoh: /sisfo/products/${id})
      } else {
        // Create new user
        // PENTING: Jangan set Content-Type manual untuk FormData, biarkan axios set otomatis dengan boundary
        response = await api.post('/sisfo/persuratan/sk', form,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })  // 🔧 GANTI: endpoint create (contoh: /sisfo/products)
      }
      
      if (response.data.status === 'success') {
        // Refresh data setelah berhasil
        getSk({}, true) // Set showLoading=true untuk refresh setelah save
        setShowAddModal(false)
        setEditingSk(null)
        setIsEditMode(false)
        return response.data
      }
    } catch (error) {
      console.error('Error saving SK:', error);
    }
  }
  const handleDataChange = (params) => {
    setSearchTerm(params.search || '')
    setFilters(params.filters || {})
    // getUsers will handle loading state
    getSk(params, true)                
  }
  useEffect(() => {
    getSk({}, true) // Set showLoading=true untuk initial load
  }, [])

    // Delete handlers
    const handleDelete = (sk) => {
      // Simpan object sk untuk ditampilkan di modal, tapi ambil ID untuk delete
      setDeletingSk(sk)
      setShowDeleteModal(true)
    }
    const handleConfirmDelete = async () => {
      if (!deletingSk) return
  
      setDeleteLoading(true)
      try {
        // Ambil ID dari object deletingSk
        const skId = deletingSk.id || deletingSk
        await api.delete(`/sisfo/persuratan/sk/${skId}`)
        getSk({}, true) // Set showLoading=true untuk refresh setelah delete
        setShowDeleteModal(false)
        setDeletingSk(null)
      } catch (error) {
        console.error('Error deleting SK:', error)
        // Tampilkan error ke user jika perlu
        alert('Gagal menghapus data: ' + (error.response?.data?.message || error.message))
      } finally {
        setDeleteLoading(false)
      }
    }
    const handleCloseDeleteModal = () => {
      setShowDeleteModal(false)
      setDeletingSk(null)  // 🔧 GANTI: sesuaikan nama variable
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
        const deletePromises = bulkDeleteIds.map(id => api.delete(`/sisfo/persuratan/sk/${id}`))  // 🔧 GANTI: endpoint delete
        await Promise.all(deletePromises)
        
        getSk({}, true) // Set showLoading=true untuk refresh setelah bulk delete
        setShowBulkDeleteModal(false)
        setBulkDeleteIds([])
      } catch (error) {
        console.error('Error bulk deleting SK:', error)
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
    // Simpan data item ke sessionStorage dan redirect ke halaman detail
    if (item?.id) {
      sessionStorage.setItem('skDetailData', JSON.stringify(item))
      router.push(`/persuratan/sk/${item.id}`)
    }
  }
  const handleAdd = () => {
    setEditingSk(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
    setShowAddModal(true)
  }
  const handleEdit = (item) => {
    setEditingSk(item)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(true)
    setShowAddModal(true)
  }
  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setEditingSk(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
  }
  const handleAddSuccess = (newUser) => {  // 🔧 GANTI: sesuaikan pesan log
    // Refresh data after successful add
    getSk({}, true) // Set showLoading=true untuk refresh setelah add
    setShowAddModal(false)
    setEditingSk(null)  // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false)
  }
  // Export handler
  const handleExport = () => {
    setShowExportModal(true)
  }
  const handleProses =async (item) => {
    try {
      const response = await api.put(`/sisfo/persuratan/sk/${item.id}/proses`, {
        status: 'proses'
      })
      if (response.data.status === 'success') {
        getSk({}, true)
      }
    } catch (error) {
      console.error('Error proses SK:', error)
    }
  }
  const handleBatal = (item) => {
    // Set data yang akan dibatalkan dan buka modal
    setBatalingSk(item)
    setShowBatalModal(true)
  }

  const handleConfirmBatal = async (keterangan) => {
    if (!batalingSk) return

    setBatalLoading(true)
    try {
      const response = await api.put(`/sisfo/persuratan/sk/${batalingSk.id}/batal`, {
        status: 'dikembalikan',
        ket: keterangan
      })
      
      if (response.data.status === 'success') {
        getSk({}, true) // Refresh data setelah berhasil
        setShowBatalModal(false)
        setBatalingSk(null)
      }
    } catch (error) {
      console.error('Error batal SK:', error)
      alert('Gagal membatalkan data: ' + (error.response?.data?.message || error.message))
    } finally {
      setBatalLoading(false)
    }
  }

  const handleCloseBatalModal = () => {
    setShowBatalModal(false)
    setBatalingSk(null)
    setBatalLoading(false)
  }

  const handleCloseKetModal = () => {
    setShowKetModal(false)
    setKetSk(null)
  }
  const handleNomorSurat = async (item) => {
    // Set data yang akan diberi nomor surat
    setNomorSuratSk(item)
    setFetchingNomorSurat(true)
    setGeneratedNomorSurat('')
    
    try {
      // Ambil nomor surat yang di-generate dari API
      const response = await api.get(`/sisfo/persuratan/sk/nomor`)
      if (response.data.status === 'success' && response.data.data?.nomor_surat) {
        setGeneratedNomorSurat(response.data.data.nomor_surat)
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
    if (!nomorSuratSk) return

    setNomorSuratLoading(true)
    try {
      const response = await api.put(`/sisfo/persuratan/sk/${nomorSuratSk.id}/nomorSurat`, {
        ns: nomorSurat,
        status: 'valid'
      })
      
      if (response.data.status === 'success') {
        getSk({}, true) // Refresh data setelah berhasil
        setShowNomorSuratModal(false)
        setNomorSuratSk(null)
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
    setNomorSuratSk(null)
    setNomorSuratLoading(false)
    setGeneratedNomorSurat('')
    setFetchingNomorSurat(false)
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
        title="Data Surat Keputusan"                    // 🔧 OPSIONAL: judul tabel
        subtitle="Kelola data surat keputusan" // 🔧 OPSIONAL: subjudul tabel
        // Server-side props
        serverSide={true}                     // 🔧 OPSIONAL: true untuk server-side, false untuk client-side
        onDataChange={handleDataChange}       // 🔄 REUSABLE: handler untuk data change
        total={total}                         // 🔄 REUSABLE: total data dari server
        loading={loading}                     // 🔄 REUSABLE: loading state
        
      />
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title={isEditMode ? "Edit SK" : "Tambah SK Baru"}
        width="1000px"
        height="auto"
        maxHeight="90vh"
        position="top"
        backdropBlur="none"
        closeOnOverlayClick={true}
      >
        <TambahSk
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
          postSk={postSk}
          editingSk={editingSk}
          isEditMode={isEditMode}
        />
      </Modal>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus Surat Keputusan"
        message="Apakah Anda yakin ingin menghapus data ini?"
        loading={deleteLoading}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
        <DeleteModal
        isOpen={showBulkDeleteModal}
        onClose={handleCloseBulkDeleteModal}
        onConfirm={handleConfirmBulkDelete}
        title="Hapus Multiple Surat Keputusan"
        message={`Apakah Anda yakin ingin menghapus ${bulkDeleteIds.length} surat keputusan yang dipilih?`}
        itemName={`${bulkDeleteIds.length} surat keputusan akan dihapus`}
        loading={bulkDeleteLoading}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
      />
       <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={data}
        columns={columns}
        title="Export Data Surat Keputusan"
        filename="users_export"
      />
      <InfoKet
        isOpen={showBatalModal}
        onClose={handleCloseBatalModal}
        onConfirm={handleConfirmBatal}
        title="Kembalikan Surat Keputusan"
        message="Apakah Anda yakin ingin mengembalikan surat keputusan ini?"
        itemName={batalingSk ? `SK: ${batalingSk.ns || batalingSk.tentang || 'Tidak ada nomor'}` : ''}
        loading={batalLoading}
        confirmText="Ya, Batalkan"
        cancelText="Batal"
      />
      <NomorSuratModal
        isOpen={showNomorSuratModal}
        onClose={handleCloseNomorSuratModal}
        onConfirm={handleConfirmNomorSurat}
        title="Beri Nomor Surat"
        message="Masukkan nomor surat untuk surat keputusan ini"
        itemName={nomorSuratSk ? `SK: ${nomorSuratSk.tentang || 'Tidak ada judul'}` : ''}
        loading={nomorSuratLoading}
        confirmText="Ya, Beri Nomor Surat"
        cancelText="Batal"
        initialValue={generatedNomorSurat}
        fetching={fetchingNomorSurat}
      />
      {/* Modal Keterangan */}
      <Modal
        isOpen={showKetModal}
        onClose={handleCloseKetModal}
        title="Keterangan Pengembalian"
        width="600px"
        height="auto"
        position="center"
        backdropBlur="sm"
        closeOnOverlayClick={true}
        showCloseButton={true}
      >
        <div className="space-y-4">
          {ketSk && (
            <>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surat Keputusan:
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
                  {ketSk.ns || ketSk.tentang || 'Tidak ada nomor'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keterangan:
                </label>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {ketSk.ket || 'Tidak ada keterangan'}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCloseKetModal}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
