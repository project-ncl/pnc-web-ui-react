import { GroupConfiguration } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedGroupConfig extends GroupConfiguration {
  buildConfigsCount: number;
}

export const groupConfigEntityAttributes = {
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
  buildConfigsCount: {
    id: 'buildConfigsCount',
    title: 'Build Configs count',
  },
} as const satisfies TEntityAttributes<IExtendedGroupConfig>;
