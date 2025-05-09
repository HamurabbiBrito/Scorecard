'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

// Función para formatear fechas para input date (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // Si es string ISO (de la API), extraemos directamente los componentes
  if (typeof dateString === 'string') {
    // Manejar tanto fechas UTC como con zona horaria
    const datePart = dateString.split('T')[0];
    return datePart;
  }
  
  // Si es objeto Date (por precaución)
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default function DSQForm({ areaId, areaName }) {
  const initialFormData = {
    fechaqc: formatDateForInput(new Date()),
    fechaqcBateria: formatDateForInput(new Date()),
    diasSinQueja: 0,
    diasSinQuejaBateria: 0,
    cantidadQuejas: 0,
    cantidadQuejasBateria: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportToEdit, setReportToEdit] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        fechaqc: formatDateForInput(reportToEdit.fechaQuejaCliente),
        fechaqcBateria: formatDateForInput(reportToEdit.fechaQuejaClienteBateria),
        diasSinQueja: reportToEdit.diasSinQuejas || 0,
        diasSinQuejaBateria: reportToEdit.diasSinQuejasBateria || 0,
        cantidadQuejas: reportToEdit.cantidadQuejas || 0,
        cantidadQuejasBateria: reportToEdit.cantidadQuejasBateria || 0
      });
    }
  }, [reportToEdit]);

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
      // Preparamos payload con fechas en formato YYYY-MM-DD
      const payload = {
        ...formData,
        areaId: Number(areaId),
        fechaQuejaCliente: formData.fechaqc, // Ya está en formato correcto
        fechaQuejaClienteBateria: formData.fechaqcBateria // Ya está en formato correcto
      };

      const isEdit = !!reportToEdit;
      const url = isEdit 
        ? `/api/quejas-reports?id=${reportToEdit.id}`
        : '/api/quejas-reports';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${isEdit ? 'actualizando' : 'creando'} reporte`);
      }

      setFormData(initialFormData);
      setReportToEdit(null);
      setSuccess(`Reporte ${isEdit ? 'actualizado' : 'guardado'} exitosamente!`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al procesar la solicitud');
      
      if (reportToEdit) {
        setFormData({
          fechaqc: formatDateForInput(reportToEdit.fechaQuejaCliente),
          fechaqcBateria: formatDateForInput(reportToEdit.fechaQuejaClienteBateria),
          diasSinQueja: reportToEdit.diasSinQuejas || 0,
          diasSinQuejaBateria: reportToEdit.diasSinQuejasBateria || 0,
          cantidadQuejas: reportToEdit.cantidadQuejas || 0,
          cantidadQuejasBateria: reportToEdit.cantidadQuejasBateria || 0
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReport = (report) => {
    setReportToEdit(report);
    document.getElementById('dsq-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Configuración para el ReportList
  const reportFieldsConfig = [
    { label: 'Fecha Queja', key: 'fechaQuejaCliente', type: 'date' },
    { label: 'Fecha Batería', key: 'fechaQuejaClienteBateria', type: 'date' },
    { label: 'Cant. Quejas', key: 'cantidadQuejas', type: 'number' },
    { label: 'Quejas Batería', key: 'cantidadQuejasBateria', type: 'number' },
    { label: 'Días Sin Queja', key: 'diasSinQuejas', type: 'number' },
    { label: 'Días Batería', key: 'diasSinQuejasBateria', type: 'number' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Días Sin Quejas - {areaName}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ {success}</div>}

      <form id="dsq-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fecha Queja Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Queja Cliente *</label>
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
            <label className="block text-sm font-medium text-gray-700">Cantidad Quejas *</label>
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

          {/* Días Sin Queja */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Días Sin Queja</label>
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
            <label className="block text-sm font-medium text-gray-700">Fecha Queja Batería *</label>
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
            <label className="block text-sm font-medium text-gray-700">Cantidad Quejas Batería</label>
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

          {/* Días Sin Queja Batería */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Días Sin Queja Batería</label>
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
        apiPath="/api/quejas-reports"
        emptyMessage="No hay reportes de días sin quejas disponibles"
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  );
}