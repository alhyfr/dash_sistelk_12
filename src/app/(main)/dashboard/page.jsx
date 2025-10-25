import FadePageIn from "@/components/FadePageIn";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumbs from '@/components/Breadcrumbs'
import { Home } from 'lucide-react'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <FadePageIn>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs - Auto generated */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Home className="w-8 h-8 mr-3 text-red-600" />
              Dashboard
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Selamat datang di dashboard SISTELK12!</p>
            </div>
          </div>
        </div>
      </FadePageIn>
    </ProtectedRoute>
  );
}