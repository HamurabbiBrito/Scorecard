'use client';
import { useState } from 'react';

export default function AccidentesForm({ area }) {
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    fecha: '',
    cantidadAccidentes: 1,
    cantidadCuasiAccidentes: 0,
    diasUltimoAccidente: 0
  });

  // Manejador de cambios genérico
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para incrementar/disminuir valores
  const handleNumberChange = (field, delta) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  // Manejador de envío
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    // Aquí iría tu lógica para enviar el formulario
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Reporte de Accidentes - {area.toUpperCase()}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Campo de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha del accidente {area.toUpperCase()}
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Campo de cantidad de accidentes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de Accidentes {area.toUpperCase()}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                name="cantidadAccidentes"
                value={formData.cantidadAccidentes}
                onChange={handleChange}
                min="0"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleNumberChange('cantidadAccidentes', 1)}
                  className="size-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  aria-label="Incrementar"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleNumberChange('cantidadAccidentes', -1)}
                  className="size-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  aria-label="Decrementar"
                  disabled={formData.cantidadAccidentes <= 0}
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Campo de cuasi-accidentes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad de Cuasi-accidentes
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                name="cantidadCuasiAccidentes"
                value={formData.cantidadCuasiAccidentes}
                onChange={handleChange}
                min="0"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleNumberChange('cantidadCuasiAccidentes', 1)}
                  className="size-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  aria-label="Incrementar"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleNumberChange('cantidadCuasiAccidentes', -1)}
                  className="size-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  aria-label="Decrementar"
                  disabled={formData.cantidadCuasiAccidentes <= 0}
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Campo de días desde último accidente */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Días desde el último accidente {area.toUpperCase()}
            </label>
            <input
              type="number"
              name="diasUltimoAccidente"
              value={formData.diasUltimoAccidente}
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
          Guardar Reporte
        </button>
      </form>
    </div>
  );
}