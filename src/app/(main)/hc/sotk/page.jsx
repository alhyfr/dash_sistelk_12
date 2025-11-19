'use client'
import ProtectedRoute from "@/components/ProtectedRoute"
import FadePageIn from "@/components/FadePageIn"
import Breadcrumbs from "@/components/Breadcrumbs"
import { FileText,Users2 } from "lucide-react"
import DataSotk from "./DataSotk"
export default function Sotk() {
  const breadcrumbItems = [
    {
      label: "HC",
      href: "#",
      icon: null,
    },
    {
      label: "SOTK",
      href: "/hc/sotk",
      icon: Users2,
      isLast: true,
    },
  ]
  return (
    <ProtectedRoute>
      <FadePageIn>
        <div className="min-h-screen p-6 text-slate-500 dark:text-slate-400">
          <Breadcrumbs items={breadcrumbItems} />
        <DataSotk />
        </div>
      </FadePageIn>
    </ProtectedRoute>
  )
}