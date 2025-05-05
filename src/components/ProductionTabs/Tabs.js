'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formsConfig } from './formConfig';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Tabs() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(formsConfig[0].id);
  const [areaData, setAreaData] = useState({ id: null, nombre: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const slug = params.area?.toLowerCase();
        if (!slug) throw new Error('Slug no definido');

        const response = await fetch(`/api/areas/${slug}`);
        if (!response.ok) throw new Error('Área no encontrada');

        const data = await response.json();
        if (!data?.id) throw new Error('Datos de área inválidos');

        setAreaData({
          id: data.id,
          nombre: data.nombre || data.slug.toUpperCase()
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaData();
  }, [params.area]);

  if (loading) return <LoadingSpinner message="Cargando área..." />;
  if (error) return <div className="p-4 bg-red-100 text-red-700">{error}</div>;
  if (!areaData.id) return <div className="p-4 bg-yellow-100 text-yellow-700">Área no disponible</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{areaData.nombre}</h1>
      
      <div className="flex border-b overflow-x-auto">
        {formsConfig.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {formsConfig.find(tab => tab.id === activeTab)?.form({
          areaId: areaData.id,
          areaName: areaData.nombre
        })}
      </div>
    </div>
  );
}