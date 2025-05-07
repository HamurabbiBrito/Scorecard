'use client';

import AccidentesForm from './forms/AccidentesForm';
import CalidadForm from './forms/CalidadForm';
import DSQForm from './forms/DSQForm';
import KaizenForm from './forms/KaizenForm';
import RHForm from './forms/RHForm';
import FletesForm from './forms/FletesForm';
import ControlForm from './forms/ControlForm';
import ProduccionForm from './forms/ProduccionForm';
import DataView from './DataView';

// Definición con nombre consistente (nota: "BaseFormsConfig" con F mayúscula)
const BaseFormsConfig = [
  {
    id: 'accidentes',
    label: 'Accidentes',
    form: ({ areaId, areaName }) => <AccidentesForm areaId={areaId} areaName={areaName} />,
    endpoint: 'accidents'
  },
  {
    id: 'calidad',
    label: 'Calidad',
    form: ({ areaId, areaName }) => <CalidadForm areaId={areaId} areaName={areaName} />,
    endpoint: 'quality-reports'
  },
  {
    id: 'dias-sin-queja',
    label: 'Días sin queja',
    form: ({ areaId, areaName }) => <DSQForm areaId={areaId} areaName={areaName} />,
    endpoint: 'quejas-reports'
  },
  {
    id: 'kaizen',
    label: 'Kaizen',
    form: ({areaId, areaName}) => <KaizenForm areaId={areaId} areaName={areaName} />,
    endpoint: 'kaizen-reports'
  },
  {
    id: 'rh',
    label: 'RH',
    form: ({areaId, areaName}) => <RHForm areaId={areaId} areaName={areaName} />,
    endpoint: 'rh-reports'
  },
  {
    id: 'fletes',
    label: 'Fletes especiales',
    form: ({areaId, areaName}) => <FletesForm areaId={areaId} areaName={areaName} />,
    endpoint: 'fletes-reports'
  },
  {
    id: 'control',
    label: 'Control',
    form: ({areaId, areaName}) => <ControlForm areaId={areaId} areaName={areaName} />,
    endpoint: 'control-reports'
  },
  {
    id: 'produccion',
    label: 'Producción',
    form: ({areaId, areaName}) => <ProduccionForm areaId={areaId} areaName={areaName} />,
    endpoint: 'production-reports'
  }
];

// Exportación de la configuración completa
export const formsConfig = [
  ...BaseFormsConfig,
  {
    id: 'data-view',
    label: 'Edición Directa',
    form: ({ areaId, areaName }) => (
      <DataView 
        areaId={areaId} 
        areaName={areaName}
        availableForms={BaseFormsConfig} // Usando el nombre correcto
      />
    )
  }
];

// Exportación opcional de la configuración base
export { BaseFormsConfig };