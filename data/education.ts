export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export const education: Education[] = [
  {
    id: '1',
    institution: 'Universidad de Ingeniería',
    degree: 'Ingeniería en Sistemas',
    startDate: '2016-09',
    endDate: '2020-06',
    description: 'Especialización en arquitectura de software.',
  },
];