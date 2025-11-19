'use client'

import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function DownloadPdf({ sk, onPdfGenerated }) {
  const [pdfUrl, setPdfUrl] = useState(null)

  useEffect(() => {
    const checkPageBreak = (doc, yPosition, requiredSpace = 20) => {
        const pageHeight = doc.internal.pageSize.getHeight()
        
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage()
          return 20 // Reset ke top margin halaman baru
        }
        return yPosition
      }

    const generatePdf = () => {
      try {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 15
        let yPos = 15

        // Set default font size 11
        const defaultFontSize = 11



        // Helper untuk strip HTML
        const stripHtml = (html) => {
          if (!html) return ''
          const tmp = document.createElement('DIV')
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ''
        }

        const formatTanggal = (isoDate) => {
            if (!isoDate) return new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
            
            const date = new Date(isoDate)
            
            // Format: 14 November 2025
            return date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }

        // Helper untuk parse list dari HTML WYSIWYG
        const parseHtmlList = (html) => {
          if (!html) return []
          
          const tmp = document.createElement('DIV')
          tmp.innerHTML = html
          
          const items = []
          
          const olLists = tmp.querySelectorAll('ol')
          olLists.forEach((ol) => {
            const listItems = ol.querySelectorAll('li')
            listItems.forEach((li, index) => {
              items.push({
                bullet: `${index + 1}.`,
                text: li.textContent.trim()
              })
            })
          })
          
          const ulLists = tmp.querySelectorAll('ul')
          ulLists.forEach((ul) => {
            const listItems = ul.querySelectorAll('li')
            listItems.forEach((li, index) => {
              items.push({
                bullet: `${String.fromCharCode(97 + index)}.`,
                text: li.textContent.trim()
              })
            })
          })
          
          if (items.length === 0) {
            const paragraphs = tmp.querySelectorAll('p')
            paragraphs.forEach((p, index) => {
              const text = p.textContent.trim()
              if (text) {
                items.push({
                  bullet: `${String.fromCharCode(97 + index)}.`,
                  text: text
                })
              }
            })
          }
          
          if (items.length === 0) {
            const text = tmp.textContent.trim()
            const lines = text.split('\n').filter(line => line.trim())
            lines.forEach((line, index) => {
              items.push({
                bullet: `${String.fromCharCode(97 + index)}.`,
                text: line.trim()
              })
            })
          }
          
          return items
        }

        // ===== KOP SURAT =====
        // doc.setFontSize(14)
        // doc.setFont('helvetica', 'bold')
        // doc.text('YAYASAN PENDIDIKAN TELKOM', pageWidth / 2, yPos, { align: 'center' })
        // yPos += 6

        // doc.setFontSize(12)
        // doc.text('SMK TELKOM MAKASSAR', pageWidth / 2, yPos, { align: 'center' })
        // yPos += 5

        // doc.setFontSize(10)
        // doc.setFont('helvetica', 'normal')
        // doc.text('Jl. AP. Pettarani No. 5 Makassar 90222', pageWidth / 2, yPos, { align: 'center' })
        // yPos += 4

        // doc.setFontSize(9)
        // doc.text('Telp. (0411) 454555 | Email: smktelkom-mks@telkomschools.sch.id', pageWidth / 2, yPos, { align: 'center' })
        // yPos += 5

        // Garis pemisah
        doc.setLineWidth(0.5)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 0.5
        doc.setLineWidth(0.2)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 8

        // ===== JUDUL =====
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('SURAT KEPUTUSAN', pageWidth / 2, yPos, { align: 'center' })
        yPos += 6

        doc.setFontSize(defaultFontSize)
        doc.setFont('helvetica', 'normal')
        doc.text(`Nomor: ${sk.ns || '-'}`, pageWidth / 2, yPos, { align: 'center' })
        yPos += 7

        // TENTANG
        
        doc.setFont('helvetica', 'bold')
        doc.text('TENTANG', pageWidth / 2, yPos, { align: 'center' })
        yPos += 6

        const perihal = (sk.tentang || 'PERIHAL SURAT KEPUTUSAN').toUpperCase()
        const perihalLines = doc.splitTextToSize(perihal, pageWidth - 40)
        perihalLines.forEach(line => {
          doc.text(line, pageWidth / 2, yPos, { align: 'center' })
          yPos += 5
        })
        yPos += 3

        doc.text('KEPALA SMK TELKOM MAKASSAR', pageWidth / 2, yPos, { align: 'center' })
        yPos += 10

        // ===== TABEL MENIMBANG =====
        const menimbangItems = parseHtmlList(sk.menimbang)
        
        const menimbangRows = menimbangItems.map((item, index) => {
          if (index === 0) {
            return [{ content: 'Menimbang', styles: { fontStyle: 'bold' } }, ':', item.bullet, item.text]
          }
          return ['', '', item.bullet, item.text]
        })

        if (menimbangRows.length > 0) {
          autoTable(doc, {
            startY: yPos,
            body: menimbangRows,
            theme: 'plain',
            styles: { 
              fontSize: defaultFontSize, 
              cellPadding: 1,
              lineColor: [255, 255, 255],
              lineWidth: 0,
              font: 'helvetica'
            },
            columnStyles: {
              0: { cellWidth: 35, fontStyle: 'bold' },
              1: { cellWidth: 5 },
              2: { cellWidth: 10 },
              3: { cellWidth: pageWidth - 70 }
            },
            margin: { left: margin, right: margin }
          })
          yPos = doc.lastAutoTable.finalY + 4
        }

        // ===== TABEL MENGINGAT =====
        const mengingatItems = parseHtmlList(sk.mengingat)
        
        const mengingatRows = mengingatItems.map((item, index) => {
          const bullet = `${index + 1}.`
          if (index === 0) {
            return [{ content: 'Mengingat', styles: { fontStyle: 'bold' } }, ':', bullet, item.text]
          }
          return ['', '', bullet, item.text]
        })

        if (mengingatRows.length > 0) {
          autoTable(doc, {
            startY: yPos,
            body: mengingatRows,
            theme: 'plain',
            styles: { 
              fontSize: defaultFontSize, 
              cellPadding: 1,
              lineColor: [255, 255, 255],
              lineWidth: 0,
              font: 'helvetica'
            },
            columnStyles: {
              0: { cellWidth: 35, fontStyle: 'bold' },
              1: { cellWidth: 5 },
              2: { cellWidth: 10 },
              3: { cellWidth: pageWidth - 70 }
            },
            margin: { left: margin, right: margin }
          })
          yPos = doc.lastAutoTable.finalY + 4
        }

        // ===== TABEL MEMPERHATIKAN =====
        if (sk.memperhatikan) {
          const memperhatikanText = stripHtml(sk.memperhatikan)
          
          autoTable(doc, {
            startY: yPos,
            body: [
              [{ content: 'Memperhatikan', styles: { fontStyle: 'bold' } }, ':', memperhatikanText]
            ],
            theme: 'plain',
            styles: { 
              fontSize: defaultFontSize, 
              cellPadding: 1,
              lineColor: [255, 255, 255],
              lineWidth: 0,
              font: 'helvetica'
            },
            columnStyles: {
              0: { cellWidth: 35, fontStyle: 'bold' },
              1: { cellWidth: 5 },
              2: { cellWidth: pageWidth - 60 }
            },
            margin: { left: margin, right: margin }
          })
          yPos = doc.lastAutoTable.finalY + 6
        }

        // ===== MEMUTUSKAN =====
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(defaultFontSize)
        doc.text('MEMUTUSKAN:', pageWidth / 2, yPos, { align: 'center' })
        yPos += 7

        // ===== TABEL MENETAPKAN =====
        const menetapkan = sk.menetapkan
          ? stripHtml(sk.menetapkan) 
          : 'Mengangkat dan menunjuk nama-nama yang tercantum dalam lampiran keputusan ini untuk melaksanakan tugas sesuai dengan ketentuan yang berlaku.'

        autoTable(doc, {
          startY: yPos,
          body: [
            [{ content: 'Menetapkan', styles: { fontStyle: 'normal' } }, ':', menetapkan]
          ],
          theme: 'plain',
          styles: { 
            fontSize: defaultFontSize, 
            cellPadding: 1,
            lineColor: [255, 255, 255],
            lineWidth: 0,
            font: 'helvetica'
          },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 5 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = doc.lastAutoTable.finalY + 4

        // ===== TABEL ISI KEPUTUSAN (SEJAJAR DENGAN MENETAPKAN) =====
        const kesatu = sk.satu
          ? stripHtml(sk.satu) 
          : 'Mengangkat dan menunjuk nama-nama yang tercantum dalam lampiran keputusan ini untuk melaksanakan tugas sesuai dengan ketentuan yang berlaku.'

        const kedua = sk.dua
          ? stripHtml(sk.dua) 
          : 'Segala biaya yang timbul sebagai akibat ditetapkannya Surat Keputusan ini dibebankan kepada anggaran yang sesuai.'

        const ketiga = sk.tiga
          ? stripHtml(sk.tiga) 
          : 'Keputusan ini berlaku sejak tanggal ditetapkan dengan ketentuan apabila di kemudian hari terdapat kekeliruan dalam penetapan ini akan diadakan perbaikan sebagaimana mestinya.'

        autoTable(doc, {
          startY: yPos,
          body: [
            [{ content: 'Kesatu', styles: { fontStyle: 'bold' } }, ':', kesatu],
            [{ content: 'Kedua', styles: { fontStyle: 'bold' } }, ':', 'Segala biaya yang timbul sebagai akibat ditetapkannya Surat Keputusan ini dibebankan kepada anggaran yang sesuai.'],
            [{ content: 'Ketiga', styles: { fontStyle: 'bold' } }, ':', 'Keputusan ini berlaku sejak tanggal ditetapkan dengan ketentuan apabila di kemudian hari terdapat kekeliruan dalam penetapan ini akan diadakan perbaikan sebagaimana mestinya.']
          ],
          theme: 'plain',
          styles: { 
            fontSize: defaultFontSize, 
            cellPadding: 1,
            lineColor: [255, 255, 255],
            lineWidth: 0,
            font: 'helvetica'
          },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold' }, // KESATU/KEDUA/KETIGA - sejajar dengan Menetapkan
            1: { cellWidth: 5 }, // Colon
            2: { cellWidth: pageWidth - 60 } // Content
          },
          margin: { left: margin, right: margin }
        })

        yPos = doc.lastAutoTable.finalY + 10

        // ===== TTD =====
        yPos = checkPageBreak(doc, yPos)
        const ttdX = pageWidth - 75
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(`Ditetapkan di  : ${sk.lokasi || 'Makassar'}`, ttdX, yPos)
        yPos += 5
        doc.text(`Pada tanggal   : ${formatTanggal(sk.tgl)}`, ttdX, yPos)
        yPos += 6
        doc.text('Kepala SMK Telkom Makassar,', ttdX, yPos)
        yPos += 18

        doc.setFont('helvetica', 'bold')
        doc.text('Nama Kepala Sekolah', ttdX, yPos)
        yPos += 5
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('NIP. 123456789', ttdX, yPos)
        yPos += 10

        // ===== TEMBUSAN =====
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Tembusan:', margin, yPos)
        yPos += 5

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(sk.tembusan || '', margin, yPos)
        yPos += 4
        // doc.text('2. Arsip', margin, yPos)

        // Generate blob dan URL
        const pdfBlob = doc.output('blob')
        const url = URL.createObjectURL(pdfBlob)
        
        setPdfUrl(url)
        if (onPdfGenerated) {
          onPdfGenerated(url, pdfBlob)
        }
      } catch (error) {
        console.error('Error generating PDF:', error)
      }
    }

    if (sk) {
      generatePdf()
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [sk])

  return null
}