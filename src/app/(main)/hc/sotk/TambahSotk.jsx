"use client";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Save, X } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import Select from "@/components/Select";
import ApiSelect from "@/components/ApiSelect";
import api from "@/utils/api";
import constraints from "@/utils/constraints";
import validate from "validate.js";

export default function TambahSotk({
  onClose = null,
  onSuccess = null,
  postSotk = null,
  editingSotk = null,
  isEditMode = false,
}) {
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    jabatan: "",
    unit: "", // Will be set after roles are loaded
    foto: "",
    kodejab: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const jabatanOptions = [
    { value: "Kepala Sekolah", label: "Kepala Sekolah" },
    { value: "Wakil Kepala Sekolah bidang kurikulum", label: "Wakil Kepala Sekolah bidang kurikulum" },
    { value: "Wakil Kepala Sekolah bidang hubinkom", label: "Wakil Kepala Sekolah bidang hubinkom" },
    { value: "Wakil Kepala Sekolah bidang sarpra", label: "Wakil Kepala Sekolah bidang sarpra" },
    { value: "Wakil Kepala Sekolah bidang kesiswaan", label: "Wakil Kepala Sekolah bidang kesiswaan" },
    { value: "Kepala Program Studi", label: "Kepala Program Studi" },
    { value: "Kepala Administrasi", label: "Kepala Administrasi" },
    { value: "Kepala Urusan keuangan", label: "Kepala Urusan keuangan" },
    { value: "Kepala Urusan hubinkom", label: "Kepala Urusan hubinkom" },
    { value: "Kepala Urusan sarpra", label: "Kepala Urusan sarpra" },
    { value: "Kepala Urusan Laboratorium", label: "Kepala Urusan Laboratorium" },
    { value: "Kepala Urusan kursilmat", label: "Kepala Urusan kursilmat" },
    { value: "Kepala Urusan pembelajaran", label: "Kepala Urusan pembelajaran" },
    { value: "Kepala Urusan Logistik", label: "Kepala Urusan Logistik" },
    { value: "Kepala Urusan Ekstrakurikuler", label: "Kepala Urusan Ekstrakurikuler" },
    { value: "Kepala Urusan Sinergi", label: "Kepala Urusan Sinergi" },
    { value: "Kepala Urusan Komunikasi", label: "Kepala Urusan Komunikasi" },
    { value: "Kepala Urusan BK", label: "Kepala Urusan BK" },
    { value: "Kepala Urusan Kesehatan", label: "Kepala Urusan Kesehatan" },
    { value: "Kepala Urusan Quality Development", label: "Kepala Urusan Quality Development" },
    { value: "Kepala Urusan Olahraga", label: "Kepala Urusan Olahraga" },
    { value: "staf", label: "staf" },
  ];
  const unitOptions = [
    { value: "pimpinan", label: "Pimpinan" },
    { value: "hc", label: "Human Capital" },
    { value: "kurikulum", label: "Kurikulum" },
    { value: "hubinkom", label: "Hubin Kom" },
    { value: "kesiswaan", label: "Kesiswaan" },
    { value: "sarpra", label: "IT LAB & SAPRA" },
    { value: "prodi", label: "prodi" },
    { value: "lainnya", label: "Lainnya" },
  ];
  const kodejabOptions = [
    { value: "kepsek", label: "kepsek" },
    { value: "waka", label: "waka" },
    { value: "kadmin", label: "kadmin" },
    { value: "prodi", label: "prodi" },
    { value: "kaur", label: "kaur" },
    { value: "staf", label: "staf" },
  ];
  useEffect(() => {
    if (isEditMode && editingSotk) {
      setFormData({
        nip: editingSotk.nip || "",
        nama: editingSotk.nama || "",
        jabatan: editingSotk.jabatan || "",
        unit: editingSotk.unit || "",
        foto: editingSotk.foto || "",
        kodejab: editingSotk.kodejab || "",
      });
    }
  }, [isEditMode, editingSotk]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = () => {
    const validation = validate(formData, constraints);
    if (validation) {
      setErrors(validation);
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      // Jika ada foto (File object), gunakan FormData untuk multipart upload
      if (formData.foto) {
        let formData = new FormData();
        formData.append("nip", formData.nip);
        formData.append("nama", formData.nama);
        formData.append("jabatan", formData.jabatan);
        formData.append("unit", formData.unit);
        formData.append("foto", formData.foto);
        formData.append("kodejab", formData.kodejab);
        await postSotk(formData);
      } else {
        await postSotk(formData);
      }
      if (onSuccess) onSuccess(formData);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving sotk:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="nip"
          label="NIP"
          type="text"
          placeholder="Masukkan NIP"
          value={formData.nip}
          onChange={handleInputChange}
          error={errors.nip}
          icon={User}
        />
        <Input
          name="nama"
          label="Nama"
          type="text"
          placeholder="Masukkan Nama"
          value={formData.nama}
          onChange={handleInputChange}
          error={errors.nama}
          icon={User}
        />
        <Select
          name="jabatan"
          label="Jabatan"
          value={formData.jabatan}
          onChange={handleInputChange}
          options={jabatanOptions}
          error={errors.jabatan}
          icon={User}
        />
       
        <Select
          name="unit"
          label="Unit"
          value={formData.unit}
          onChange={handleInputChange}
          options={unitOptions}
          error={errors.unit}
          icon={User}
        />
        <FileUpload
          name="foto"
          label="Foto"
          value={formData.foto}
          onChange={handleInputChange}
          icon={User}
        />
       <Select
          name="kodejab"
          label="Kode Jabatan"
          value={formData.kodejab}
          onChange={handleInputChange}
          options={kodejabOptions}
          error={errors.kodejab}
          icon={User}
        />
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" onClick={onClose} icon={X} variant="secondary">
            Batal
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={Save}
            loadingText="Menyimpan..."
          >
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
