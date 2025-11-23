'use client'
import ProtectedRoute from "@/components/ProtectedRoute"
import DataGupeg from "./DataGupeg"
import { Briefcase } from "lucide-react"
import FadePageIn from "@/components/FadePageIn"
import Breadcrumbs from "@/components/Breadcrumbs"

export default function Gupeg() {
    const breadcrumbItems = [
        {
            label: "Human Capital",
            href: "#",
            icon: null,
        },
        {
            label: "Kepegawaian",
            href: null,
            icon: Briefcase,
            isLast: true,
        },
    ];
    return (
        <ProtectedRoute>
            <FadePageIn>
                <Breadcrumbs items={breadcrumbItems} />
                <DataGupeg />
            </FadePageIn>
        </ProtectedRoute>
    )
}