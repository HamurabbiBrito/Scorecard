'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formsConfig } from './formConfig';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Tabs({ areaSlug }) {
  const [activeTab, setActiveTab] = useState(formsConfig[0].id);
  const [areaInfo, setAreaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const response = await fetch(`/api/areas/${areaSlug.toLowerCase()}`);
        
        if (!response.ok) throw new Error('Área no encontrada');
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        setAreaInfo(data);
        setError('');
      } catch (error) {
        setError(error.message);
        router.push('/production');
      } finally {
        setLoading(false);
      }
    };

    if (areaSlug) fetchAreaData();
  }, [areaSlug, router]);

  if (loading) return <LoadingSpinner message="Cargando área..." />;

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
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
        {areaInfo && formsConfig.find(tab => tab.id === activeTab)?.form(areaInfo)}
      </div>
    </div>
  );
}