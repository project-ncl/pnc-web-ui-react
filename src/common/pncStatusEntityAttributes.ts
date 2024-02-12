import { TEntityAttributes } from 'common/entityAttributes';

export const pncStatusEntityAttributes = {
  banner: {
    id: 'banner',
    title: 'Announcement',
  },
  isMaintenanceMode: {
    id: 'isMaintenanceMode',
    title: 'Maintenance Mode',
  },
  eta: {
    id: 'eta',
    title: 'ETA',
  },
  // TODO: remove any
} as const satisfies TEntityAttributes<any>;
