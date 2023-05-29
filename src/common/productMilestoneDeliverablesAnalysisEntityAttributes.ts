import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

const resultValues: DeliverableAnalyzerOperation['result'][] = [
  'SUCCESSFUL',
  'FAILED',
  'REJECTED',
  'CANCELLED',
  'TIMEOUT',
  'SYSTEM_ERROR',
];

const progressStatusValues: DeliverableAnalyzerOperation['progressStatus'][] = ['NEW', 'PENDING', 'IN_PROGRESS', 'FINISHED'];

interface IExtendedDeliverableAnalyzerOperation extends DeliverableAnalyzerOperation {
  'user.username': any;
}

export const productMilestoneDeliverablesAnalysisEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submit Time',
  },
  startTime: {
    id: 'startTime',
    title: 'Start Time',
  },
  endTime: {
    id: 'endTime',
    title: 'End Time',
  },
  progressStatus: {
    id: 'progressStatus',
    title: 'Progress Status',
    values: progressStatusValues,
    filter: {
      operator: '==',
    },
  },
  result: {
    id: 'result',
    title: 'Result',
    values: resultValues,
    filter: {
      operator: '==',
    },
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    filter: {
      operator: '=like=',
    },
  },
  parameters: {
    id: 'parameters',
    title: 'Parameters',
  },
} as const satisfies IEntityAttributes<IExtendedDeliverableAnalyzerOperation>;
