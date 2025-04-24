import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function produccion() {
  return (
    <ProtectedRoute>
      <div>
        {/* //<Navbar /> */}
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Areas</h1>
          <p>Selecciona una área para ver sus métricas.</p>
        </main>
      </div>
    </ProtectedRoute>
  );
}