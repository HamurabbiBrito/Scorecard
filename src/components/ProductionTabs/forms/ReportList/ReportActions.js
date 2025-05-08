'use client';

export default function ReportActions({
  onReload,
  onAddNew,
  loading = false
}) {
  return (
    <div className="flex space-x-3 mb-4">
      <button
        onClick={onReload}
        disabled={loading}
        className={`px-4 py-2 rounded-md ${
          loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {loading ? 'Cargando...' : 'Recargar reportes'}
      </button>
      <button
        onClick={onAddNew}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        + Nuevo Reporte
      </button>
    </div>
  );
}