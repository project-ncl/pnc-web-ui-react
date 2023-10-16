import { Build } from 'pnc-api-types-ts';

import iconBlue from 'components/BuildStatusIcon/icons/blue.svg';
import iconError from 'components/BuildStatusIcon/icons/error.svg';
import iconGreen from 'components/BuildStatusIcon/icons/green.svg';
import iconGrey from 'components/BuildStatusIcon/icons/grey.svg';
import iconNoBuilds from 'components/BuildStatusIcon/icons/no-builds.svg';
import iconOrange from 'components/BuildStatusIcon/icons/orange.svg';
import iconRed from 'components/BuildStatusIcon/icons/red.svg';

export type BuildStatus = NonNullable<Build['status']>;

type BuildStatusWithUnknown = BuildStatus | 'UNKNOWN';

type TBuildStatusData = {
  [buildStatus in BuildStatusWithUnknown]: {
    tooltip: string;
    icon: any;
    className?: string;
    progress: 'FINISHED' | 'PENDING' | 'IN_PROGRESS' | undefined;
    failed: boolean | undefined;
  };
};

export const buildStatusData: TBuildStatusData = {
  SUCCESS: {
    tooltip: 'Build completed successfully',
    icon: iconGreen,
    progress: 'FINISHED',
    failed: false,
  },
  FAILED: {
    tooltip: 'Build Failed',
    icon: iconRed,
    progress: 'FINISHED',
    failed: true,
  },
  NO_REBUILD_REQUIRED: {
    tooltip: 'No rebuild required',
    icon: iconGreen,
    className: 'added-opacity',
    progress: 'FINISHED',
    failed: false,
  },
  ENQUEUED: {
    tooltip: 'Enqueued',
    icon: iconBlue,
    progress: 'PENDING',
    failed: false,
  },
  WAITING_FOR_DEPENDENCIES: {
    tooltip: 'Waiting for dependencies',
    icon: iconBlue,
    progress: 'PENDING',
    failed: false,
  },
  BUILDING: {
    tooltip: 'Build in progress',
    icon: iconBlue,
    className: 'animate-flicker',
    progress: 'IN_PROGRESS',
    failed: false,
  },
  REJECTED: {
    tooltip: 'Build rejected',
    icon: iconRed,
    progress: 'FINISHED',
    failed: true,
  },
  REJECTED_FAILED_DEPENDENCIES: {
    tooltip: 'Build rejected: dependencies failed',
    icon: iconOrange,
    progress: 'FINISHED',
    failed: true,
  },
  CANCELLED: {
    tooltip: 'Build cancelled',
    icon: iconGrey,
    progress: 'FINISHED',
    failed: true,
  },
  SYSTEM_ERROR: {
    tooltip: 'A system error occurred',
    icon: iconError,
    progress: 'FINISHED',
    failed: true,
  },
  NEW: {
    tooltip: 'New',
    icon: iconGrey,
    progress: 'PENDING',
    failed: false,
  },

  // UI defined build status
  UNKNOWN: {
    tooltip: 'Unknown build status',
    icon: iconNoBuilds,
    progress: undefined,
    failed: undefined,
  },
} as const;
