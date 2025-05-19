'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReportList from './ReportList'
import ReportCard from './ReportList/ReportCard'

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // Si ya está en formato YYYY-MM-DD (como viene del input date)
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Si es un string con hora (ISO format)
  if (typeof dateString === 'string' && dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  // Si es un objeto Date o timestamp
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default function RHForm({ areaId, areaName }) {
  const initialFormData = {
    fecha: formatDateForInput(new Date()),
    hrAbsenteeims: 0,
    hrInability: 0,
    hrTurnover: 0
  }

  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [reportToEdit, setReportToEdit] = useState(null)
  const router = useRouter()

  const resetForm = () => {
    setFormData(initialFormData)
    setReportToEdit(null)
    setError('')
    setSuccess('')
  }

  useEffect(() => {
    if (reportToEdit) {
      setFormData({
        fecha: formatDateForInput(reportToEdit.fecha),
        hrAbsenteeims: reportToEdit.hrAbsenteeims || 0,
        hrInability: reportToEdit.hrInability || 0,
        hrTurnover: reportToEdit.hrTurnover || 0
      })
    }
  }, [reportToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('fecha') 
        ? value 
        : Math.max(0, Number(value))
    }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.fecha) errors.push('Fecha es requerida')
    if (formData.hrAbsenteeims < 0) errors.push('Absentismo no puede ser negativo')
    if (formData.hrInability < 0) errors.push('Incapacidad no puede ser negativa')
    if (formData.hrTurnover < 0) errors.push('Rotación no puede ser negativa')
    if (!areaId) errors.push('Área no especificada')
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const errors = validateForm()
    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        areaId: Number(areaId),
        fecha: formData.fecha,
        hrAbsenteeims: formData.hrAbsenteeims,
        hrInability: formData.hrInability,
        hrTurnover: formData.hrTurnover
      }

      const url = reportToEdit 
        ? `/api/rh-reports?id=${reportToEdit.id}`
        : '/api/rh-reports'

      const method = reportToEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${reportToEdit ? 'actualizando' : 'creando'} reporte`)
      }

      resetForm()
      setSuccess(`Reporte ${reportToEdit ? 'actualizado' : 'guardado'} exitosamente!`)
      router.refresh()

    } catch (error) {
      console.error('Error:', error)
      setError(error.message || 'Error al procesar la solicitud')
      
      if (reportToEdit) {
        setFormData({
          fecha: formatDateForInput(reportToEdit.fecha),
          hrAbsenteeims: reportToEdit.hrAbsenteeims || 0,
          hrInability: reportToEdit.hrInability || 0,
          hrTurnover: reportToEdit.hrTurnover || 0
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReport = (report) => {
    setReportToEdit(report)
    document.getElementById('rh-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const reportFieldsConfig = [
   { 
    label: 'Fecha', 
    key: 'fecha',
    type: 'date',
    render: (value) => {
      // Formato consistente para la card
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    }
  },
    { 
      label: 'HR Absenteeims', 
      key: 'hrAbsenteeims',
      className: 'text-center font-medium'
    },
    { 
      label: 'HR Inability', 
      key: 'hrInability',
      className: 'text-center font-medium'
    },
    { 
      label: 'HR Turnover', 
      key: 'hrTurnover',
      className: 'text-center font-medium'
    }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Recursos Humanos - {areaName}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ {success}</div>}

      <form id="rh-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">HR Absenteeims *</label>
            <input
              type="number"
              name="hrAbsenteeims"
              value={formData.hrAbsenteeims}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">HR Inability</label>
            <input
              type="number"
              name="hrInability"
              value={formData.hrInability}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">HR Turnover</label>
            <input
              type="number"
              name="hrTurnover"
              value={formData.hrTurnover}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar Edición
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {reportToEdit ? 'Actualizando...' : 'Guardando...'}
              </span>
            ) : reportToEdit ? 'Actualizar Reporte' : 'Guardar Reporte'}
          </button>
        </div>
      </form>

      <ReportList
        areaId={areaId}
        onEdit={handleEditReport}
        reportToEdit={reportToEdit}
        apiPath="/api/rh-reports"
        emptyMessage="No hay reportes de RH disponibles"
        fieldsConfig={reportFieldsConfig}
        cardComponent={ReportCard}
      />
    </div>
  )
}