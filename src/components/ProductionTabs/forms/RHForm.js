'use client';
import { useState } from 'react';

export default function RHForm({ areaId, areaName }) {
  // Función para formatear la fecha al formato YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    fecha: formatDate(new Date()), // Fecha actual formateada
    hrAbsenteeims: 0,
    hrInability: 0,
    hrTurnover: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo fecha
    if (name === 'fecha') {
      // Aseguramos que el valor se guarde en formato YYYY-MM-DD
      const formattedDate = value ? formatDate(new Date(value)) : '';
      setFormData(prev => ({
        ...prev,
        [name]: formattedDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value) || 0
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!areaId) {
      setError('No se ha especificado un área válida');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rh-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          areaId: Number(areaId),
          fecha: new Date(`${formData.fecha}T00:00:00Z`).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      setSuccess('Datos de RH actualizados correctamente');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al guardar los datos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Recursos Humanos - {areaName?.toUpperCase() || 'Área no especificada'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={formatDate(new Date())}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Resto de los campos se mantienen igual */}
          <div>
            <label className="block text-sm font-medium text-gray-700">HR Absenteeims *</label>
            <input
              type="number"
              name="hrAbsenteeims"
              value={formData.hrAbsenteeims}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">HR Inability</label>
            <input
              type="number"
              name="hrInability"
              value={formData.hrInability}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">HR Turnover</label>
            <input
              type="number"
              name="hrTurnover"
              value={formData.hrTurnover}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Guardando...' : 'Actualizar RH'}
          </button>
        </div>
      </form>
    </div>
  );
}