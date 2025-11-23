'use client'
import DataKeterangan from "./DataKeterangan"
import ProtectedRoute from "@/components/ProtectedRoute"
import FadePageIn from "@/components/FadePageIn"
import Breadcrumbs from "@/components/Breadcrumbs"
export default function Keterangan() {
    const breadcrumbItems = [
        {
            label: "Persuratan",
            href: "#",
            icon: null,
        },
        {
            label: "Keterangan",
            href: null,
            icon: null,
            isLast: true,
        },
    ];
    return (
        <ProtectedRoute>
            <FadePageIn>
                <Breadcrumbs items={breadcrumbItems} />
                <DataKeterangan />
            </FadePageIn>
        </ProtectedRoute>
    )
}