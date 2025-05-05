'use client';
import { useState } from 'react';

export default function DSQForm({ areaId, areaName }) { // Cambiamos a areaId y areaName
  const [formData, setFormData] = useState({
    fechaqc: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    fechaqcBateria: new Date().toISOString().split('T')[0],
    diasSinQueja: 0,
    diasSinQuejaBateria: 0,
    cantidadQuejas: 0,
    cantidadQuejasBateria: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['fechaqc', 'fechaqcBateria'].includes(name) 
        ? value 
        : Number(value) || 0
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.fechaqc) errors.push('Fecha de queja cliente es requerida');
    if (!formData.fechaqcBateria) errors.push('Fecha de queja batería es requerida');
    if (!areaId) errors.push('Área no especificada');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quejas-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          areaId: Number(areaId),
          fechaQuejaCliente: new Date(formData.fechaqc).toISOString(),
          fechaQuejaClienteBateria: new Date(formData.fechaqcBateria).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      // Resetear formulario
      setFormData({
        fechaqc: new Date().toISOString().split('T')[0],
        fechaqcBateria: new Date().toISOString().split('T')[0],
        diasSinQueja: 0,
        diasSinQuejaBateria: 0,
        cantidadQuejas: 0,
        cantidadQuejasBateria: 0
      });

      setSuccess('Reporte de quejas guardado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Días sin quejas - {areaName?.toUpperCase() || 'Área no especificada'}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha Queja Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha queja cliente *
            </label>
            <input
              type="date"
              name="fechaqc"
              value={formData.fechaqc}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Cantidad Quejas */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de quejas *
            </label>
            <input
              type="number"
              name="cantidadQuejas"
              value={formData.cantidadQuejas}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Días sin queja */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Días sin queja
            </label>
            <input
              type="number"
              name="diasSinQueja"
              value={formData.diasSinQueja}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Fecha Queja Batería */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha queja batería *
            </label>
            <input
              type="date"
              name="fechaqcBateria"
              value={formData.fechaqcBateria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Cantidad Quejas Batería */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad quejas batería
            </label>
            <input
              type="number"
              name="cantidadQuejasBateria"
              value={formData.cantidadQuejasBateria}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Días sin queja Batería */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Días sin queja batería
            </label>
            <input
              type="number"
              name="diasSinQuejaBateria"
              value={formData.diasSinQuejaBateria}
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
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : 'Registrar Queja'}
          </button>
        </div>
      </form>
    </div>
  );
}