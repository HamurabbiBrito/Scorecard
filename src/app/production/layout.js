'use client';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProductionLayout({ children, params }) {
  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 capitalize">{params.area}</h1>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}