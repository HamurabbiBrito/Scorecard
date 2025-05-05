'use client';
import { useState } from 'react';

export default function ControlForm({ areaId, areaName }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    dlp: 0,
    capacityUtilization: 0,
    dlpBattery: 0,
    capacityUtilizationBattery: 0,
    variationsInventoryCobreUSD: 0,
    variationsInventoryCobreKg: 0,
    variationsInventoryCompuestoUSD: 0,
    variationsInventoryCompuestoKg: 0,
    variationsInventoryCableUSD: 0,
    variationsInventoryCableKg: 0,
    dlpSemana: 0,
    dlpSemanaMaterial: 0,
    metaMensual: 0,
    metaMensualBateria: 0,
    impactoDlpUSD: 0,
    impactoDlpUSDBateria: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('USD') || name.includes('Kg') ? parseFloat(value) || 0 : parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!areaId) {
      setError('Área no especificada');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/control-reports', {
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
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      setSuccess('Reporte de control guardado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Control de Producción - {areaName?.toUpperCase() || 'Área no especificada'}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
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

          {/* DLP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">DLP {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="dlp"
              value={formData.dlp}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Capacity Utilization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity Utilization {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="capacityUtilization"
              value={formData.capacityUtilization}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* DLP Battery */}
          <div>
            <label className="block text-sm font-medium text-gray-700">DLP Battery</label>
            <input
              type="number"
              name="dlpBattery"
              value={formData.dlpBattery}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Capacity Utilization Battery */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity Utilization Battery</label>
            <input
              type="number"
              name="capacityUtilizationBattery"
              value={formData.capacityUtilizationBattery}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Resto de campos */}
          {[
            { name: 'variationsInventoryCobreUSD', label: 'Variaciones inventario Cobre USD', step: '0.01' },
            { name: 'variationsInventoryCobreKg', label: 'Variaciones inventario Cobre Kg', step: '0.01' },
            { name: 'variationsInventoryCompuestoUSD', label: 'Variaciones inventario Compuesto USD', step: '0.01' },
            { name: 'variationsInventoryCompuestoKg', label: 'Variaciones inventario Compuesto Kg', step: '0.01' },
            { name: 'variationsInventoryCableUSD', label: 'Variaciones inventario Cable USD', step: '0.01' },
            { name: 'variationsInventoryCableKg', label: 'Variaciones inventario Cable Kg', step: '0.01' },
            { name: 'dlpSemana', label: 'DLP Semanal' },
            { name: 'dlpSemanaMaterial', label: 'DLP Semanal material' },
            { name: 'metaMensual', label: 'Meta mensual' },
            { name: 'metaMensualBateria', label: 'Meta mensual bateria' },
            { name: 'impactoDlpUSD', label: 'Impacto DLP en USD', step: '0.01' },
            { name: 'impactoDlpUSDBateria', label: 'Impacto DLP en USD Bateria', step: '0.01' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                step={field.step || '1'}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          ))}
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
            ) : 'Guardar Control'}
          </button>
        </div>
      </form>
    </div>
  );
}