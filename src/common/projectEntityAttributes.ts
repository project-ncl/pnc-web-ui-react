import { Project } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedProject extends Project {
  buildConfigsCount: number;
}

export const projectEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  name: {
    id: 'name',
    title: 'Name',
    filter: {
      operator: '=like=',
    },
  },
  description: {
    id: 'description',
    title: 'Description',
    filter: {
      operator: '=like=',
    },
  },
  projectUrl: {
    id: 'projectUrl',
    title: 'Project URL',
  },
  issueTrackerUrl: {
    id: 'issueTrackerUrl',
    title: 'Issue Tracker URL',
  },
  engineeringTeam: {
    id: 'engineeringTeam',
    title: 'Engineering Team',
  },
  technicalLeader: {
    id: 'technicalLeader',
    title: 'Technical Leader',
  },
  buildConfigsCount: {
    id: 'buildConfigsCount',
    title: 'Build Configs count',
  },
} as const satisfies TEntityAttributes<IExtendedProject>;
