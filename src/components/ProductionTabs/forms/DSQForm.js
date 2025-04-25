'use client';
import { now } from 'next-auth/client/_utils';
import { useState } from 'react';

export default function DSQForm({ area }) {
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    fechaqc: '',
    fechaqcBateria: '',
    diasSinQueja: 0,
    diasSinQuejaBateria: 0,
    today: Date(),
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
      <h2 className="text-2xl font-semibold mb-4">Días sin quejas - {area.toUpperCase()}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Primera fila de campos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de la queja cliente {area.toUpperCase()}
              </label> 
            <input
              type="date"
              name="fecha"
              value={formData.fechaqc}
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
              type="text"
              name="cantidadQuejas"
              value={formData.cantidadQuejas}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Días sin queja de cliente {area.toUpperCase()}
            </label>
            <input
              type="number"
              name="diasSinQueja"
              value={formData.diasSinQueja}
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
            <label className="block text-sm font-medium text-gray-700">
              Fecha Queja cliente Bateria {area.toUpperCase()}
              </label>
            <input
              type="text"
              name="fechaqcBateria"
              value={formData.fechaqcBateria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de quejas Bateria
            </label>
            <input
              type="text"
              name="CantidadQuejasBateria"
              value={formData.cantidadQuejasBateria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Días sin queja de cliente Bateria {area.toUpperCase()}
            </label>
            <input
              type="number"
              name="diasSinQuejaBateria"
              value={formData.diasSinQuejaBateria}
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
          Registrar Queja
        </button>
      </form>
    </div>
  );
} 