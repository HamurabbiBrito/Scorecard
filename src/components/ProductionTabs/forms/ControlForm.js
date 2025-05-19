'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

export default function ControlForm({ areaId, areaName }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    dlp: '',
    capacityUtilization: '',
    dlpBattery: '',
    capacityUtilizationBattery: '',
    variationsInventoryCobreUSD: '',
    variationsInventoryCobreKg: '',
    variationsInventoryCompuestoUSD: '',
    variationsInventoryCompuestoKg: '',
    variationsInventoryCableUSD: '',
    variationsInventoryCableKg: '',
    dlpSemana: '',
    dlpSemanaMaterial: '',
    metaMensual: '',
    metaMensualBateria: '',
    impactoDlpUSD: '',
    impactoDlpUSDBateria: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);

  // Configuración para ReportList
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
      label: 'DLP', 
      key: 'dlp',
      className: 'font-medium'
    },
    { 
      label: 'Capacity', 
      key: 'capacityUtilization',
      render: (value) => `${value}%`
    },
    { 
      label: 'DLP Battery', 
      key: 'dlpBattery'
    },
    { 
      label: 'Capacity Battery', 
      key: 'capacityUtilizationBattery',
      render: (value) => `${value}%`
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
      const response = await fetch(`/api/control-reports?areaId=${areaId}`);
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
    
    // Validar campos numéricos
    const numericFields = [
      'dlp', 'capacityUtilization', 'dlpBattery', 'capacityUtilizationBattery',
      'variationsInventoryCobreUSD', 'variationsInventoryCobreKg',
      'variationsInventoryCompuestoUSD', 'variationsInventoryCompuestoKg',
      'variationsInventoryCableUSD', 'variationsInventoryCableKg',
      'dlpSemana', 'dlpSemanaMaterial', 'metaMensual', 'metaMensualBateria',
      'impactoDlpUSD', 'impactoDlpUSDBateria'
    ];
    
    numericFields.forEach(field => {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        errors.push(`${field} debe ser un número válido`);
      }
    });
    
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
      fecha: `${formData.fecha}T00:00:00`,
      impactoDlpEnUsd: parseFloat(formData.impactoDlpUSD) || 0,
      impactoDlpEnUsdBateria: parseFloat(formData.impactoDlpUSDBateria) || 0
    };

    // Eliminar las propiedades antiguas
    delete payload.impactoDlpUSD;
    delete payload.impactoDlpUSDBateria;

    const url = reportToEdit 
      ? `/api/control-reports?id=${reportToEdit.id}`
      : '/api/control-reports';

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

    await loadReports();
    resetForm();
    setSuccess(reportToEdit ? 'Reporte actualizado exitosamente!' : 'Reporte registrado exitosamente!');
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
  
  // Función segura para convertir a string con valor por defecto
  const safeToString = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue;
    return value.toString();
  };

  setFormData({
    fecha: report.fecha?.split('T')[0] || '',
    dlp: safeToString(report.dlp),
    capacityUtilization: safeToString(report.capacityUtilization),
    dlpBattery: safeToString(report.dlpBattery),
    capacityUtilizationBattery: safeToString(report.capacityUtilizationBattery),
    variationsInventoryCobreUSD: safeToString(report.variationsInventoryCobreUSD),
    variationsInventoryCobreKg: safeToString(report.variationsInventoryCobreKg),
    variationsInventoryCompuestoUSD: safeToString(report.variationsInventoryCompuestoUSD),
    variationsInventoryCompuestoKg: safeToString(report.variationsInventoryCompuestoKg),
    variationsInventoryCableUSD: safeToString(report.variationsInventoryCableUSD),
    variationsInventoryCableKg: safeToString(report.variationsInventoryCableKg),
    dlpSemana: safeToString(report.dlpSemana),
    dlpSemanaMaterial: safeToString(report.dlpSemanaMaterial),
    metaMensual: safeToString(report.metaMensual),
    metaMensualBateria: safeToString(report.metaMensualBateria),
    // Asegúrate de usar los nombres exactos que vienen de la API
    impactoDlpUSD: safeToString(report.impactoDlpEnUsd), // Nombre correcto de la API
    impactoDlpUSDBateria: safeToString(report.impactoDlpEnUsdBateria) // Nombre correcto de la API
  });

  document.getElementById('control-form')?.scrollIntoView({ behavior: 'smooth' });
};

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      dlp: '',
      capacityUtilization: '',
      dlpBattery: '',
      capacityUtilizationBattery: '',
      variationsInventoryCobreUSD: '',
      variationsInventoryCobreKg: '',
      variationsInventoryCompuestoUSD: '',
      variationsInventoryCompuestoKg: '',
      variationsInventoryCableUSD: '',
      variationsInventoryCableKg: '',
      dlpSemana: '',
      dlpSemanaMaterial: '',
      metaMensual: '',
      metaMensualBateria: '',
      impactoDlpUSD: '',
      impactoDlpUSDBateria: ''
    });
    setReportToEdit(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Control de Producción - {areaName?.toUpperCase() || 'Área no especificada'}
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
        id="control-form" 
        onSubmit={handleSubmit} 
        className="space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fecha */}
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
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* DLP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DLP {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="dlp"
              value={formData.dlp}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
              step="0.01"
            />
          </div>
          
          {/* Capacity Utilization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacity Utilization {areaName?.toUpperCase()} (%)
            </label>
            <input
              type="number"
              name="capacityUtilization"
              value={formData.capacityUtilization}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          {/* DLP Battery */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DLP Battery
            </label>
            <input
              type="number"
              name="dlpBattery"
              value={formData.dlpBattery}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Capacity Utilization Battery */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacity Utilization Battery (%)
            </label>
            <input
              type="number"
              name="capacityUtilizationBattery"
              value={formData.capacityUtilizationBattery}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          {/* Variations Inventory Cobre USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Cobre (USD)
            </label>
            <input
              type="number"
              name="variationsInventoryCobreUSD"
              value={formData.variationsInventoryCobreUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Variations Inventory Cobre Kg */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Cobre (Kg)
            </label>
            <input
              type="number"
              name="variationsInventoryCobreKg"
              value={formData.variationsInventoryCobreKg}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Variations Inventory Compuesto USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Compuesto (USD)
            </label>
            <input
              type="number"
              name="variationsInventoryCompuestoUSD"
              value={formData.variationsInventoryCompuestoUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Variations Inventory Compuesto Kg */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Compuesto (Kg)
            </label>
            <input
              type="number"
              name="variationsInventoryCompuestoKg"
              value={formData.variationsInventoryCompuestoKg}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Variations Inventory Cable USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Cable (USD)
            </label>
            <input
              type="number"
              name="variationsInventoryCableUSD"
              value={formData.variationsInventoryCableUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Variations Inventory Cable Kg */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variaciones Inventario Cable (Kg)
            </label>
            <input
              type="number"
              name="variationsInventoryCableKg"
              value={formData.variationsInventoryCableKg}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* DLP Semana */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DLP Semana
            </label>
            <input
              type="number"
              name="dlpSemana"
              value={formData.dlpSemana}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* DLP Semana Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DLP Semana Material
            </label>
            <input
              type="number"
              name="dlpSemanaMaterial"
              value={formData.dlpSemanaMaterial}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Meta Mensual */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Mensual
            </label>
            <input
              type="number"
              name="metaMensual"
              value={formData.metaMensual}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Meta Mensual Bateria */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Mensual Bateria
            </label>
            <input
              type="number"
              name="metaMensualBateria"
              value={formData.metaMensualBateria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Impacto DLP USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Impacto DLP (USD)
            </label>
            <input
              type="number"
              name="impactoDlpUSD"
              value={formData.impactoDlpUSD}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>

          {/* Impacto DLP USD Bateria */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Impacto DLP Bateria (USD)
            </label>
            <input
              type="number"
              name="impactoDlpUSDBateria"
              value={formData.impactoDlpUSDBateria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              step="0.01"
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
              : reportToEdit ? 'Actualizar Reporte' : 'Registrar Reporte'}
          </button>
        </div>
      </form>

      <ReportList
        areaId={areaId}
        onEdit={handleEditReport}
        reportToEdit={reportToEdit}
        apiPath="/api/control-reports"
        emptyMessage="No hay reportes de control disponibles"
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  );
}