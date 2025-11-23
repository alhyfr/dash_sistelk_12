'use client'
import ProtectedRoute from "@/components/ProtectedRoute"
import FadePageIn from "@/components/FadePageIn"
import Breadcrumbs from "@/components/Breadcrumbs"
import DataSiswa from "./DataSiswa"
export default function Siswa() {
    const breadcrumbItems = [
        {
            label: "Kesiswaan",
            href: "#",
            icon: null,
        },
        {
            label: "Data Siswa",
            href: null,
            icon: null,
            isLast: true,
        },
    ];
    return (
        <ProtectedRoute>
            <FadePageIn>
                <Breadcrumbs items={breadcrumbItems} />
                <DataSiswa />
            </FadePageIn>
        </ProtectedRoute>
    )
}