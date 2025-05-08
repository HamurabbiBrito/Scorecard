'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';

export default function CalidadForm({ areaId, areaName }) {
  // Estado inicial del formulario
  const initialFormData = {
    fecha: new Date().toISOString().split('T')[0],
    qualityCreditNoteUSD: '',
    qualityCreditNoteUSDBattery: 0,
    mesAnterior: '',
    numero: '',
    cantidadQuejas: 0,
    cantidadQuejasBateria: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportToEdit, setReportToEdit] = useState(null);
  const router = useRouter();

  // Efecto para sincronizar reportToEdit con formData
  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        fecha: reportToEdit.fecha,
        qualityCreditNoteUSD: reportToEdit.qualityCreditNoteUSD,
        qualityCreditNoteUSDBattery: reportToEdit.qualityCreditNoteUSDBattery,
        mesAnterior: reportToEdit.mesAnterior,
        numero: reportToEdit.numero,
        cantidadQuejas: reportToEdit.cantidadQuejas,
        cantidadQuejasBateria: reportToEdit.cantidadQuejasBateria
      });
    } else {
      setFormData(initialFormData);
    }
  }, [reportToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['qualityCreditNoteUSD', 'mesAnterior', 'numero'].includes(name) 
        ? value 
        : Number(value) || 0
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.fecha) errors.push('Fecha es requerida');
    if (!formData.qualityCreditNoteUSD) errors.push('Quality Credit Note USD es requerido');
    if (!formData.mesAnterior) errors.push('Mes anterior es requerido');
    if (!formData.numero) errors.push('Número es requerido');
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
      const url = reportToEdit 
        ? `/api/quality-reports?id=${reportToEdit.id}`
        : '/api/quality-reports';

      const method = reportToEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
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

      // Reset después del éxito
      setFormData(initialFormData);
      setReportToEdit(null);
      setSuccess(`Reporte ${reportToEdit ? 'actualizado' : 'guardado'} exitosamente!`);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error interno del servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReport = (report) => {
    setReportToEdit(report);
    document.getElementById('quality-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Control de Calidad - {areaName}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ {success}</div>}

      <form id="quality-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Todos los inputs ahora usan formData directamente */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Credit Note USD *</label>
            <input
              type="text"
              name="qualityCreditNoteUSD"
              value={formData.qualityCreditNoteUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Resto de los inputs... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Credit Note USD Battery</label>
            <input
              type="number"
              name="qualityCreditNoteUSDBattery"
              value={formData.qualityCreditNoteUSDBattery}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mes Anterior *</label>
            <input
              type="text"
              name="mesAnterior"
              value={formData.mesAnterior}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número *</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad de Quejas</label>
            <input
              type="number"
              name="cantidadQuejas"
              value={formData.cantidadQuejas}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad de Quejas Batería</label>
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
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={() => {
                setReportToEdit(null);
                setFormData(initialFormData);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar Edición
            </button>
          )}
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
                {reportToEdit ? 'Actualizando...' : 'Guardando...'}
              </span>
            ) : reportToEdit ? 'Actualizar Reporte' : 'Guardar Reporte'}
          </button>
        </div>
      </form>

      <ReportList
        areaId={areaId}
        onEdit={handleEditReport}
        reportToEdit={reportToEdit}
        apiPath="/api/quality-reports"
        emptyMessage="No hay reportes de calidad disponibles"
        fieldsConfig={[
          { label: 'Fecha', key: 'fecha', type: 'date' },
          { label: 'Credit Note USD', key: 'qualityCreditNoteUSD', type: 'text' },
          { label: 'Credit Note Battery', key: 'qualityCreditNoteUSDBattery', type: 'number' },
          { label: 'Quejas', key: 'cantidadQuejas', type: 'number' },
          { label: 'Quejas Batería', key: 'cantidadQuejasBateria', type: 'number' }
        ]}
      />
    </div>
  );
}