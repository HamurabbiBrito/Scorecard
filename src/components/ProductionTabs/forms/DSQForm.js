'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  if (typeof dateString === 'string') {
    const datePart = dateString.split('T')[0];
    return datePart;
  }
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default function DSQForm({ areaId, areaName }) {
  const [tipo, setTipo] = useState('CLIENTE');
  const initialFormData = {
    fechaQueja: formatDateForInput(new Date()),
    cantidadQuejas: 0,
    diasSinQueja: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportToEdit, setReportToEdit] = useState(null);
  const router = useRouter();

  const resetForm = () => {
    setFormData(initialFormData);
    setReportToEdit(null);
    setError('');
    setSuccess('');
    setTipo('CLIENTE');
  };

  useEffect(() => {
    if (reportToEdit) {
      setTipo(reportToEdit.tipo);
      setFormData({
        fechaQueja: formatDateForInput(reportToEdit.fechaQueja),
        cantidadQuejas: reportToEdit.cantidadQuejas || 0,
        diasSinQueja: reportToEdit.diasSinQueja || 0
      });
    }
  }, [reportToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('fecha') 
        ? value 
        : Math.max(0, Number(value))
    }));
  };

  const handleTipoChange = (newTipo) => {
    setTipo(newTipo);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fechaQueja) errors.push('Fecha de queja es requerida');
    if (formData.cantidadQuejas < 0) errors.push('Cantidad de quejas no puede ser negativa');
    if (!tipo) errors.push('Tipo de queja es requerido');
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
      const payload = {
        areaId: Number(areaId),
        tipo: tipo,
        fechaQueja: formData.fechaQueja,
        cantidadQuejas: formData.cantidadQuejas,
        diasSinQueja: formData.diasSinQueja
      };

      const url = reportToEdit 
        ? `/api/quejas-reports?id=${reportToEdit.id}`
        : '/api/quejas-reports';

      const method = reportToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${reportToEdit ? 'actualizando' : 'creando'} reporte`);
      }

      resetForm();
      setSuccess(`Reporte ${reportToEdit ? 'actualizado' : 'guardado'} exitosamente!`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al procesar la solicitud');
      
      if (reportToEdit) {
        setTipo(reportToEdit.tipo);
        setFormData({
          fechaQueja: formatDateForInput(reportToEdit.fechaQueja),
          cantidadQuejas: reportToEdit.cantidadQuejas || 0,
          diasSinQueja: reportToEdit.diasSinQueja || 0
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

  // Configuración corregida para los campos del reporte
const reportFieldsConfig = [
  { 
    label: 'Tipo', 
    key: 'tipo',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'CLIENTE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {value}
      </span>
    )
  },
  { 
    label: 'Fecha', 
    key: 'fechaQueja',
    render: (value) => formatDateForInput(value)
  },
  { 
    label: 'Cantidad', 
    key: 'cantidadQuejas',
    className: 'text-center font-medium'
  },
  { 
    label: 'Días sin queja', 
    key: 'diasSinQueja',
    className: 'text-center font-medium'
  }
];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Días Sin Quejas - {areaName}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ {success}</div>}

      <form id="dsq-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={() => handleTipoChange('CLIENTE')}
            className={`px-4 py-2 rounded-md ${
              tipo === 'CLIENTE' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Queja Cliente
          </button>
          <button
            type="button"
            onClick={() => handleTipoChange('BATERIA')}
            className={`px-4 py-2 rounded-md ${
              tipo === 'BATERIA' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Queja Batería
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Queja *</label>
            <input
              type="date"
              name="fechaQueja"
              value={formData.fechaQueja}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>

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
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar Edición
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
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