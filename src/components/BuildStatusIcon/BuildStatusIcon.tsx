import { Tooltip } from '@patternfly/react-core';
import { OutlinedClockIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { Build, GroupBuild } from 'pnc-api-types-ts';

import './BuildStatusIcon.css';

import { ReactComponent as IconBlue } from './icons/blue.svg';
import { ReactComponent as IconError } from './icons/error.svg';
import { ReactComponent as IconGreen } from './icons/green.svg';
import { ReactComponent as IconGrey } from './icons/grey.svg';
import { ReactComponent as IconOrange } from './icons/orange.svg';
import { ReactComponent as IconRed } from './icons/red.svg';
import { ReactComponent as IconNoBuilds } from './icons/no-builds.svg';
import { isBuild } from '../../utils/entityRecognition';

const iconData: { [buildStatus: string]: { tooltip: string; icon: any; className?: string } } = {
  SUCCESS: {
    tooltip: 'Build completed successfully',
    icon: IconGreen,
  },
  FAILED: {
    tooltip: 'Build Failed',
    icon: IconRed,
  },
  NO_REBUILD_REQUIRED: {
    tooltip: 'No rebuild required',
    icon: IconGreen,
    className: 'added-opacity',
  },
  ENQUEUED: {
    tooltip: 'Enqueued',
    icon: IconBlue,
  },
  WAITING_FOR_DEPENDENCIES: {
    tooltip: 'Waiting for dependencies',
    icon: IconBlue,
  },
  BUILDING: {
    tooltip: 'Build in progress',
    icon: IconBlue,
    className: 'animate-flicker',
  },
  REJECTED: {
    tooltip: 'Build rejected',
    icon: IconRed,
  },
  REJECTED_FAILED_DEPENDENCIES: {
    tooltip: 'Build rejected: dependencies failed',
    icon: IconOrange,
  },
  CANCELLED: {
    tooltip: 'Build cancelled',
    icon: IconGrey,
  },
  SYSTEM_ERROR: {
    tooltip: 'A system error occurred',
    icon: IconError,
  },
  NEW: {
    tooltip: 'New',
    icon: IconGrey,
  },
  UNKNOWN: {
    tooltip: 'Unknown build status',
    icon: IconNoBuilds,
  },
};

interface IBuildStatusIcon {
  build: Build | GroupBuild;
  long?: boolean;
}

/**
 * Represents a component for displaying the status of a build/groupBuild in form of an icon
 * There are two versions: short (default) and long
 *
 * @remarks
 * Long version additionally also includes the status in the text format next to the icon
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 */
export const BuildStatusIcon = ({ build, long }: IBuildStatusIcon) => {
  const selectedIconData = build.status ? iconData[build.status] : iconData.UNKNOWN;
  const SelectedIconComponent = selectedIconData!.icon;
  const isCorrupted =
    isBuild(build) &&
    ((build as Build).attributes?.POST_BUILD_REPO_VALIDATION === 'REPO_SYSTEM_ERROR' ||
      (build as Build).attributes?.PNC_SYSTEM_ERROR === 'DISABLED_FIREWALL');

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
      {build.temporaryBuild && (
        <Tooltip
          position="right"
          content={
            <div>Temporary build - test build, which cannot be used for product release and will be garbage collected</div>
          }
        >
          <OutlinedClockIcon />
        </Tooltip>
      )}
      {long && build.status}
    </span>
  );
};
