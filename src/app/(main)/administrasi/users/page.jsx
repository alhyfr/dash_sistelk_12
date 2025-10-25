"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import FadePageIn from "@/components/FadePageIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Users } from "lucide-react";
import DataUsers from "./DataUsers";

export default function UsersPage() {
  // Custom breadcrumb items
  const breadcrumbItems = [
    {
      label: "Administrasi",
      href: "/dashboard",
      icon: null,
    },
    {
      label: "Users",
      href: null,
      icon: Users,
      isLast: true,
    },
  ];

  return (
    <ProtectedRoute>
      <FadePageIn>
        <div className="p-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Page Content */}
          <div className="h-screen bg-white text-slate-500 rounded-lg shadow-sm border border-gray-200 p-6">
            <DataUsers />
          </div>
        </div>
      </FadePageIn>
    </ProtectedRoute>
  );
}
