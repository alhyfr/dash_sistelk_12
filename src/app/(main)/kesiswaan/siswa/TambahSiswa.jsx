'use client'
import { useState, useEffect } from 'react'
import { User, Mail, Lock, Shield, Save, X } from 'lucide-react'
import Input from '@/components/Input'
import Select from '@/components/Select'
import ApiSelect from '@/components/ApiSelect'
import api from '@/utils/api'
import { useData } from '@/context/DataContext'
import { siswaConstraint } from '@/utils/constraints'
import validate from 'validate.js'
export default function TambahSiswa({
    onClose,
    onSuccess,
    postSiswa,
    editingSiswa,
    isEditMode,
}) {
    const { prodis, getProdis } = useData()
    const [formData, setFormData] = useState({
        nis: "",
        nama: "",
        prodi_id: "",
        angkatan: "",
        status: ""
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        getProdis()
    }, [])

    useEffect(() => {
        if (isEditMode && editingSiswa) {
            setFormData({
                nis: editingSiswa.nis || '',
                nama: editingSiswa.nama || '',
                prodi_id: editingSiswa.prodi_id || '',
                angkatan: editingSiswa.angkatan || '',
                status: editingSiswa.status || 'Aktif'
            })
        }
    }, [isEditMode, editingSiswa])

    const statusOptions = [
        { value: 'aktif', label: 'Aktif' },
        { value: 'keluar', label: 'Keluar' },
        { value: 'selesai', label: 'Selesai' }
    ]
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }
    const validateForm = () => {
        const newErrors = validate(formData, siswaConstraint)
        setErrors(newErrors || {})
        return !newErrors
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const submitData = {
                nis: formData.nis,
                nama: formData.nama,
                prodi_id: formData.prodi_id,
                angkatan: formData.angkatan,
                status: formData.status
            }

            if (postSiswa) await postSiswa(submitData)

            // Reset form
            setFormData({
                nis: '', nama: '', prodi_id: '', angkatan: '', status: ''
            })

            if (onSuccess) onSuccess(submitData)
            if (onClose) onClose()

        } catch (error) {
            console.error('Error saving user:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat menyimpan data'
            setErrors({ general: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="NIS"
                    name="nis"
                    value={formData.nis}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIS"
                    error={errors.nis}
                    icon={User}
                />
                <Input
                    label="Angkatan"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    placeholder="Masukkan Angkatan"
                    error={errors.angkatan}
                    icon={Shield}
                    type="number"
                />
                <div className="md:col-span-2">
                    <Input
                        label="Nama Lengkap"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan Nama Lengkap"
                        error={errors.nama}
                        icon={User}
                    />
                </div>
                <Select
                    label="Program Studi"
                    name="prodi_id"
                    value={formData.prodi_id}
                    onChange={handleInputChange}
                    options={prodis.map(p => ({ value: p.id, label: p.prodi }))}
                    error={errors.prodi_id}
                    placeholder="Pilih Program Studi"
                />
                <Select
                    label="Status Siswa"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    options={statusOptions}
                    error={errors.status}
                    placeholder="Pilih Status"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
            </div>
        </form>
    )
}