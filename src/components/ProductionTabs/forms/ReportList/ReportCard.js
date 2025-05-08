'use client';

export default function ReportCard({ 
  report, 
  onEdit, 
  isEditing,
  fieldsConfig = [
    { label: 'Fecha', key: 'fecha', type: 'date' },
    { label: 'Accidentes', key: 'cantidadAccidentes', type: 'number' },
    { label: 'Cuasi accidentes', key: 'cantidadCuasiAccidentes', type: 'number' },
    { label: 'Días sin accidentes', key: 'diasUltimoAccidente', type: 'number' }
  ],
  customRenderers = {}
}) {
  // Formateador de fecha por defecto
  const defaultFormatDate = (dateString) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
    return adjustedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtener el formateador personalizado o usar el por defecto
  const formatValue = (key, value) => {
    if (customRenderers[key]) {
      return customRenderers[key](value);
    }
    
    const fieldConfig = fieldsConfig.find(f => f.key === key);
    if (!fieldConfig) return value;
    
    switch(fieldConfig.type) {
      case 'date':
        return defaultFormatDate(value);
      case 'currency':
        return new Intl.NumberFormat('es-ES', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value;
    }
  };

  // Determinar qué campos mostrar (excluyendo campos especiales como 'id', 'areaId', etc.)
  const displayFields = fieldsConfig.filter(field => 
    !['id', 'areaId', 'createdAt', 'updatedAt'].includes(field.key) && 
    report[field.key] !== undefined
  );

  return (
    <div className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
      isEditing ? 'ring-2 ring-blue-500' : 'bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">
          {formatValue('fecha', report.fecha)}
        </h3>
        <button 
          onClick={() => onEdit(report)}
          className={`text-sm ${
            isEditing ? 'text-blue-700 font-semibold' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          {isEditing ? 'Editando...' : 'Editar'}
        </button>
      </div>
      
      <div className="mt-3 space-y-2 text-sm">
        {displayFields
          .filter(field => field.key !== 'fecha') // La fecha ya la mostramos en el título
          .map(field => (
            <div key={field.key} className="flex justify-between">
              <span className="text-gray-600">{field.label}:</span>
              <span className="font-medium">
                {formatValue(field.key, report[field.key])}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}