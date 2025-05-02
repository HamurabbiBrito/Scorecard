'use client';

export default function ControlForm({ area }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Control de Producción - {area.toUpperCase()}</h2>
        <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Date</label>
    <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">DLP {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Capacity Utilization {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">DLP Battery</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Capacity Utilization Battery</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario Cobre USD</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario Cobre KG</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario Compuesto USD</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario Compuesto Kg</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario cable USD</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Variaciones de inventario cable Kg</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">DLP Semanal {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">DLP Semanal material</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Meta mensual {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Meta mensual bateria</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Impacto de dlp en usd {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Impacto de dlp en usd bateria</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
</div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Control
          </button>
        </form>
      </div>
  );
}