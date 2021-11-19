import { Tooltip } from '@patternfly/react-core';
import { OutlinedClockIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

import './BuildStatusIcon.css';

import { ReactComponent as IconBlue } from './icons/blue.svg';
import { ReactComponent as IconError } from './icons/error.svg';
import { ReactComponent as IconGreen } from './icons/green.svg';
import { ReactComponent as IconGrey } from './icons/grey.svg';
import { ReactComponent as IconOrange } from './icons/orange.svg';
import { ReactComponent as IconRed } from './icons/red.svg';
import { ReactComponent as IconYellow } from './icons/yellow.svg';
import { ReactComponent as IconNoBuilds } from './icons/no-builds.svg';

import { BuildStatusType } from '../../scripts/Build';

const iconData = new Map<BuildStatusType, { tooltip: string; icon: any; className?: string }>([
  [
    BuildStatusType.WAITING_FOR_DEPENDENCIES,
    {
      tooltip: 'Waiting for dependencies',
      icon: IconBlue,
    },
  ],
  [
    BuildStatusType.ENQUEUED,
    {
      tooltip: 'Enqueued',
      icon: IconBlue,
    },
  ],
  [
    BuildStatusType.BUILDING,
    {
      tooltip: 'Build in progress',
      icon: IconBlue,
      className: 'animate-flicker',
    },
  ],
  [
    BuildStatusType.SUCCESS,
    {
      tooltip: 'Build completed successfully',
      icon: IconGreen,
    },
  ],
  [
    BuildStatusType.UNSTABLE,
    {
      tooltip: 'Unstable build',
      icon: IconYellow,
    },
  ],
  [
    BuildStatusType.FAILED,
    {
      tooltip: 'Build Failed',
      icon: IconRed,
    },
  ],
  [
    BuildStatusType.NO_REBUILD_REQUIRED,
    {
      tooltip: 'No rebuild required',
      icon: IconGreen,
      className: 'added-opacity',
    },
  ],
  [
    BuildStatusType.REJECTED_FAILED_DEPENDENCIES,
    {
      tooltip: 'Build rejected: dependencies failed',
      icon: IconOrange,
    },
  ],
  [
    BuildStatusType.REJECTED,
    {
      tooltip: 'Build rejected',
      icon: IconRed,
    },
  ],
  [
    BuildStatusType.ABORTED,
    {
      tooltip: 'Build aborted',
      icon: IconGrey,
    },
  ],
  [
    BuildStatusType.CANCELLED,
    {
      tooltip: 'Build cancelled',
      icon: IconGrey,
    },
  ],
  [
    BuildStatusType.NEW,
    {
      tooltip: 'New',
      icon: IconGrey,
    },
  ],
  [
    BuildStatusType.SYSTEM_ERROR,
    {
      tooltip: 'A system error occurred',
      icon: IconError,
    },
  ],
  [
    BuildStatusType.UNKNOWN,
    {
      tooltip: 'Unknown build status',
      icon: IconNoBuilds,
    },
  ],
]);

interface IBuildStatusIcon {
  buildStatus: BuildStatusType;
  isCorrupted?: boolean;
  isTemporary?: boolean;
}

export const BuildStatusIcon = ({ buildStatus, isCorrupted, isTemporary }: IBuildStatusIcon) => {
  const selectedIconData = iconData.get(buildStatus) ?? iconData.get(BuildStatusType.UNKNOWN);
  const SelectedIconComponent = selectedIconData!.icon;

  return (
    <span className="build-status-icon">
      <Tooltip content={<div>{selectedIconData!.tooltip}</div>}>
        <SelectedIconComponent width="28px" height="28px" className={selectedIconData!.className} />
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
        <Tooltip
          position="right"
          content={
            <div>Temporary build - test build, which cannot be used for product release and which will be garbage colleted</div>
          }
        >
          <OutlinedClockIcon />
        </Tooltip>
      )}
    </span>
  );
};
