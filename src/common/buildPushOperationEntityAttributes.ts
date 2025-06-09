import { BuildPushOperation } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';
import { operationEntityAttributes } from 'common/operationEntityAttributes';

interface IExtendedBuildPushOperation extends BuildPushOperation {
  'user.username': string;
  buildId: string;
}

export const buildPushOperationEntityAttributes = {
  ...operationEntityAttributes,
  buildId: {
    id: 'buildId',
    title: 'Build ID',
  },
} as const satisfies TEntityAttributes<IExtendedBuildPushOperation>;
