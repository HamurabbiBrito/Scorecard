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
    form: (area) => <AccidentesForm area={area} />
  },
  {
    id: 'calidad',
    label: 'Calidad',
    form: (area) => <CalidadForm area={area} />
  },
  {
    id: 'dias-sin-queja',
    label: 'Días sin queja',
    form: (area) => <DSQForm area={area} />
  },
  {
    id: 'kaizen',
    label: 'Kaizen',
    form: (area) => <KaizenForm area={area} />
  },
  {
    id: 'rh',
    label: 'RH',
    form: (area) => <RHForm area={area} />
  },
  {
    id: 'fletes',
    label: 'Fletes especiales',
    form: (area) => <FletesForm area={area} />
  },
  {
    id: 'control',
    label: 'Control',
    form: (area) => <ControlForm area={area} />
  },
  {
    id: 'produccion',
    label: 'Producción',
    form: (area) => <ProduccionForm area={area} />
  }
];