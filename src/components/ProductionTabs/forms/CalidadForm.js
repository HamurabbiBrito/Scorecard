'use client';
import { useState } from 'react';

export default function CalidadForm({ area }) {
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    fecha: '',
    qualityCreditNoteUSD: '',
    qualityCreditNoteUSDBattery: 0,
    today: 0,
    mesAnterior: '',
    numero: '',
    cantidadQuejas: 0,
    cantidadQuejasBateria: 0
  });

  // Manejador de cambios genérico
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('USD') || name === 'numero' || name === 'mesAnterior' 
        ? value 
        : Number(value) || 0
    }));
  };

  // Manejador de envío
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de calidad enviados:', formData);
    // Aquí iría tu lógica para enviar el formulario
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Métricas de Calidad - {area.toUpperCase()}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Primera fila de campos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quality Credit Note USD {area.toUpperCase()}
            </label>
            <input
              type="text"
              name="qualityCreditNoteUSD"
              value={formData.qualityCreditNoteUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quality Credit Note USD Battery {area.toUpperCase()}
            </label>
            <input
              type="number"
              name="qualityCreditNoteUSDBattery"
              value={formData.qualityCreditNoteUSDBattery}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Today</label>
            <input
              type="number"
              name="today"
              value={formData.today}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        {/* Segunda fila de campos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mes anterior</label>
            <input
              type="text"
              name="mesAnterior"
              value={formData.mesAnterior}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número {area.toUpperCase()}
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de quejas {area.toUpperCase()}
            </label>
            <input
              type="number"
              name="cantidadQuejas"
              value={formData.cantidadQuejas}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de quejas Bateria
            </label>
            <input
              type="number"
              name="cantidadQuejasBateria"
              value={formData.cantidadQuejasBateria}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Registrar Control
        </button>
      </form>
    </div>
  );
} 