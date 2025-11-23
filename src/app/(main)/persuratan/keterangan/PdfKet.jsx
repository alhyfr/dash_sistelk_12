'use client'
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Eye } from "lucide-react"
import Image from 'next/image'
import LogoSurat from '@/assets/surat/kiri.png'
import Stylekop from '@/assets/surat/kanan.png'

export default function PdfKet({ item, kepsek, ta }) {
    const handlePdf = async () => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 15
        let yPos = 15

        // Helper untuk format tanggal
        const formatTanggal = (isoDate) => {
            if (!isoDate) return new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })

            const date = new Date(isoDate)
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }

        // Helper untuk load gambar sebagai base64
        const getImageBase64 = (imageSrc) => {
            return new Promise((resolve, reject) => {
                const img = new window.Image()
                img.crossOrigin = 'Anonymous'
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0)
                    resolve(canvas.toDataURL('image/png'))
                }
                img.onerror = reject
                img.src = imageSrc.src
            })
        }

        // ===== KOP SURAT DENGAN GAMBAR =====
        try {
            // Load kedua gambar
            const logoBase64 = await getImageBase64(LogoSurat)
            const styleKopBase64 = await getImageBase64(Stylekop)

            // Ukuran gambar (sesuaikan dengan kebutuhan)
            const logoWidth = 40
            const logoHeight = 10
            const styleKopWidth = 100
            const styleKopHeight = 30

            // Posisi logo kiri - margin 0 agar menyatu dengan kertas
            const logoX = 10
            const logoY = 10

            // Posisi style kop kanan - margin 0 agar menyatu dengan kertas
            const styleKopX = pageWidth - styleKopWidth
            const styleKopY = 0

            // Tambahkan gambar ke PDF
            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)
            doc.addImage(styleKopBase64, 'PNG', styleKopX, styleKopY, styleKopWidth, styleKopHeight)

            // Update yPos setelah gambar - nilai negatif agar judul naik lebih ke atas
            yPos += Math.max(logoHeight, styleKopHeight) - 3

        } catch (error) {
            console.error('Error loading images:', error)
            // Fallback ke text jika gambar gagal dimuat
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text('YAYASAN PENDIDIKAN TELKOM', pageWidth / 2, yPos, { align: 'center' })
            yPos += 6

            doc.setFontSize(12)
            doc.text('SMK TELKOM MAKASSAR', pageWidth / 2, yPos, { align: 'center' })
            yPos += 5
        }



        // ===== JUDUL SURAT =====
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('SURAT KETERANGAN', pageWidth / 2, yPos, { align: 'center' })
        yPos += 6

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Nomor: ${item.ns || '-'}`, pageWidth / 2, yPos, { align: 'center' })
        yPos += 10

        // ===== ISI SURAT =====
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')

        // Paragraf pembuka
        const pembukaText = 'Yang bertanda tangan di bawah ini, Kepala SMK Telkom Makassar Kecamatan Rappocini Kota Makassar, Provinsi Sulawesi Selatan, menerangkan bahwa::'
        const pembukaLines = doc.splitTextToSize(pembukaText, pageWidth - (margin * 2))
        pembukaLines.forEach(line => {
            doc.text(line, margin, yPos)
            yPos += 5
        })
        yPos += 3

        // ===== DATA SISWA =====
        autoTable(doc, {
            startY: yPos,
            body: [
                ['Nama', ':', item.nama || '-'],
                ['NIS', ':', item.nis || '-'],
                ['NPSN', ':', item.npsn || '-'],
                ['Program Studi', ':', item.prodi || '-'],
            ],
            theme: 'plain',
            styles: {
                fontSize: 11,
                cellPadding: 2,
                lineColor: [255, 255, 255],
                lineWidth: 0,
                font: 'helvetica'
            },
            columnStyles: {
                0: { cellWidth: 35, fontStyle: 'normal' },
                1: { cellWidth: 5 },
                2: { cellWidth: pageWidth - 65, fontStyle: 'normal' }
            },
            margin: { left: margin + 10, right: margin }
        })

        yPos = doc.lastAutoTable.finalY + 8

        // Paragraf penutup
        const penutupText = `Benar bahwa yang bersangkutan adalah siswa SMK Telkom Makassar, saat ini masih aktif menempuh pendidikan di  kelas ${item.kelas || '-'} pada tahun pelajaran ${item.tahun || '-'}.`
        const penutupLines = doc.splitTextToSize(penutupText, pageWidth - (margin * 2))
        penutupLines.forEach(line => {
            doc.text(line, margin, yPos)
            yPos += 5
        })
        yPos += 5

        // Keterangan tambahan
        doc.setFontSize(10)
        doc.text('Demikian surat keterangan ini diberikan kepada yang bersangkutan untuk dipergunakan sebagaimana mestinya.', margin, yPos)
        yPos += 15

        // ===== TANDA TANGAN =====
        const ttdX = pageWidth - 75
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text('Makassar, ' + formatTanggal(item.tgl), ttdX, yPos)
        yPos += 5
        doc.text('Kepala SMK Telkom Makassar,', ttdX, yPos)
        yPos += 20

        doc.setFont('helvetica', 'bold')
        doc.text(kepsek?.nama || '-', ttdX, yPos)
        yPos += 5
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('NIP. ' + (kepsek?.nip || '-'), ttdX, yPos)

        // Simpan PDF
        doc.save(`surat-keterangan - ${item.nis || 'siswa'}.pdf`)
    }

    return (
        <div>
            <Eye
                onClick={handlePdf}
                className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-900"
                title="Lihat PDF"
            />
        </div>
    )
}