'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AccidentesForm() {
  // Hooks de routing
  const router = useRouter();
  const params = useParams();
  const areaSlug = params?.area;
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cantidadAccidentes: 0,
    cantidadCuasiAccidentes: 0,
    diasUltimoAccidente: 0
  });

  // Estados de UI y carga
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados de datos
  const [areaInfo, setAreaInfo] = useState(null);
  const [availableReports, setAvailableReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  
  // Estados de edición
  const [reportToEdit, setReportToEdit] = useState(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  
  // Estados de filtrado
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Obtener información del área al cargar
  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const response = await fetch(`/api/areas/${areaSlug}`);
        if (!response.ok) throw new Error('Área no encontrada');
        const data = await response.json();
        setAreaInfo(data);
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage(`Error cargando área: ${error.message}`);
        setTimeout(() => router.push('/production'), 3000);
      }
    };

    if (areaSlug) fetchAreaData();
  }, [areaSlug, router]);

  // Sincronizar reportes filtrados
  useEffect(() => {
    setFilteredReports(availableReports);
  }, [availableReports]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cantidad') ? Math.max(0, Number(value)) : value
    }));
  };

  // Validar formulario
  const validateForm = (data) => {
    const errors = [];
    if (!data.fecha) errors.push('La fecha es requerida');
    if (isNaN(new Date(data.fecha))) errors.push('Fecha no válida');
    if (data.cantidadAccidentes < 0) errors.push('Accidentes no puede ser negativo');
    if (data.cantidadCuasiAccidentes < 0) errors.push('Cuasi accidentes no puede ser negativo');
    if (data.diasUltimoAccidente < 0) errors.push('Días sin accidente no puede ser negativo');
    return errors;
  };

  // Enviar nuevo reporte
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

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

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error al guardar');

      // Reset después de éxito
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        cantidadAccidentes: 0,
        cantidadCuasiAccidentes: 0,
        diasUltimoAccidente: 0
      });
      setSuccessMessage('Reporte guardado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cargar reportes para edición
  const loadReportsForEditing = async () => {
    try {
      const response = await fetch(`/api/accidents?areaId=${areaInfo.id}`);
      if (!response.ok) throw new Error('Error al cargar reportes');
      const result = await response.json();
      setAvailableReports(result.data || []);
      setFilteredReports(result.data || []);
      setShowEditOptions(true);
      setShowDateFilter(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    }
  };

  // Preparar reporte para edición
  const handleEdit = (report) => {
    setReportToEdit({
      ...report,
      fecha: report.fecha.split('T')[0]
    });
  };

  // Actualizar reporte existente
  const handleUpdate = async (e) => {
    e.preventDefault();
    const errors = validateForm(reportToEdit);
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/accidents/${reportToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportToEdit,
          fecha: new Date(reportToEdit.fecha).toISOString(),
          areaId: areaInfo.id
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error al actualizar');

      setSuccessMessage('Reporte actualizado exitosamente!');
      setReportToEdit(null);
      loadReportsForEditing();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aplicar filtro por fechas
  const applyDateFilter = () => {
    if (!dateRange.start || !dateRange.end) {
      setFilteredReports(availableReports);
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const filtered = availableReports.filter(report => {
      const reportDate = new Date(report.fecha);
      return reportDate >= startDate && reportDate <= endDate;
    });

    setFilteredReports(filtered);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
    return adjustedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Loading state
  if (!areaInfo) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando información del área...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Reporte de Accidentes - {areaInfo.nombre}
      </h2>

      {/* Mensajes de estado */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Formulario principal */}
      <form onSubmit={reportToEdit ? handleUpdate : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={reportToEdit?.fecha || formData.fecha}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, fecha: e.target.value})
                : handleChange(e)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Accidentes</label>
            <input
              type="number"
              name="cantidadAccidentes"
              value={reportToEdit?.cantidadAccidentes || formData.cantidadAccidentes}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, cantidadAccidentes: Math.max(0, Number(e.target.value))})
                : handleChange(e)
              }
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cuasi Accidentes</label>
            <input
              type="number"
              name="cantidadCuasiAccidentes"
              value={reportToEdit?.cantidadCuasiAccidentes || formData.cantidadCuasiAccidentes}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, cantidadCuasiAccidentes: Math.max(0, Number(e.target.value))})
                : handleChange(e)
              }
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Días sin Accidentes</label>
            <input
              type="number"
              name="diasUltimoAccidente"
              value={reportToEdit?.diasUltimoAccidente || formData.diasUltimoAccidente}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, diasUltimoAccidente: Math.max(0, Number(e.target.value))})
                : handleChange(e)
              }
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={() => setReportToEdit(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Guardando...' : reportToEdit ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      {/* Sección de reportes existentes */}
      <div className="mt-8">
        <button
          onClick={loadReportsForEditing}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          {availableReports.length > 0 ? 'Recargar reportes' : 'Ver reportes existentes'}
        </button>

        {/* Filtro por rango de fechas */}
        {showDateFilter && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-3">Filtrar por fecha</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicial</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  max={dateRange.end || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha final</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min={dateRange.start}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="flex justify-end mt-3 space-x-3">
              <button
                onClick={() => {
                  setDateRange({ start: '', end: '' });
                  setFilteredReports(availableReports);
                }}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                Limpiar filtros
              </button>
              <button
                onClick={applyDateFilter}
                className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Aplicar filtro
              </button>
            </div>
          </div>
        )}

        {/* Lista de reportes */}
        {filteredReports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map(report => (
              <div key={report.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">
                    {formatDate(report.fecha)}
                  </h3>
                  <button 
                    onClick={() => handleEdit(report)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                </div>
                
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accidentes:</span>
                    <span className="font-medium">{report.cantidadAccidentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuasi accidentes:</span>
                    <span className="font-medium">{report.cantidadCuasiAccidentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Días sin accidentes:</span>
                    <span className="font-medium">{report.diasUltimoAccidente}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}