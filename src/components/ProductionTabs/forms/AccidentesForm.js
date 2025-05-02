'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AccidentesForm() {
  const router = useRouter();
  const params = useParams();
  const areaSlug = params?.area; // Obtenemos el área de la URL
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cantidadAccidentes: 0,
    cantidadCuasiAccidentes: 0,
    diasUltimoAccidente: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [areaInfo, setAreaInfo] = useState(null);

  // Obtener información del área basado en el slug
  // components/ProductionTabs/forms/AccidentesForm.js
useEffect(() => {
  const fetchAreaData = async () => {
    try {
      const response = await fetch(`/api/areas/${areaSlug}`)
      
      if (!response.ok) {
        throw new Error('Área no encontrada')
      }
      
      const data = await response.json()
      setAreaInfo(data)
      
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage(`Error cargando área: ${error.message}`)
      setTimeout(() => router.push('/production'), 3000)
    }
  }

  if (areaSlug) fetchAreaData()
}, [areaSlug, router]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cantidad') ? Math.max(0, Number(value)) : value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fecha) errors.push('La fecha es requerida');
    if (!areaInfo?.id) errors.push('Área no válida');
    if (formData.cantidadAccidentes < 0) errors.push('La cantidad de accidentes no puede ser negativa');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/accidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          areaId: areaInfo.id,
          fecha: new Date(formData.fecha).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        cantidadAccidentes: 0,
        cantidadCuasiAccidentes: 0,
        diasUltimoAccidente: 0
      });

      setSuccessMessage('Reporte guardado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error en el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!areaInfo) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando información del área...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-8xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Reporte de Accidentes - {areaInfo.nombre.toUpperCase()}
      </h2>

      {/* Mensajes de estado */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg transition-all duration-300">
          ⚠️ {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg transition-all duration-300">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha del reporte
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {[
            { name: 'cantidadAccidentes', label: 'Accidentes Registrados', required: true },
            { name: 'cantidadCuasiAccidentes', label: 'Cuasi Accidentes' },
            { name: 'diasUltimoAccidente', label: 'Días sin Accidentes' }
          ].map((campo) => (
            <div key={campo.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {campo.label}
              </label>
              <input
                type="number"
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                min="0"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required={campo.required}
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
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
            ) : 'Guardar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
}