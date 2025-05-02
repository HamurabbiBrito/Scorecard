// validations/accidentReports.js
import Joi from 'joi'

const accidentReportSchema = Joi.object({
  fecha: Joi.date().required().messages({
    'date.base': 'La fecha debe ser una fecha válida',
    'any.required': 'La fecha es requerida'
  }),
  areaId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del área debe ser numérico',
    'any.required': 'El ID del área es requerido'
  }),
  cantidadAccidentes: Joi.number().min(0).required().messages({
    'number.base': 'La cantidad debe ser numérica',
    'any.required': 'La cantidad es requerida'
  }),
  cantidadCuasiAccidentes: Joi.number().min(0).default(0),
  diasUltimoAccidente: Joi.number().min(0).default(0)
}).options({ abortEarly: false })

export const validateAccidentReport = (data) => {
  const { error, value } = accidentReportSchema.validate(data)
  
  if (error) {
    return {
      success: false,
      errors: error.details.map(detail => ({
        path: detail.path.join('.'),
        message: detail.message
      }))
    }
  }
  
  return { success: true, data: value }
}