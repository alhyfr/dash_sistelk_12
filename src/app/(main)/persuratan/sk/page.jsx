'use client'
import ProtectedRoute from "@/components/ProtectedRoute";
import FadePageIn from "@/components/FadePageIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Mail } from "lucide-react";
import DataSk from "./DataSk";
export default function SK() {
  const breadcrumbItems = [
    {
      label: "Persuratan",
      href: "/persuratan/sk",
      icon: null,
    },
    {
      label: "Surat Keputusan",
      href: null,
      icon: Mail,
      isLast: true,
    },
  ];
  return (
    <ProtectedRoute>
      <FadePageIn>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <DataSk />
      </div>
      </FadePageIn>
    </ProtectedRoute>
  );
}