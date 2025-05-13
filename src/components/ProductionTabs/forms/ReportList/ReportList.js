'use client';
import { useState, useEffect } from 'react';
import ReportCard from './ReportCard';

export default function ReportList({
  areaId,
  onEdit,
  reportToEdit,
  apiPath = '/api/accidents',
  emptyMessage = 'No hay reportes disponibles',
  fieldsConfig = [], // Asegúrate de tener un valor por defecto
  customRenderers = {},
  cardComponent: CardComponent = ReportCard
}) {
  const [availableReports, setAvailableReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Cargar reportes
  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiPath}?areaId=${areaId}`);
      if (!response.ok) throw new Error('Error al cargar reportes');
      const { data } = await response.json();
      setAvailableReports(data || []);
      setFilteredReports(data || []);
      setShowDateFilter(true);
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtro por fechas
  const applyDateFilter = () => {
    if (!dateRange.start || !dateRange.end) {
      setFilteredReports(availableReports);
      return;
    }

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    
    setFilteredReports(availableReports.filter(report => {
      const reportDate = new Date(report.fecha);
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

      {/* Filtro por fechas */}
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
              onClick={clearFilters}
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
              customRenderers={customRenderers}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
} 