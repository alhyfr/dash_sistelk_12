"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import FadePageIn from "@/components/FadePageIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Mail } from "lucide-react";
import DataIncoming from "./DataIncoming";
export default function Incoming() {
  const breadcrumbItems = [
    {
      label: "Persuratan",
      href: "/dashboard",
      icon: null,
    },
    {
      label: "Surat Masuk",
      href: null,
      icon: Mail,
      isLast: true,
    },
  ];
  return (
    <ProtectedRoute>
      <FadePageIn>
        <div className="p-6">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className="h-screen text-slate-500 dark:text-slate-400 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
             <DataIncoming />
          </div>
        </div>
      </FadePageIn>
    </ProtectedRoute>
  );
}
