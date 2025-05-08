'use client';

export default function ReportFilter({
  visible,
  dateRange,
  onDateChange,
  onApply,
  onClear
}) {
  if (!visible) return null;

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-3">Filtrar por fecha</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha inicial
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateChange({...dateRange, start: e.target.value})}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            max={dateRange.end || new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha final
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateChange({...dateRange, end: e.target.value})}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            min={dateRange.start}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="flex justify-end mt-3 space-x-3">
        <button
          onClick={onClear}
          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
        >
          Limpiar filtros
        </button>
        <button
          onClick={onApply}
          className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Aplicar filtro
        </button>
      </div>
    </div>
  );
}