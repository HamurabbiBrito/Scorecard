'use client';

export default function ProduccionForm({ area }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Reporte de Producción - {area.toUpperCase()}</h2>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div>
    <label className="block text-sm font-medium text-gray-700">Date</label>
    <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Area</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Maquina</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Numero SAP {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Produccion Km {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Produccion kg {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Kg scrap {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Percent Scrap {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700"> OEE {area.toUpperCase()}</label> 
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Percent Availability</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Percent Performance</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Percent Quality</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Reventones {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Tiempo Muerto</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Km/reventon</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">SCRAP CU</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">SCRAP SN</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">SCRAP TOTAL</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">YIELD</label>
    <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">TIELD TOTAL</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">KM Enviados a rebobinado {area.toUpperCase()}</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">km rebobinados {area.toUpperCase()}</label>
    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Target OEE L5 L15</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Target scrap L5 L15</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Comentarios OEE</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Comentarios scrap</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Concatenate</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Validacion</label>
    <input type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
  </div>
 
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Registrar Producción
      </button>
    </form>
  </div>
  );
}