import { Project } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

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
} as const satisfies IEntityAttributes<Project>;
