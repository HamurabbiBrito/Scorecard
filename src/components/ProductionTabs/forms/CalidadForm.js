'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

// Función mejorada para manejo de fechas con zona horaria
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // Asegurarse de manejar correctamente la zona horaria
  const date = new Date(dateString);
  
  // Ajustar para evitar problemas de zona horaria
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Función para enviar fechas al servidor
const formatDateForServer = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};

export default function CalidadForm({ areaId, areaName }) {
  const initialFormData = {
    fecha: formatDateForInput(new Date()),
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

  useEffect(() => {
    if (reportToEdit) {
      // Asegurar que la fecha se formatea correctamente al editar
      const formattedDate = formatDateForInput(reportToEdit.fecha);
      console.log('Fecha original:', reportToEdit.fecha, 'Fecha formateada:', formattedDate);
      
      setFormData({
        ...reportToEdit,
        fecha: formattedDate
      });
    }
  }, [reportToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['qualityCreditNoteUSD', 'mesAnterior', 'numero', 'fecha'].includes(name) 
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
    
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      // Validar y formatear fecha para el servidor
      const selectedDate = new Date(formData.fecha);
      if (isNaN(selectedDate.getTime())) {
        setError('Fecha no válida');
        return;
      }

      setIsSubmitting(true);

      const payload = {
        ...formData,
        areaId: Number(areaId),
        fecha: formatDateForServer(formData.fecha), // Usar función de formato para servidor
        qualityCreditNoteUSDBattery: Number(formData.qualityCreditNoteUSDBattery) || 0,
        cantidadQuejas: Number(formData.cantidadQuejas) || 0,
        cantidadQuejasBateria: Number(formData.cantidadQuejasBateria) || 0
      };

      const isEdit = !!reportToEdit;
      const url = isEdit 
        ? `/api/quality-reports?id=${reportToEdit.id}`
        : '/api/quality-reports';

      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${isEdit ? 'actualizando' : 'creando'} reporte`);
      }

      // Reset después del éxito
      setFormData({
        ...initialFormData,
        fecha: formatDateForInput(new Date()) // Resetear con fecha actual bien formateada
      });
      setReportToEdit(null);
      setSuccess(`Reporte ${isEdit ? 'actualizado' : 'guardado'} exitosamente!`);
      router.refresh();

    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.message || 'Error al procesar la solicitud');
      
      if (reportToEdit) {
        // Restaurar datos de edición con fecha bien formateada
        setFormData({
          ...reportToEdit,
          fecha: formatDateForInput(reportToEdit.fecha)
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReport = (report) => {
    // Asegurar formato correcto de fecha al editar
    setReportToEdit({
      ...report,
      fecha: report.fecha // Mantener el valor original para el formateo en useEffect
    });
    document.getElementById('quality-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Configuración para el ReportList
  const reportFieldsConfig = [
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'qualityCreditNoteUSD', label: 'Credit Note USD' },
    { key: 'qualityCreditNoteUSDBattery', label: 'Credit Note Battery', type: 'number' },
    { key: 'cantidadQuejas', label: 'Quejas', type: 'number' },
    { key: 'cantidadQuejasBateria', label: 'Quejas Batería', type: 'number' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Control de Calidad - {areaName}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ {success}</div>}

      <form id="quality-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Resto de los campos del formulario... */}
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
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  );
}