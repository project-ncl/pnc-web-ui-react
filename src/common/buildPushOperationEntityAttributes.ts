import { TEntityAttributes } from 'common/entityAttributes';
import { operationEntityAttributes } from 'common/operationEntityAttributes';
import { BuildPushOperation } from 'common/pnc-api-types-ts';

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
