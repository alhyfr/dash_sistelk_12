import ProtectedRoute from "@/components/ProtectedRoute";
import FadePageIn from "@/components/FadePageIn";
export default function SK() {
  return (
    <ProtectedRoute>
      <FadePageIn>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1>SK</h1>
      </div>
      </FadePageIn>
    </ProtectedRoute>
  );
}