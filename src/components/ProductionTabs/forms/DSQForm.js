'use client';

export default function DSQForm({ area }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Días sin Queja - {area.toUpperCase()}</h2>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Días consecutivos</label>
          <input
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Última queja</label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Actualizar Registro
      </button>
    </form>
  </div>
  );
}