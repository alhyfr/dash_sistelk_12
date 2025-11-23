'use client'
import { useState, useEffect } from 'react'
import Input from '@/components/Input'
import InputFilter from '@/components/InputFilter'
import DatePicker from '@/components/DatePicker'
import Select from '@/components/Select'
import Button from '@/components/Button'
import validate from 'validate.js'
import { keteranganConstraints } from '@/utils/constraints'
import { useData } from '@/context/DataContext'

export default function TambahKeterangan({ onClose, onSuccess, postSket, editingSket, isEditMode }) {
    const { siswaFilter, getSiswaFilter } = useData()
    const [formData, setFormData] = useState({
        siswa_id: '',
        tmp_lahir: '',
        tgl_lahir: '',
        nisn: '',
        npsn: '',
        jk: '',
        agama: '',
        kelas: '',
        ns: '',
        tgl: '',
        status: 'pending'
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = validate(formData, keteranganConstraints)
        setErrors(newErrors || {})
        return !newErrors
    }
    useEffect(() => {
        if (isEditMode && editingSket) {
            setFormData({
                siswa_id: editingSket.siswa_id || '',
                tmp_lahir: editingSket.tmp_lahir || '',
                tgl_lahir: editingSket.tgl_lahir || '',
                nisn: editingSket.nisn || '',
                npsn: editingSket.npsn || '',
                jk: editingSket.jk || '',
                agama: editingSket.agama || '',
                kelas: editingSket.kelas || '',
                ns: editingSket.ns || '',
                tgl: editingSket.tgl || '',
                status: editingSket.status || 'pending'
            })
        }
    }, [isEditMode, editingSket])
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setErrors({})


        try {
            const submitData = {
                siswa_id: formData.siswa_id,
                tmp_lahir: formData.tmp_lahir,
                tgl_lahir: formData.tgl_lahir,
                nisn: formData.nisn,
                npsn: formData.npsn,
                jk: formData.jk,
                agama: formData.agama,
                kelas: formData.kelas,
                ns: formData.ns,
                tgl: formData.tgl,
                status: formData.status
            }

            if (postSket) await postSket(submitData)

            // Reset form
            setFormData({
                siswa_id: '', tmp_lahir: '', tgl_lahir: '', nisn: '', npsn: '', jk: '', agama: '', kelas: '', ns: '', tgl: '', status: 'pending'
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
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <InputFilter
                            label="Siswa"
                            name="siswa_id"
                            value={formData.siswa_id}
                            onChange={handleInputChange}
                            error={errors.siswa_id ? errors.siswa_id[0] : null}
                            options={siswaFilter}
                            onSearch={getSiswaFilter}
                            placeholder="Cari nama siswa..."
                            labelKey="nama"
                            valueKey="id"
                            subLabelKey={(item) => (
                                <>
                                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] mr-2 font-medium">{item.nisn}</span>
                                    {item.kelas}
                                </>
                            )}
                        />
                    </div>

                    <Input
                        label="NISN"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleInputChange}
                        error={errors.nisn ? errors.nisn[0] : null}
                    />
                    <Input
                        label="NPSN"
                        name="npsn"
                        value={formData.npsn}
                        onChange={handleInputChange}
                        error={errors.npsn ? errors.npsn[0] : null}
                    />

                    <Select
                        label="Agama"
                        name="agama"
                        value={formData.agama}
                        onChange={handleInputChange}
                        error={errors.agama ? errors.agama[0] : null}
                        options={[
                            { value: 'Islam', label: 'Islam' },
                            { value: 'Kristen', label: 'Kristen' },
                            { value: 'Hindu', label: 'Hindu' },
                            { value: 'Buddha', label: 'Buddha' },
                            { value: 'Konghucu', label: 'Konghucu' }
                        ]}
                    />

                    <Input
                        label="Tempat Lahir"
                        name="tmp_lahir"
                        value={formData.tmp_lahir}
                        onChange={handleInputChange}
                        error={errors.tmp_lahir ? errors.tmp_lahir[0] : null}
                    />

                    <DatePicker
                        label="Tanggal Lahir"
                        name="tgl_lahir"
                        value={formData.tgl_lahir}
                        onChange={handleInputChange}
                        error={errors.tgl_lahir ? errors.tgl_lahir[0] : null}
                    />

                    <Select
                        label="Jenis Kelamin"
                        name="jk"
                        value={formData.jk}
                        onChange={handleInputChange}
                        error={errors.jk ? errors.jk[0] : null}
                        options={[
                            { value: 'L', label: 'Laki-laki' },
                            { value: 'P', label: 'Perempuan' }
                        ]}
                    />
                    <Input
                        label="Kelas"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleInputChange}
                        error={errors.kelas ? errors.kelas[0] : null}
                    />
                    <DatePicker
                        label="Tanggal Surat"
                        name="tgl"
                        value={formData.tgl}
                        onChange={handleInputChange}
                        error={errors.tgl ? errors.tgl[0] : null}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </div>
    )
}