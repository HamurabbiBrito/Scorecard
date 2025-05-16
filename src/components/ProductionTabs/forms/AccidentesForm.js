'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReportList from './ReportList'

export default function AccidentesForm() {
  const router = useRouter()
  const params = useParams()
  const areaSlug = params?.area
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cantidadAccidentes: 0,
    cantidadCuasiAccidentes: 0,
    diasUltimoAccidente: 0
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [areaInfo, setAreaInfo] = useState(null)
  const [reportToEdit, setReportToEdit] = useState(null)
  const [loadingDays, setLoadingDays] = useState(false)

  const accidentFieldConfig = [
    { label: 'Fecha', key: 'fecha', type: 'date' },
    { label: 'Accidentes', key: 'cantidadAccidentes', type: 'number' },
    { label: 'Cuasi accidentes', key: 'cantidadCuasiAccidentes', type: 'number' },
    { label: 'Días sin accidentes', key: 'diasUltimoAccidente', type: 'number', readOnly: true }
  ]

  // Obtener información del área
  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const response = await fetch(`/api/areas/${areaSlug}`)
        if (!response.ok) throw new Error('Área no encontrada')
        const data = await response.json()
        setAreaInfo(data)
      } catch (error) {
        console.error('Error:', error)
        setErrorMessage(`Error cargando área: ${error.message}`)
        setTimeout(() => router.push('/production'), 3000)
      }
    }

    if (areaSlug) fetchAreaData()
  }, [areaSlug, router])

  // Calcular días desde último accidente
  useEffect(() => {
    if (!areaInfo?.id) return

    const calculateDaysSinceLast = async () => {
      setLoadingDays(true)
      try {
        const currentDate = reportToEdit?.fecha || formData.fecha
        const response = await fetch(
          `/api/accidents?areaId=${areaInfo.id}&beforeDate=${currentDate}`
        )
        
        if (!response.ok) throw new Error('Error al calcular días')
        
        const { daysSinceLast } = await response.json()
        
        if (reportToEdit) {
          setReportToEdit(prev => ({
            ...prev,
            diasUltimoAccidente: daysSinceLast || 0
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            diasUltimoAccidente: daysSinceLast || 0
          }))
        }
      } catch (error) {
        console.error('Error calculando días:', error)
        setErrorMessage('Error al calcular días desde último accidente')
        setTimeout(() => setErrorMessage(''), 5000)
      } finally {
        setLoadingDays(false)
      }
    }

    calculateDaysSinceLast()
  }, [areaInfo?.id, formData.fecha, reportToEdit?.id]) // Usamos reportToEdit?.id como dependencia estable

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cantidad') ? Math.max(0, Number(value)) : value
    }))
  }

  const validateForm = (data) => {
    const errors = []
    if (!data.fecha) errors.push('La fecha es requerida')
    if (isNaN(new Date(data.fecha))) errors.push('Fecha no válida')
    if (data.cantidadAccidentes < 0) errors.push('Accidentes no puede ser negativo')
    if (data.cantidadCuasiAccidentes < 0) errors.push('Cuasi accidentes no puede ser negativo')
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm(formData)
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '))
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/accidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: formData.fecha,
          areaId: areaInfo.id,
          cantidadAccidentes: Number(formData.cantidadAccidentes),
          cantidadCuasiAccidentes: Number(formData.cantidadCuasiAccidentes)
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Error al guardar')

      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        cantidadAccidentes: 0,
        cantidadCuasiAccidentes: 0,
        diasUltimoAccidente: 0
      })
      
      setSuccessMessage('Reporte guardado exitosamente!')
      setTimeout(() => setSuccessMessage(''), 5000)
      
      window.dispatchEvent(new Event('reloadReports'))
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const errors = validateForm(reportToEdit)
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '))
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch(`/api/accidents/${reportToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: reportToEdit.fecha,
          cantidadAccidentes: Number(reportToEdit.cantidadAccidentes),
          cantidadCuasiAccidentes: Number(reportToEdit.cantidadCuasiAccidentes)
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Error al actualizar')

      setSuccessMessage('Reporte actualizado exitosamente!')
      setTimeout(() => setSuccessMessage(''), 5000)
      setReportToEdit(null)
      
      window.dispatchEvent(new Event('reloadReports'))
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReport = (report) => {
    setReportToEdit({
      ...report,
      id: report.id,
      fecha: report.fecha.split('T')[0],
      cantidadAccidentes: report.cantidadAccidentes.toString(),
      cantidadCuasiAccidentes: report.cantidadCuasiAccidentes.toString(),
      diasUltimoAccidente: report.diasUltimoAccidente.toString()
    })
  }

  if (!areaInfo) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">Cargando información del área...</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Reporte de Accidentes - {areaInfo?.nombre}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          ⚠️ {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={reportToEdit ? handleUpdate : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={reportToEdit?.fecha || formData.fecha}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, fecha: e.target.value})
                : handleChange(e)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Accidentes</label>
            <input
              type="number"
              name="cantidadAccidentes"
              value={reportToEdit?.cantidadAccidentes || formData.cantidadAccidentes}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, cantidadAccidentes: Math.max(0, Number(e.target.value))})
                : handleChange(e)
              }
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cuasi Accidentes</label>
            <input
              type="number"
              name="cantidadCuasiAccidentes"
              value={reportToEdit?.cantidadCuasiAccidentes || formData.cantidadCuasiAccidentes}
              onChange={(e) => reportToEdit 
                ? setReportToEdit({...reportToEdit, cantidadCuasiAccidentes: Math.max(0, Number(e.target.value))})
                : handleChange(e)
              }
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Días sin Accidentes</label>
            <input
              type="text"
              name="diasUltimoAccidente"
              value={loadingDays 
                ? 'Calculando...' 
                : (reportToEdit?.diasUltimoAccidente || formData.diasUltimoAccidente)
              }
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {reportToEdit && (
            <button
              type="button"
              onClick={() => setReportToEdit(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || loadingDays}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Guardando...' : reportToEdit ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <ReportList
        areaId={areaInfo?.id}
        onEdit={handleEditReport}
        reportToEdit={reportToEdit}
        apiPath="/api/accidents"
        emptyMessage="No hay reportes de accidentes disponibles"
        fieldsConfig={accidentFieldConfig}
      />
    </div>
  )
}