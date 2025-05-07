'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DataDashboard({ areaId, areaName }) {
  const [activeForm, setActiveForm] = useState('produccion');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Configuración de columnas por tipo de formulario
  const formConfig = {
    produccion: {
      endpoint: 'production-reports',
      columns: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'maquina', label: 'Máquina', type: 'text' },
        { key: 'produccionKg', label: 'Producción (Kg)', type: 'number' },
        { key: 'kgScrap', label: 'Scrap (Kg)', type: 'number' },
        { key: 'oee', label: 'OEE (%)', type: 'number' }
      ]
    },
    calidad: {
      endpoint: 'quality-reports',
      columns: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'defectos', label: 'Defectos', type: 'number' },
        { key: 'inspecciones', label: 'Inspecciones', type: 'number' },
        { key: 'tasaDefectos', label: 'Tasa Defectos (%)', type: 'number' }
      ]
    },
    rh: {
      endpoint: 'rh-reports',
      columns: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'hrAbsenteeims', label: 'Ausentismo', type: 'number' },
        { key: 'hrTurnover', label: 'Rotación', type: 'number' }
      ]
    }
  };

  // Obtener datos filtrados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        let url = `/api/${formConfig[activeForm].endpoint}`;
        if (areaId) url += `?areaId=${areaId}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (response.ok) {
          setData(result);
        } else {
          throw new Error(result.error || 'Error al cargar datos');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeForm, areaId]);

  // Manejar edición
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({...item});
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/${formConfig[activeForm].endpoint}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }

      // Actualizar vista
      setData(data.map(item => 
        item.id === editingId ? {...item, ...editData} : item
      ));
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar registro
  const handleDelete = async (id) => {
    if (!confirm('¿Confirmas que deseas eliminar este registro?')) return;
    
    try {
      const response = await fetch(`/api/${formConfig[activeForm].endpoint}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar');
      }

      // Actualizar vista
      setData(data.filter(item => item.id !== id));
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="p-4 text-center">Cargando datos...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Dashboard de {areaName?.toUpperCase() || 'Todas las áreas'}
        </h1>
        
        {/* Selector de formulario */}
        <div className="flex space-x-2 mb-4">
          {Object.keys(formConfig).map(form => (
            <button
              key={form}
              onClick={() => setActiveForm(form)}
              className={`px-4 py-2 rounded-md ${
                activeForm === form 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {form.charAt(0).toUpperCase() + form.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {formConfig[activeForm].columns.map(column => (
                <th 
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {formConfig[activeForm].columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type={column.type}
                        value={editData[column.key] || ''}
                        onChange={e => setEditData({
                          ...editData,
                          [column.key]: column.type === 'number' 
                            ? parseFloat(e.target.value) || 0 
                            : e.target.value
                        })}
                        className="w-full p-1 border rounded"
                        step={column.type === 'number' ? "0.01" : undefined}
                      />
                    ) : (
                      <div>
                        {column.type === 'date' 
                          ? new Date(item[column.key]).toLocaleDateString() 
                          : column.type === 'number' 
                            ? Number(item[column.key]).toFixed(2)
                            : item[column.key]}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron registros para este formulario y área
        </div>
      )}
    </div>
  );
}