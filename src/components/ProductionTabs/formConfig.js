'use client';

import AccidentesForm from './forms/AccidentesForm';
import CalidadForm from './forms/CalidadForm';
import DSQForm from './forms/DSQForm';
import KaizenForm from './forms/KaizenForm';
import RHForm from './forms/RHForm';
import FletesForm from './forms/FletesForm';
import ControlForm from './forms/ControlForm';
import ProduccionForm from './forms/ProduccionForm';

export const formsConfig = [
  {
    id: 'accidentes',
    label: 'Accidentes',
    form: ({ areaId, areaName }) => <AccidentesForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'calidad',
    label: 'Calidad',
    form: ({ areaId, areaName }) => <CalidadForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'dias-sin-queja',
    label: 'Días sin queja',
    form: ({ areaId, areaName }) => <DSQForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'kaizen',
    label: 'Kaizen',
    form: ({areaId, areaName}) => <KaizenForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'rh',
    label: 'RH',
    form: ({areaId, areaName}) => <RHForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'fletes',
    label: 'Fletes especiales',
    form: ({areaId, areaName}) => <FletesForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'control',
    label: 'Control',
    form: ({areaId, areaName}) => <ControlForm areaId={areaId} areaName={areaName} />
  },
  {
    id: 'produccion',
    label: 'Producción',
    form: ({areaId, areaName}) => <ProduccionForm areaId={areaId} areaName={areaName} />
  }
];