'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DataView({ areaId, areaName, availableForms = [] }) {
  const [activeForm, setActiveForm] = useState(availableForms[0]?.id || '');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar recarga

  const currentFormConfig = availableForms.find(form => form.id === activeForm) || null;

  // Función para cargar datos
  const loadData = async () => {
    if (!currentFormConfig?.endpoint) return;
    
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/${currentFormConfig.endpoint}?areaId=${areaId}`);
      if (!res.ok) throw new Error('Error al cargar datos');
      
      const result = await res.json();
      setData(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar y cuando cambian las dependencias
  useEffect(() => {
    loadData();
  }, [activeForm, areaId, currentFormConfig?.endpoint, refreshKey]);

  // Función para edición directa
  const handleDirectEdit = async (id, field, value) => {
    try {
      const res = await fetch(`/api/${currentFormConfig.endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });

      if (!res.ok) throw new Error('Error al actualizar');
      
      // Actualizar la vista localmente
      setData(data.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
      
      // Opcional: recargar datos desde el servidor
      // setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <LoadingSpinner message="Cargando datos..." />;
  if (error) return <div className="p-4 bg-red-100 text-red-700">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* ... (selector de formulario igual que antes) ... */}
      
      {currentFormConfig && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentFormConfig.tableColumns.map(column => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {currentFormConfig.tableColumns.map(column => (
                    <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      <EditableCell
                        value={item[column.key]}
                        type={column.type}
                        onSave={(newValue) => handleDirectEdit(item.id, column.key, newValue)}
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setRefreshKey(prev => prev + 1)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente para celdas editables
function EditableCell({ value, type, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onSave(type === 'number' ? Number(inputValue) : inputValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <>
          <input
            type={type === 'date' ? 'date' : type === 'number' ? 'number' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-1 border rounded"
          />
          <button 
            onClick={handleSave}
            className="ml-2 text-green-600 hover:text-green-800"
          >
            ✓
          </button>
          <button 
            onClick={() => {
              setIsEditing(false);
              setInputValue(value);
            }}
            className="ml-1 text-red-600 hover:text-red-800"
          >
            ✗
          </button>
        </>
      ) : (
        <>
          <span>
            {type === 'date' 
              ? new Date(value).toLocaleDateString() 
              : value}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✏️
          </button>
        </>
      )}
    </div>
  );
}