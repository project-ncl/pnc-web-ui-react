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
    sort: {},
  },
  buildConfigsCount: {
    id: 'buildConfigsCount',
    title: 'Build Configs count',
  },
  productVersion: {
    id: 'productVersion',
    title: 'Product Version',
  },
} as const satisfies TEntityAttributes<IExtendedGroupConfig>;
