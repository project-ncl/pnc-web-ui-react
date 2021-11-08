import { Tooltip } from '@patternfly/react-core';
import { OutlinedClockIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { FC, SVGProps } from 'react';

import './BuildStatusIcon.css';

import { ReactComponent as IconBlue } from './icons/blue.svg';
import { ReactComponent as IconError } from './icons/error.svg';
import { ReactComponent as IconGreen } from './icons/green.svg';
import { ReactComponent as IconGrey } from './icons/grey.svg';
import { ReactComponent as IconOrange } from './icons/orange.svg';
import { ReactComponent as IconRed } from './icons/red.svg';
import { ReactComponent as IconYellow } from './icons/yellow.svg';
import { ReactComponent as IconNoBuilds } from './icons/no-builds.svg';

export enum IconType {
  WAITING_FOR_DEPENDENCIES,
  ENQUEUED,
  BUILDING,
  SUCCESS,
  UNSTABLE,
  FAILED,
  NO_REBUILD_REQUIRED,
  REJECTED_FAILED_DEPENDENCIES,
  REJECTED,
  ABORTED,
  CANCELLED,
  NEW,
  SYSTEM_ERROR,
}

const IconData = new Map<IconType, { tooltip: string; icon: FC<SVGProps<SVGSVGElement>>; className?: string }>([
  [
    IconType.WAITING_FOR_DEPENDENCIES,
    {
      tooltip: 'Waiting for dependencies',
      icon: IconBlue,
    },
  ],
  [
    IconType.ENQUEUED,
    {
      tooltip: 'Enqueued',
      icon: IconBlue,
    },
  ],
  [
    IconType.BUILDING,
    {
      tooltip: 'Build in progress',
      icon: IconBlue,
      className: 'animate-flicker',
    },
  ],
  [
    IconType.SUCCESS,
    {
      tooltip: 'Build completed successfully',
      icon: IconGreen,
    },
  ],
  [
    IconType.UNSTABLE,
    {
      tooltip: 'Unstable build',
      icon: IconYellow,
    },
  ],
  [
    IconType.FAILED,
    {
      tooltip: 'Build Failed',
      icon: IconRed,
    },
  ],
  [
    IconType.NO_REBUILD_REQUIRED,
    {
      tooltip: 'No rebuild required',
      icon: IconGreen,
      className: 'added-opacity',
    },
  ],
  [
    IconType.REJECTED_FAILED_DEPENDENCIES,
    {
      tooltip: 'Build rejected: dependencies failed',
      icon: IconOrange,
    },
  ],
  [
    IconType.REJECTED,
    {
      tooltip: 'Build rejected',
      icon: IconRed,
    },
  ],
  [
    IconType.ABORTED,
    {
      tooltip: 'Build aborted',
      icon: IconGrey,
    },
  ],
  [
    IconType.CANCELLED,
    {
      tooltip: 'Build cancelled',
      icon: IconGrey,
    },
  ],
  [
    IconType.NEW,
    {
      tooltip: 'New',
      icon: IconGrey,
    },
  ],
  [
    IconType.SYSTEM_ERROR,
    {
      tooltip: 'A system error occurred',
      icon: IconError,
    },
  ],
]);

export const BuildStatusIcon: FC<{ iconType: IconType; isCorrupted?: boolean; isTemporary?: boolean }> = ({
  iconType,
  isCorrupted,
  isTemporary,
}) => {
  const SelectedIconComponent = IconData.get(iconType)?.icon ?? IconNoBuilds;
  const tooltipText = IconData.get(iconType)?.tooltip ?? 'Unknown build status';
  const className = IconData.get(iconType)?.className ?? '';

  return (
    <div className="build-status-icon">
      <Tooltip content={<div>{tooltipText}</div>}>
        <SelectedIconComponent width="28px" height="28px" className={className} />
      </Tooltip>
      {isCorrupted && (
        <Tooltip
          position="right"
          content={<div>The build may have completed successfully but has since been corrupted by a system error</div>}
        >
          <ExclamationTriangleIcon />
        </Tooltip>
      )}
      {isTemporary && (
        <Tooltip position="right" content={<div>Temporary build; this will be garbage collected</div>}>
          <OutlinedClockIcon />
        </Tooltip>
      )}
    </div>
  );
};
