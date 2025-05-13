'use client';
import { useState, useEffect } from 'react';
import ReportCard from './ReportCard';
import ReportFilter from './ReportFilter';

export default function ReportList({
  areaId,
  onEdit,
  reportToEdit,
  apiPath = '/api/quejas-reports',
  emptyMessage = 'No hay reportes disponibles',
  fieldsConfig = [],
  cardComponent: CardComponent = ReportCard,
  isDSQForm = false
}) {
  const [availableReports, setAvailableReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Cargar reportes
  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiPath}?areaId=${areaId}`);
      if (!response.ok) throw new Error('Error al cargar reportes');
      const data = await response.json();
      
      // Manejar tanto el formato { data } como el array directo
      const reports = data.data || data;
      setAvailableReports(reports || []);
      setFilteredReports(reports || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtro por fechas (compatible con DSQForm y otros)
  const applyDateFilter = () => {
    if (!dateRange.start || !dateRange.end) {
      setFilteredReports(availableReports);
      return;
    }

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999); // Incluir todo el día final
    
    setFilteredReports(availableReports.filter(report => {
      // Campo de fecha puede ser 'fecha' o 'fechaQueja' según el formulario
      const fechaReporte = isDSQForm ? report.fechaQueja : report.fecha;
      if (!fechaReporte) return false;
      
      const reportDate = new Date(fechaReporte);
      return reportDate >= start && reportDate <= end;
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setFilteredReports(availableReports);
  };

  useEffect(() => {
    if (areaId) loadReports();
  }, [areaId]);

  // Aplicar filtro automáticamente cuando cambia el rango de fechas
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      applyDateFilter();
    }
  }, [dateRange]);

  return (
    <div className="mt-8">
      <button
        onClick={loadReports}
        disabled={loading}
        className={`mb-4 px-4 py-2 rounded-md ${loading 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        {loading ? 'Cargando...' : 
         availableReports.length ? 'Recargar reportes' : 'Ver reportes existentes'}
      </button>

      {/* Componente ReportFilter */}
      <ReportFilter
        visible={availableReports.length > 0}
        dateRange={dateRange}
        onDateChange={setDateRange}
        onApply={applyDateFilter}
        onClear={clearFilters}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => (
            <CardComponent 
              key={report.id}
              report={report}
              onEdit={onEdit}
              isEditing={reportToEdit?.id === report.id}
              fieldsConfig={fieldsConfig}
              isDSQForm={isDSQForm}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          {loading ? 'Cargando...' : emptyMessage}
        </div>
      )}
    </div>
  );
}