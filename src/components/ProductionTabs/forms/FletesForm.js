'use client';
import { useState } from 'react';

export default function FletesForm({ areaId, areaName = '' }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    specialFreight: '',
    specialFreightCustomer: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación básica
    if (!areaId) {
      setError('No se ha especificado un área válida');
      return;
    }

    if (!formData.fecha || !formData.specialFreight) {
      setError('Fecha y Special freight son campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/fletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          areaId: Number(areaId),
          fecha: new Date(formData.fecha).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el flete');
      }

      // Resetear formulario después de éxito
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        specialFreight: '',
        specialFreightCustomer: ''
      });

      setSuccess('Flete registrado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Fletes Especiales - {areaName.toUpperCase()}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special freight {areaName.toUpperCase()} *
            </label>
            <input
              type="text"
              name="specialFreight"
              value={formData.specialFreight}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special freight customer {areaName.toUpperCase()}
            </label>
            <input
              type="text"
              name="specialFreightCustomer"
              value={formData.specialFreightCustomer}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Flete'}
          </button>
        </div>
      </form>
    </div>
  );
}