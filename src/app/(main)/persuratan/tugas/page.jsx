'use client'
import ProtectedRoute from "@/components/ProtectedRoute";
import FadePageIn from "@/components/FadePageIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Mail } from "lucide-react";
import DataTugas from "./DataTugas";
export default function Tugas() {
    const breadcrumbItems = [
        {
            label: "Persuratan",
            href: "#",
            icon: null,
        },
        {
            label: "Surat Tugas",
            href: null,
            icon: Mail,
            isLast: true,
        },
    ];
    return (
        <ProtectedRoute>
            <FadePageIn>
                <Breadcrumbs items={breadcrumbItems} />
                <DataTugas />
            </FadePageIn>
        </ProtectedRoute>
    )
}