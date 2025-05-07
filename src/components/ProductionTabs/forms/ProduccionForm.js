'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProduccionForm({ areaId, areaName }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    maquina: '',
    numeroSap: '',
    produccionKm: 0,
    produccionKg: 0,
    kgScrap: 0,
    percentScrap: 0,
    oee: 0,
    percentAvailability: 0,
    percentPerformance: 0,
    percentQuality: 0,
    reventones: 0,
    tiempoMuerto: 0,
    kmReventon: 0,
    scrapCu: 0,
    scrapSn: 0,
    scrapTotal: 0,
    yield: 0,
    yieldTotal: 0,
    kmEnviadosRebobinados: 0,
    kmRebobinados: 0,
    targetOeeL5: 0,
    targetScrapL5: 0,
    comentariosOee: '',
    comentariosScrap: '',
    concatenado: '',
    validacion: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('percent') || 
              name.startsWith('target') || 
              ['oee', 'produccionKm', 'produccionKg', 'kgScrap', 'kmReventon', 
               'scrapCu', 'scrapSn', 'scrapTotal', 'yield', 'yieldTotal',
               'kmEnviadosRebobinados', 'kmRebobinados', 'reventones',
               'tiempoMuerto', 'percentAvailability', 'percentPerformance',
               'percentQuality'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/production-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          areaId: Number(areaId),
          fecha: new Date(`${formData.fecha}T00:00:00Z`).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el reporte');
      }

      setSuccess('Reporte de producción guardado exitosamente!');
      setTimeout(() => {
        setSuccess('');
        router.refresh();
      }, 3000);
      
      // Reset form after successful submission
      setFormData({
        ...formData,
        fecha: new Date().toISOString().split('T')[0],
        maquina: '',
        numeroSap: '',
        produccionKm: 0,
        produccionKg: 0,
        kgScrap: 0,
        percentScrap: 0,
        oee: 0,
        percentAvailability: 0,
        percentPerformance: 0,
        percentQuality: 0,
        reventones: 0,
        tiempoMuerto: 0,
        kmReventon: 0,
        scrapCu: 0,
        scrapSn: 0,
        scrapTotal: 0,
        yield: 0,
        yieldTotal: 0,
        kmEnviadosRebobinados: 0,
        kmRebobinados: 0,
        comentariosOee: '',
        comentariosScrap: ''
      });

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al guardar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Reporte de Producción - {areaName?.toUpperCase() || 'Área no especificada'}</h2>
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
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
            <label className="block text-sm font-medium text-gray-700">Máquina</label>
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
            <label className="block text-sm font-medium text-gray-700">Número SAP {areaName?.toUpperCase()}</label>
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
            <label className="block text-sm font-medium text-gray-700">Producción Km {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="produccionKm"
              value={formData.produccionKm}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Producción Kg */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Producción Kg {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="produccionKg"
              value={formData.produccionKg}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Kg Scrap */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Kg scrap {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="kgScrap"
              value={formData.kgScrap}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* % Scrap */}
          <div>
            <label className="block text-sm font-medium text-gray-700">% Scrap {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="percentScrap"
              value={formData.percentScrap}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* OEE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">OEE {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="oee"
              value={formData.oee}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* % Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">% Availability</label>
            <input
              type="number"
              name="percentAvailability"
              value={formData.percentAvailability}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* % Performance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">% Performance</label>
            <input
              type="number"
              name="percentPerformance"
              value={formData.percentPerformance}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* % Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">% Quality</label>
            <input
              type="number"
              name="percentQuality"
              value={formData.percentQuality}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Reventones */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reventones {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="reventones"
              value={formData.reventones}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Tiempo Muerto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiempo Muerto</label>
            <input
              type="number"
              name="tiempoMuerto"
              value={formData.tiempoMuerto}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Km/Reventón */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Km/reventón</label>
            <input
              type="number"
              name="kmReventon"
              value={formData.kmReventon}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* SCRAP CU */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SCRAP CU</label>
            <input
              type="number"
              name="scrapCu"
              value={formData.scrapCu}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* SCRAP SN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SCRAP SN</label>
            <input
              type="number"
              name="scrapSn"
              value={formData.scrapSn}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* SCRAP TOTAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SCRAP TOTAL</label>
            <input
              type="number"
              name="scrapTotal"
              value={formData.scrapTotal}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* YIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">YIELD</label>
            <input
              type="number"
              name="yield"
              value={formData.yield}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* YIELD TOTAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">YIELD TOTAL</label>
            <input
              type="number"
              name="yieldTotal"
              value={formData.yieldTotal}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* KM Enviados a rebobinado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">KM Enviados a rebobinado {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="kmEnviadosRebobinados"
              value={formData.kmEnviadosRebobinados}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* km rebobinados */}
          <div>
            <label className="block text-sm font-medium text-gray-700">km rebobinados {areaName?.toUpperCase()}</label>
            <input
              type="number"
              name="kmRebobinados"
              value={formData.kmRebobinados}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Target OEE L5 L15 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target OEE L5 L15</label>
            <input
              type="number"
              name="targetOeeL5"
              value={formData.targetOeeL5}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Target scrap L5 L15 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target scrap L5 L15</label>
            <input
              type="number"
              name="targetScrapL5"
              value={formData.targetScrapL5}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Comentarios OEE */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Comentarios OEE</label>
            <textarea
              name="comentariosOee"
              value={formData.comentariosOee}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Comentarios scrap */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Comentarios scrap</label>
            <textarea
              name="comentariosScrap"
              value={formData.comentariosScrap}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Concatenate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Concatenate</label>
            <input
              type="text"
              name="concatenado"
              value={formData.concatenado}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Validacion */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Validacion</label>
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

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : 'Registrar Producción'}
          </button>
        </div>
      </form>
    </div>
  );
}