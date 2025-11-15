"use client";
import { useState, useMemo, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import Modal from "@/components/Modal";
import { toPdfUrl, getFileType, getViewerUrl } from "@/helpers/pdf";

export default function ViewLampiran({ item }) {
  const [open, setOpen] = useState(false);

  const fileUrl = useMemo(() => toPdfUrl(item), [item]);
  const fileType = useMemo(() => getFileType(fileUrl), [fileUrl]);
  const viewerUrl = useMemo(() => getViewerUrl(fileUrl), [fileUrl]);

  // ✅ Tentukan title modal berdasarkan tipe file
  const modalTitle = useMemo(() => {
    if (fileType === 'pdf') return 'Lihat PDF'
    if (fileType === 'doc' || fileType === 'docx') return 'Lihat Dokumen Word'
    return 'Lihat Dokumen'
  }, [fileType])

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (open) {
      const prevHtml = html.style.overflow;
      const prevBody = body.style.overflow;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      return () => {
        html.style.overflow = prevHtml;
        body.style.overflow = prevBody;
      };
    }
    console.log(fileUrl);
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900"
        title={modalTitle}
      >
        <Eye className="w-4 h-4" />
      </button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={modalTitle}
        width="95vw"
        height="90vh"
        maxWidth="1400px"
        maxHeight="90vh"
        position="center"
        backdropBlur="sm"
        closeOnOverlayClick={false}
        showCloseButton={true}
      >
        <div className="h-[85vh]">
          {fileUrl ? (
            fileType === 'doc' || fileType === 'docx' ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-600 text-lg">Dokumen Word tidak dapat ditampilkan di browser</p>
                <a
                  href={fileUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Dokumen</span>
                </a>
              </div>
            ) : (
              <iframe 
                src={viewerUrl} 
                className="w-full h-full border-0" 
                title={modalTitle}
                allow="fullscreen"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Tidak ada URL dokumen</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
