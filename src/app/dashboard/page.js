import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p>Contenido exclusivo para usuarios autenticados.</p>
        </main>
      </div>
    </ProtectedRoute>
  );
}