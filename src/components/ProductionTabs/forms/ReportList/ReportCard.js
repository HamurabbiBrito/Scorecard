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
  customRenderers = {},
  isDSQForm = false
}) {
  // Formateador de fecha corregido para manejar zona horaria
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      // Crear fecha en UTC y ajustar a zona horaria local
      const date = new Date(dateString);
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      
      return adjustedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Función para formatear valores según su tipo
  const formatValue = (key, value) => {
    if (customRenderers[key]) return customRenderers[key](value);
    
    const fieldConfig = fieldsConfig.find(f => f.key === key);
    if (!fieldConfig) return value;
    
    switch(fieldConfig.type) {
      case 'date': 
        return formatDate(value);
      case 'number': 
        return value?.toLocaleString('es-ES') || '0';
      default: 
        return value;
    }
  };

  // Renderizado condicional para DSQForm
  if (isDSQForm) {
    return (
      <div className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
        isEditing ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
      }`}>
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="font-medium text-gray-900">
              {formatDate(report.fechaQueja || report.fecha)}
            </h3>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                report.tipo === 'CLIENTE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {report.tipo || '--'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onEdit(report)}
            className={`text-sm px-2 py-1 rounded ${
              isEditing 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            {isEditing ? 'Editando' : 'Editar'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Cantidad:</span>
            <span className="font-medium">
              {report.cantidadQuejas ?? '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Días sin queja:</span>
            <span className="font-medium">
              {report.diasSinQueja ?? '--'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Filtramos los campos a mostrar
  const displayFields = fieldsConfig.filter(field => 
    !['id', 'areaId', 'createdAt', 'updatedAt'].includes(field.key) && 
    report[field.key] !== undefined
  );

  // Renderizado estándar para otros formularios
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
          .filter(field => field.key !== 'fecha')
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