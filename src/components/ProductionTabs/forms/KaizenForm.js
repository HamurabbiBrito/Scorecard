'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';

export default function KaizenForm({ areaId, areaName }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    percentAudit5s: '',
    kaizenIdeas: '',
    savings: '',
    projectDescription: '',
    anualProjectDescription: '',
    savingsAnual: '',
    target5s: '',
    numeroKaizen: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportToEdit, setReportToEdit] = useState(null);
  const router = useRouter();

  // Cargar datos para edición
  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        fecha: formatDateForInput(reportToEdit.fecha),
        percentAudit5s: reportToEdit.percentAudit5s?.toString() || '',
        kaizenIdeas: reportToEdit.kaizenIdeas?.toString() || '',
        savings: reportToEdit.savings?.toString() || '',
        projectDescription: reportToEdit.projectDescription || '',
        anualProjectDescription: reportToEdit.anualProjectDescription || '',
        savingsAnual: reportToEdit.savingsAnual || '',
        target5s: reportToEdit.target5s || '',
        numeroKaizen: reportToEdit.numeroKaizen?.toString() || ''
      });
    }
  }, [reportToEdit]);

const formatDateForInput = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      percentAudit5s: '',
      kaizenIdeas: '',
      savings: '',
      projectDescription: '',
      anualProjectDescription: '',
      savingsAnual: '',
      target5s: '',
      numeroKaizen: ''
    });
    setReportToEdit(null);
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.fecha) errors.push('Fecha es requerida');
    if (!formData.projectDescription) errors.push('Descripción del proyecto es requerida');
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
        fecha: new Date(formData.fecha).toISOString(),
        percentAudit5s: formData.percentAudit5s,
        kaizenIdeas: formData.kaizenIdeas,
        savings: formData.savings,
        numeroKaizen: formData.numeroKaizen
      };

      const url = reportToEdit 
        ? `/api/kaizen-reports?id=${reportToEdit.id}`
        : '/api/kaizen-reports';

      const method = reportToEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar el proyecto');
      }

      setSuccess(`Proyecto ${reportToEdit ? 'actualizado' : 'registrado'} exitosamente!`);
      setTimeout(() => resetForm(), 3000);
      
      
      // Disparar evento para actualizar ReportList
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('reloadKaizenReports'));
      }

    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportFieldsConfig = [
    { label: 'Fecha', key: 'fecha', type: 'date' },
    { label: '% Audit 5S', key: 'percentAudit5s', type: 'number' },
    { label: 'Ideas Kaizen', key: 'kaizenIdeas', type: 'number' },
    { label: 'Ahorros', key: 'savings', type: 'number' },
    { label: 'Descripción', key: 'projectDescription', truncate: true },
    { label: 'Desc. Anual', key: 'anualProjectDescription', truncate: true },
    { label: 'Ahorro Anual', key: 'savingsAnual' },
    { label: 'Target 5S', key: 'target5s' },
    { label: 'N° Kaizen', key: 'numeroKaizen', type: 'number' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Proyectos Kaizen - {areaName?.toUpperCase() || 'Área no especificada'}
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

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {/* Campos del formulario */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              % Audit 5S
            </label>
            <input
              type="number"
              name="percentAudit5s"
              value={formData.percentAudit5s}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ideas Kaizen
            </label>
            <input
              type="number"
              name="kaizenIdeas"
              value={formData.kaizenIdeas}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ahorros
            </label>
            <input
              type="number"
              name="savings"
              value={formData.savings}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción del Proyecto
            </label>
            <textarea
              rows={4}
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción Anual
            </label>
            <textarea
              rows={4}
              name="anualProjectDescription"
              value={formData.anualProjectDescription}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ahorro Anual
            </label>
            <input
              type="text"
              name="savingsAnual"
              value={formData.savingsAnual}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target 5S
            </label>
            <input
              type="text"
              name="target5s"
              value={formData.target5s}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              N° Kaizen
            </label>
            <input
              type="number"
              name="numeroKaizen"
              value={formData.numeroKaizen}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              min="0"
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
            className={`px-6 py-2 text-white rounded-md ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Guardando...' : reportToEdit ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reportes existentes</h3>
        <ReportList
          areaId={areaId}
          onEdit={setReportToEdit}
          reportToEdit={reportToEdit}
          apiPath="/api/kaizen-reports"
          emptyMessage="No hay proyectos Kaizen registrados"
          fieldsConfig={reportFieldsConfig}
          reloadEvent="reloadKaizenReports"
          className="bg-gray-50 rounded-lg p-4"
        />
      </div>
    </div>
  );
}