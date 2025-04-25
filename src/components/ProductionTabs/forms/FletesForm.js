'use client';

export default function FletesForm({ area }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Fletes Especiales - {area.toUpperCase()}</h2>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Special freight {area.toUpperCase()}</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Special freight customer {area.toUpperCase()}</label>
          <input
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Registrar Flete
      </button>
    </form>
  </div>
  );
}