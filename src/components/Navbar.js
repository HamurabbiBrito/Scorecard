"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';


export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
      <Image
        src="/leoni-blanco.png"
        alt="Logo Leoni"
        width={120}
        height={40}
      />
        <Link href="/production" className="text-xl font-bold">
          Scorecard
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/production/PVC" className="hover:underline">PVC</Link>
          <Link href="/production/XLPE" className="hover:underline">XLPE</Link>
          <Link href="/production/Base" className="hover:underline">Base</Link>
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