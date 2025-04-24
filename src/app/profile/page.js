import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
          {session && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p>Email: {session.user.email}</p>
              <p>ID: {session.user.id}</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}