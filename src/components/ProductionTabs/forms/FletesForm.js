'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

// Función para formatear fecha en formato YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

export default function FletesForm({ areaId, areaName = '' }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fecha: formatDate(new Date()),
    specialFreight: '',
    specialFreightCustomer: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);

  // Configuración de campos para ReportList
  const reportFieldsConfig = [
    { 
      label: 'Fecha', 
      key: 'fecha',
      render: (value) => {
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
      }
    },
    { 
      label: 'Special Freight', 
      key: 'specialFreight',
      className: 'font-medium'
    },
    { 
      label: 'Cliente', 
      key: 'specialFreightCustomer',
      className: 'text-gray-600'
    }
  ];

  // Cargar reportes al montar el componente
  useEffect(() => {
    if (areaId) {
      loadReports();
    }
  }, [areaId]);

  const loadReports = async () => {
    try {
      const response = await fetch(`/api/fletes?areaId=${areaId}`);
      if (!response.ok) throw new Error('Error al cargar reportes');
      
      const { data } = await response.json();
      setReports(data || []);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setError('Error al cargar reportes existentes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!areaId) errors.push('Área no especificada');
    if (!formData.fecha) errors.push('Fecha es requerida');
    if (!formData.specialFreight.trim()) errors.push('Special freight es requerido');
    if (formData.specialFreight.length > 100) errors.push('Special freight no puede exceder 100 caracteres');
    if (formData.specialFreightCustomer && formData.specialFreightCustomer.length > 100) {
      errors.push('Cliente no puede exceder 100 caracteres');
    }
    
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
        ...formData,
        areaId: Number(areaId),
        fecha: `${formData.fecha}T00:00:00` // Asegurar formato ISO completo
      };

      const url = reportToEdit 
        ? `/api/fletes?id=${reportToEdit.id}`
        : '/api/fletes';

      const method = reportToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Error al procesar la solicitud');
      }

      const data = await response.json();

      // Actualizar lista de reportes
      await loadReports();

      // Resetear formulario
      setFormData({
        fecha: formatDate(new Date()),
        specialFreight: '',
        specialFreightCustomer: ''
      });

      setReportToEdit(null);
      setSuccess(reportToEdit ? 'Flete actualizado exitosamente!' : 'Flete registrado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReport = (report) => {
    setReportToEdit(report);
    setFormData({
      fecha: report.fecha,
      specialFreight: report.specialFreight,
      specialFreightCustomer: report.specialFreightCustomer || ''
    });
    // Scroll al formulario
    document.getElementById('fletes-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setReportToEdit(null);
    setFormData({
      fecha: formatDate(new Date()),
      specialFreight: '',
      specialFreightCustomer: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Fletes Especiales - {areaName.toUpperCase()}
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

      <form 
        id="fletes-form" 
        onSubmit={handleSubmit} 
        className="space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              max={formatDate(new Date())}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special freight *
            </label>
            <input
              type="text"
              name="specialFreight"
              value={formData.specialFreight}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={100}
              disabled={isSubmitting}
              placeholder={`Special freight ${areaName.toUpperCase()}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              name="specialFreightCustomer"
              value={formData.specialFreightCustomer}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
              disabled={isSubmitting}
              placeholder={`Cliente ${areaName.toUpperCase()}`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting 
              ? reportToEdit ? 'Actualizando...' : 'Registrando...' 
              : reportToEdit ? 'Actualizar Flete' : 'Registrar Flete'}
          </button>
        </div>
      </form>

      <ReportList
        areaId={areaId}
        onEdit={handleEditReport}
        reportToEdit={reportToEdit}
        apiPath="/api/fletes"
        emptyMessage="No hay reportes de fletes disponibles"
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  );
}