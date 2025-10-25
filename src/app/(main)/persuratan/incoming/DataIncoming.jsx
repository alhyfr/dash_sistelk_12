"use client";
import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import DeleteModal from "@/components/Delete";
import ExportModal from "@/components/ExportModal";
import TambahIncoming from "./TambahIncoming";
import ViewIncoming from "./ViewIncoming";
import Disposisi from "./Disposisi";
import {
  FolderArchive,
  Trash2,
  MailOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import api from "@/utils/api";
import dayjs from "dayjs";

// Configure PDF.js worker

export default function DataIncoming() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [disposisiSurat, setDisposisiSurat] = useState(null);
  const [isDisposisiMode, setIsDisposisiMode] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal konfirmasi hapus
  const [deletingIncoming, setDeletingIncoming] = useState(null); // Data yang akan dihapus
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState([]);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);

  // PDF viewer modal state
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const columns = [
    {
      key: "created_at", // 🔧 GANTI: field dari API response
      title: "Tanggal Masuk", // 🔧 GANTI: judul kolom// 🔧 OPSIONAL: tipe kolom untuk format tanggal
      sortable: true,
      render: (item) => {
        return dayjs(item.created_at).format("DD-MM-YYYY");
      },
    },
    {
      key: "kode", // 🔧 GANTI: field dari API response
      title: "NO AGENDA", // 🔧 GANTI: judul kolom
      searchable: true, // 🔧 OPSIONAL: apakah bisa di-search
      sortable: true, // 🔧 OPSIONAL: apakah bisa di-sort
    },
    {
      key: "nosurat", // 🔧 GANTI: field dari API response
      title: "No Surat", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
    },
    {
      key: "tgl_terima", // 🔧 GANTI: field dari API response
      title: "Tanggal Konfirmasi", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      render: (item) => {
        return dayjs(item).format("DD-MM-YYYY");
      },
    },
    {
      key: "asal_instansi", // 🔧 GANTI: field dari API response
      title: "Asal Instansi", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      
    },
    {
      key: "perihal", // 🔧 GANTI: field dari API response
      title: "Perihal", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      wrap: true, // 🔧 OPSIONAL: enable text wrapping untuk kolom ini
      minWidth: "300px", // 🔧 OPSIONAL: atur lebar minimal kolom (bisa px, %, em, dll)
      
    },
    {
      key: "tgl_pelaksanaan", // 🔧 GANTI: field dari API response
      title: "Tanggal Pelaksanaan", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      type: "date",
      filterable: true,
    },
    {
      key: "file", // 🔧 GANTI: field dari API response
      title: "File",
      sortable: false,
      render: (item) => {
        return (
          <div>
            <ViewIncoming item={item} />
          </div>
        );
      },
    },
    {
      key: "status_terima", // 🔧 GANTI: field dari API response
      title: "KS", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      filterOptions: [
        // 🔧 GANTI: opsi filter sesuai data
        { value: "", label: "belum di respon" },
        { value: "diterima", label: "di terima" },
        { value: "ditolak", label: "di tolak" },
      ],
       render: (item) => {
         // Null check untuk mencegah error
         if (!item) {
           return (
             <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
               menunggu
             </span>
           );
         }

          const text = item === "diterima" ? "Diterima" : 
                      item === "ditolak" ? "Ditolak" : 
                      item === null ? "Pending" : "Pending";

          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status_terima === "diterima"
                  ? "bg-green-100 text-green-800"
                  : item.status_terima === "ditolak"
                  ? "bg-red-100 text-red-800"
                  : item.status_terima === null
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {text}
            </span>
          );
       },
    },
    {
      key: "status", // 🔧 GANTI: field dari API response
      title: "Status", // 🔧 GANTI: judul kolom
      searchable: true,
      sortable: true,
      render: (value, item) => {
        return(
          <div>
            <button
            onClick={() => handleStatus(item)}
            className="px-3 py-1 cursor-pointer rounded-full text-sm font-medium bg-green-100 text-green-800">
              {value}
            </button>
          </div>
        )
      },
    },
    {
      key: "disposisi", // 🔧 GANTI: field dari API response
      title: "Disposisi", // 🔧 GANTI: judul kolom// 🔧 OPSIONAL: tipe kolom untuk format tanggal
      sortable: true,
      render: (item) => {
        return(
          <div>{item}</div>
        )
      },
    },
    {
      key: "actions", // 🔧 GANTI: kolom untuk actions
      title: "Aksi", // 🔧 GANTI: judul kolom
      type: "actions", // 🔧 OPSIONAL: tipe kolom untuk actions
      sortable: false, // 🔧 OPSIONAL: actions tidak bisa di-sort
      actions: [
        // 🔧 GANTI: array actions
        {
          icon: (item) => {
            // Dynamic icon berdasarkan status_terima
            if (!item.status_terima || item.status_terima === "") {
              return () => <AlertCircle className="w-4 h-4" />;
            } else if (item.status_terima === "ditolak") {
              return () => <XCircle className="w-4 h-4" />;
            } else if (item.status_terima === "diterima") {
              return () => <CheckCircle className="w-4 h-4" />;
            }
            return () => <AlertCircle className="w-4 h-4" />;
          },
          title: (item) => {
            if (!item.status_terima || item.status_terima === "") {
              return "Klik untuk menerima";
            } else if (item.status_terima === "diterima") {
              return "Klik untuk menolak";
            } else if (item.status_terima === "ditolak") {
              return "Klik untuk menerima";
            }
            return "Klik untuk mengubah status";
          },
          className: (item) => {
            if (!item.status_terima || item.status_terima === "") {
              return "text-yellow-600 hover:text-yellow-900";
            } else if (item.status_terima === "ditolak") {
              return "text-red-600 hover:text-red-900";
            } else if (item.status_terima === "diterima") {
              return "text-green-600 hover:text-green-900";
            }
            return "text-gray-600 hover:text-gray-900";
          },
          onClick: (item) => handleStatusTerima(item),
        },
        {
          icon: MailOpen,
          title: "disposisi",
          className: "text-purple-600 hover:text-green-900",
          onClick: (item) => handleDisposisi(item),
          show: (item) => item.status_terima !== "diterima", 
        },
          {
            icon: Trash2,
            title: "Hapus",
            className: "text-red-600 hover:text-red-900",
            onClick: (item) => handleDelete(item),
            show: (item) => item.status_terima !== "diterima", // Sembunyikan jika diterima
          },
          {
            icon: FolderArchive,
            title: "Arsip",
            className: "text-blue-600 hover:text-blue-900",
            onClick: (item) => handleArsip(item),
            show: (item) => item.status_terima === "diterima", // Tampilkan hanya jika diterima
          },
      ],
    },
  ];
  const getIncoming = async (params = {}, showLoading = true) => {
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

      console.log("Fetching users with params:", queryParams.toString());

      // Wait for both API call and minimum loading time
      const [response] = await Promise.all([
        api.get(`/sisfo/incoming?${queryParams}`), // 🔧 GANTI: endpoint API Anda (contoh: /sisfo/products, /sisfo/categories)
        minLoadingTime,
      ]);

      if (response.data.status === "success") {
        setData(response.data.data); // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.products)
        setTotal(response.data.total); // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.total_count)
        setCurrentPage(response.data.page); // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.current_page)
        setItemsPerPage(response.data.per_page); // 🔧 GANTI: sesuaikan dengan response API (contoh: response.data.per_page)
        console.log("data:" + response.data.data);
      }
    } catch (error) {
      console.error("Error fetching incoming:", error);
      setData([]);
      setTotal(0);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const postIncoming = async (form) => {};
  const handleDataChange = (params) => {
    setSearchTerm(params.search || "");
    setFilters(params.filters || {});
    getIncoming(params, true);
  };

  useEffect(() => {
    getIncoming();
  }, []);

  const handleDelete = (item) => {
    setDeletingIncoming(item.id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingIncoming) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/sisfo/incoming/${deletingIncoming}`);
      getIncoming();
      setShowDeleteModal(false);
      setDeletingIncoming(null);
    } catch (error) {
      console.error("Error deleting incoming:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingIncoming(null); // 🔧 GANTI: sesuaikan nama variable
    setDeleteLoading(false);
  };
  // Bulk delete handlers
  const handleBulkDelete = (selectedIds) => {
    setBulkDeleteIds(selectedIds);
    setShowBulkDeleteModal(true);
  };

  const handleConfirmBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return;

    setBulkDeleteLoading(true);
    try {
      // Delete multiple users
      const deletePromises = bulkDeleteIds.map((id) =>
        api.delete(`/sisfo/incoming/${id}`)
      ); // 🔧 GANTI: endpoint delete
      await Promise.all(deletePromises);

      // Refresh data after delete
      getIncoming(); // 🔧 GANTI: sesuaikan nama function
      setShowBulkDeleteModal(false);
      setBulkDeleteIds([]);
    } catch (error) {
      console.error("Error bulk deleting incoming:", error); // 🔧 GANTI: sesuaikan pesan error
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
    setBulkDeleteIds([]);
    setBulkDeleteLoading(false);
  };

  // CRUD handlers
  const handleStatus = async (item) => {
    try {
     const response = await api.put(`/sisfo/incoming/${item.id}/status-proses`, {
      status: "diterima"
     });
     if (response.data.status === "success") {
      getIncoming();
     }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStatusTerima = async (item) => {
    try {
      // Null check untuk mencegah error
      if (!item) {
        console.error("Item is null, cannot update status");
        return;
      }

      // Tentukan parameter berdasarkan status saat ini
      let newStatus = "";
      if (
        !item.status_terima ||
        item.status_terima === "" ||
        item.status_terima === "ditolak"
      ) {
        newStatus = "diterima"; // Jika kosong atau ditolak, maka diterima
      } else if (item.status_terima === "diterima") {
        newStatus = "ditolak"; // Jika diterima, maka ditolak
      }

      console.log(
        `Mengubah status dari "${item.status_terima}" ke "${newStatus}"`
      );

      const response = await api.put(`/sisfo/incoming/${item.id}/status`, {
        status_terima: newStatus,
      });

      if (response.data.status === "success") {
        getIncoming();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAdd = () => {
    setEditingIncoming(null); // 🔧 GANTI: sesuaikan nama variable
    setIsEditMode(false);
    setShowAddModal(true);
  };
  const handleDisposisi = (item) => {
    setDisposisiSurat(item); // 🔧 GANTI: sesuaikan nama variable
    setIsDisposisiMode(true);
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setDisposisiSurat(null); // 🔧 GANTI: sesuaikan nama variable
    setIsDisposisiMode(false);
  };
  
  const handleDisposisiSuccess = (disposisiData) => {
    console.log("Disposisi saved successfully:", disposisiData);
    // Refresh data after successful disposisi
    getIncoming();
    setShowAddModal(false);
    setDisposisiSurat(null);
    setIsDisposisiMode(false);
  };
  
  const handleArsip = async (item) => {
    try {
      console.log("Mengarsipkan surat:", item);
      console.log("ID:", item.id);
      console.log("Status saat ini:", item.status);
      
      // Implementasi API call untuk arsip surat
      const response = await api.put(`/sisfo/incoming/${item.id}/status`, {
        status: 'arsip'
      });
      
      if (response.data.status === "success") {
        console.log("Surat berhasil diarsipkan");
        // Refresh data setelah arsip
        getIncoming();
      }
      
    } catch (error) {
      console.error('Error archiving surat:', error);
    }
  };
  
  const handleAddSuccess = (newIncoming) => {
    console.log("User added successfully:", newIncoming); // 🔧 GANTI: sesuaikan pesan log
    // Refresh data after successful add
    getIncoming(); // 🔧 GANTI: sesuaikan nama function
    setShowAddModal(false);
    setDisposisiSurat(null); // 🔧 GANTI: sesuaikan nama variable
    setIsDisposisiMode(false);
  };

  // Export handler
  const handleExport = () => {
    setShowExportModal(true);
  };
  

  return (
    <>
      {/* ========================================
        🔄 REUSABLE - DataTable component (SAMA untuk semua halaman)
        DataTable ini bisa digunakan untuk halaman data table apapun
        ======================================== */}
      <DataTable
        data={data} // Data yang ditampilkan
        columns={columns} // Konfigurasi kolom (HARUS disesuaikan)
        onAdd={handleAdd} // Handler tambah data
        onExport={handleExport} // Handler export data
        onBulkDelete={handleBulkDelete} // Handler bulk delete
        searchable={true} // 🔧 OPSIONAL: enable/disable search
        filterable={true} // 🔧 OPSIONAL: enable/disable filter
        sortable={true} // 🔧 OPSIONAL: enable/disable sort
        selectable={true} // 🔧 OPSIONAL: enable/disable selection
        pagination={true} // 🔧 OPSIONAL: enable/disable pagination
        itemsPerPageOptions={[5, 10, 25, 50]} // 🔧 OPSIONAL: opsi items per page
        defaultItemsPerPage={10} // 🔧 OPSIONAL: default items per page
        hideAddButton={true} // 🔧 OPSIONAL: sembunyikan tombol tambah data
        // Title props
        title="Surat Masuk" // 🔧 OPSIONAL: judul tabel
        subtitle="Kelola surat masuk dan disposisi" // 🔧 OPSIONAL: subjudul tabel
        // Server-side props
        serverSide={true} // 🔧 OPSIONAL: true untuk server-side, false untuk client-side
        onDataChange={handleDataChange} // 🔄 REUSABLE: handler untuk data change
        total={total} // 🔄 REUSABLE: total data dari server
        loading={loading} // 🔄 REUSABLE: loading state
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
        title={isDisposisiMode ? "Disposisi" : "Tambah User Baru"}
        width="800px"
        height="auto"
        maxHeight="90vh"
        position="top"
        backdropBlur="none"
        closeOnOverlayClick={true}
      >
         <Disposisi 
           disposisiSurat={disposisiSurat} 
           isDisposisiMode={isDisposisiMode}
           onClose={handleCloseAddModal}
           onSuccess={handleDisposisiSuccess}
         />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus Surat Masuk"
        message="Apakah Anda yakin ingin menghapus data ini?"
        loading={deleteLoading}
        confirmText="Ya, Hapus Surat Masuk"
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
  );
}
