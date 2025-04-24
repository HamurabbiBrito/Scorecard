"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Scorecard
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/profile" className="hover:underline">Perfil</Link>
          <Link href="/settings" className="hover:underline">Configuración</Link>
          
          {status === "authenticated" ? (
            <button 
              onClick={() => signOut()}
              className="hover:underline"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link href="/login" className="hover:underline">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}