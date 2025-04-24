import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Settings() {
  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Configuración</h1>
          <p>Aquí puedes configurar tu aplicación.</p>
        </main>
      </div>
    </ProtectedRoute>
  );
}