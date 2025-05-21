'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportList from './ReportList';
import ReportCard from './ReportList/ReportCard';

export default function ProduccionForm({ areaId, areaName }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    maquina: '',
    numeroSap: '',
    produccionKm: '',
    produccionKg: '',
    kgScrap: '',
    percentScrap: '',
    oee: '',
    percentAvailability: '',
    percentPerformance: '',
    percentQuality: '',
    reventones: '',
    tiempoMuerto: '',
    kmReventon: '',
    scrapCu: '',
    scrapSn: '',
    scrapTotal: '',
    yield: '',
    yieldTotal: '',
    kmEnviadosRebobinados: '',
    kmRebobinados: '',
    targetOeeL5: '',
    targetScrapL5: '',
    comentariosOee: '',
    comentariosScrap: '',
    concatenado: '',
    validacion: ''
  });

  const [reports, setReports] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    { label: 'Máquina', key: 'maquinas' },
    { label: 'Producción Km', key: 'produccionKm' },
    { label: 'OEE', key: 'oee', render: (value) => `${value}%` },
    { label: 'Scrap', key: 'percentScrap', render: (value) => `${value}%` }
  ];

  // Cargar reportes al montar el componente
  useEffect(() => {
    if (areaId) {
      loadReports();
    }
  }, [areaId]);

  const loadReports = async () => {
    try {
      const response = await fetch(`/api/production-reports?areaId=${areaId}`);
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
      'produccionKm', 'produccionKg', 'kgScrap', 'percentScrap', 'oee',
      'percentAvailability', 'percentPerformance', 'percentQuality',
      'reventones', 'tiempoMuerto', 'kmReventon', 'scrapCu', 'scrapSn',
      'scrapTotal', 'yield', 'yieldTotal', 'kmEnviadosRebobinados',
      'kmRebobinados', 'targetOeeL5', 'targetScrapL5'
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
        fecha: `${formData.fecha}T00:00:00`
      };

      const url = reportToEdit 
        ? `/api/production-reports?id=${reportToEdit.id}`
        : '/api/production-reports';

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

      // Actualizar lista de reportes
      await loadReports();

      // Resetear formulario
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
    setFormData({
      fecha: report.fecha.split('T')[0],
      maquina: report.maquinas || '',
      numeroSap: report.numeroSap?.toString() || '',
      produccionKm: report.produccionKm?.toString() || '',
      produccionKg: report.produccionKg?.toString() || '',
      kgScrap: report.kgScrap?.toString() || '',
      percentScrap: report.percentScrap?.toString() || '',
      oee: report.oee?.toString() || '',
      percentAvailability: report.percentAvailability?.toString() || '',
      percentPerformance: report.percentPerformance?.toString() || '',
      percentQuality: report.percentQuality?.toString() || '',
      reventones: report.reventones?.toString() || '',
      tiempoMuerto: report.tiempoMuerto?.toString() || '',
      kmReventon: report.kmReventon?.toString() || '',
      scrapCu: report.scrapCu?.toString() || '',
      scrapSn: report.scrapSn?.toString() || '',
      scrapTotal: report.scrapTotal?.toString() || '',
      yield: report.yield?.toString() || '',
      yieldTotal: report.yieldTotal?.toString() || '',
      kmEnviadosRebobinados: report.kmEnviadosRebobinados?.toString() || '',
      kmRebobinados: report.kmRebobinados?.toString() || '',
      targetOeeL5: report.targetOeeL5?.toString() || '',
      targetScrapL5: report.targetScrapL5?.toString() || '',
      comentariosOee: report.comentariosOee || '',
      comentariosScrap: report.comentariosScrap || '',
      concatenado: report.concatenado || '',
      validacion: report.validacion || ''
    });
    
    // Scroll al formulario
    document.getElementById('produccion-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      maquina: '',
      numeroSap: '',
      produccionKm: '',
      produccionKg: '',
      kgScrap: '',
      percentScrap: '',
      oee: '',
      percentAvailability: '',
      percentPerformance: '',
      percentQuality: '',
      reventones: '',
      tiempoMuerto: '',
      kmReventon: '',
      scrapCu: '',
      scrapSn: '',
      scrapTotal: '',
      yield: '',
      yieldTotal: '',
      kmEnviadosRebobinados: '',
      kmRebobinados: '',
      targetOeeL5: '',
      targetScrapL5: '',
      comentariosOee: '',
      comentariosScrap: '',
      concatenado: '',
      validacion: ''
    });
    setReportToEdit(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Reporte de Producción - {areaName?.toUpperCase() || 'Área no especificada'}
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
        id="produccion-form" 
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
          
          {/* Máquina */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Máquina
            </label>
            <input
              type="text"
              name="maquina"
              value={formData.maquina}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Número SAP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número SAP {areaName?.toUpperCase()}
            </label>
            <input
              type="text"
              name="numeroSap"
              value={formData.numeroSap}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Producción Km */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producción Km {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="produccionKm"
              value={formData.produccionKm}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Producción Kg */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producción Kg {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="produccionKg"
              value={formData.produccionKg}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Kg Scrap */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kg Scrap {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="kgScrap"
              value={formData.kgScrap}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* % Scrap */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              % Scrap {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="percentScrap"
              value={formData.percentScrap}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* OEE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OEE {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="oee"
              value={formData.oee}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* % Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              % Availability
            </label>
            <input
              type="number"
              name="percentAvailability"
              value={formData.percentAvailability}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* % Performance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              % Performance
            </label>
            <input
              type="number"
              name="percentPerformance"
              value={formData.percentPerformance}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* % Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              % Quality
            </label>
            <input
              type="number"
              name="percentQuality"
              value={formData.percentQuality}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* Reventones */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reventones {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="reventones"
              value={formData.reventones}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Tiempo Muerto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiempo Muerto
            </label>
            <input
              type="number"
              name="tiempoMuerto"
              value={formData.tiempoMuerto}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Km/Reventón */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Km/Reventón
            </label>
            <input
              type="number"
              name="kmReventon"
              value={formData.kmReventon}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Scrap Cu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scrap Cu
            </label>
            <input
              type="number"
              name="scrapCu"
              value={formData.scrapCu}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Scrap Sn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scrap Sn
            </label>
            <input
              type="number"
              name="scrapSn"
              value={formData.scrapSn}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Scrap Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scrap Total
            </label>
            <input
              type="number"
              name="scrapTotal"
              value={formData.scrapTotal}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Yield */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yield
            </label>
            <input
              type="number"
              name="yield"
              value={formData.yield}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
               step="0.001"  // ← Permite 3 decimales
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Yield Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yield Total
            </label>
            <input
              type="number"
              name="yieldTotal"
              value={formData.yieldTotal}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Km Enviados a Rebobinado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Km Enviados a Rebobinado {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="kmEnviadosRebobinados"
              value={formData.kmEnviadosRebobinados}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Km Rebobinados */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Km Rebobinados {areaName?.toUpperCase()}
            </label>
            <input
              type="number"
              name="kmRebobinados"
              value={formData.kmRebobinados}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Target OEE L5 L15 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target OEE L5 L15
            </label>
            <input
              type="number"
              name="targetOeeL5"
              value={formData.targetOeeL5}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* Target Scrap L5 L15 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Scrap L5 L15
            </label>
            <input
              type="number"
              name="targetScrapL5"
              value={formData.targetScrapL5}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
          </div>

          {/* Comentarios OEE */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Comentarios OEE
            </label>
            <textarea
              name="comentariosOee"
              value={formData.comentariosOee}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Comentarios Scrap */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Comentarios Scrap
            </label>
            <textarea
              name="comentariosScrap"
              value={formData.comentariosScrap}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Concatenado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Concatenado
            </label>
            <input
              type="text"
              name="concatenado"
              value={formData.concatenado}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Validación */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Validación
            </label>
            <input
              type="text"
              name="validacion"
              value={formData.validacion}
              onChange={handleChange}
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
        apiPath="/api/production-reports"
        emptyMessage="No hay reportes de producción disponibles"
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  );
}