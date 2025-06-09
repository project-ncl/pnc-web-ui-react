import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

// this supertype is not coming from pnc-api-types-ts
// but these props are same for all Operations
export interface Operation {
  id: DeliverableAnalyzerOperation['id'];
  parameters?: DeliverableAnalyzerOperation['parameters'];
  progressStatus?: DeliverableAnalyzerOperation['progressStatus'];
  result?: DeliverableAnalyzerOperation['result'];
  submitTime?: DeliverableAnalyzerOperation['submitTime'];
  startTime?: DeliverableAnalyzerOperation['startTime'];
  endTime?: DeliverableAnalyzerOperation['endTime'];
  user?: DeliverableAnalyzerOperation['user'];
}

const operationResultValues: Operation['result'][] = ['SUCCESSFUL', 'FAILED', 'REJECTED', 'CANCELLED', 'TIMEOUT', 'SYSTEM_ERROR'];

const operationProgressStatusValues: Operation['progressStatus'][] = ['NEW', 'PENDING', 'IN_PROGRESS', 'FINISHED'];

interface IExtendedOperation extends Operation {
  'user.username': string;
}

export const operationEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submit Time',
    sort: {
      group: 'times',
    },
  },
  startTime: {
    id: 'startTime',
    title: 'Start Time',
    sort: {
      group: 'times',
    },
  },
  endTime: {
    id: 'endTime',
    title: 'End Time',
    sort: {
      group: 'times',
    },
  },
  progressStatus: {
    id: 'progressStatus',
    title: 'Progress Status',
    values: operationProgressStatusValues,
    filter: {
      operator: '==',
    },
  },
  result: {
    id: 'result',
    title: 'Result',
    values: operationResultValues,
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
    sort: {},
  },
  parameters: {
    id: 'parameters',
    title: 'Parameters',
  },
} as const satisfies TEntityAttributes<IExtendedOperation>;
