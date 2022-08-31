import { Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon, OutlinedClockIcon } from '@patternfly/react-icons';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { isBuild } from 'utils/entityRecognition';

import styles from './BuildStatusIcon.module.css';
import iconBlue from './icons/blue.svg';
import iconError from './icons/error.svg';
import iconGreen from './icons/green.svg';
import iconGrey from './icons/grey.svg';
import iconNoBuilds from './icons/no-builds.svg';
import iconOrange from './icons/orange.svg';
import iconRed from './icons/red.svg';

const iconData: { [buildStatus: string]: { tooltip: string; icon: any; className?: string } } = {
  SUCCESS: {
    tooltip: 'Build completed successfully',
    icon: iconGreen,
  },
  FAILED: {
    tooltip: 'Build Failed',
    icon: iconRed,
  },
  NO_REBUILD_REQUIRED: {
    tooltip: 'No rebuild required',
    icon: iconGreen,
    className: 'added-opacity',
  },
  ENQUEUED: {
    tooltip: 'Enqueued',
    icon: iconBlue,
  },
  WAITING_FOR_DEPENDENCIES: {
    tooltip: 'Waiting for dependencies',
    icon: iconBlue,
  },
  BUILDING: {
    tooltip: 'Build in progress',
    icon: iconBlue,
    className: 'animate-flicker',
  },
  REJECTED: {
    tooltip: 'Build rejected',
    icon: iconRed,
  },
  REJECTED_FAILED_DEPENDENCIES: {
    tooltip: 'Build rejected: dependencies failed',
    icon: iconOrange,
  },
  CANCELLED: {
    tooltip: 'Build cancelled',
    icon: iconGrey,
  },
  SYSTEM_ERROR: {
    tooltip: 'A system error occurred',
    icon: iconError,
  },
  NEW: {
    tooltip: 'New',
    icon: iconGrey,
  },
  UNKNOWN: {
    tooltip: 'Unknown build status',
    icon: iconNoBuilds,
  },
};

const alignmentData = {
  PREFER_TEMPORARY: {
    tooltip: `Test build, which cannot be used for product release and which will be garbage collected during automatic cleaning. 
    Latest temporary dependencies' versions were preferred in alignment.`,
    className: 'icon-color-info',
  },
  PREFER_PERSISTENT: {
    tooltip: `Test build, which cannot be used for product release and which will be garbage collected during automatic cleaning. 
    Latest persistent dependencies' versions were preferred in alignment.`,
    className: 'icon-color-warning',
  },
  NOT_SPECIFIED: {
    tooltip: `Test build, which cannot be used for product release and which will be garbage collected during automatic
    cleaning. Alignment Preference was not defined.`,
    className: 'icon-color-info',
  },
};

interface IBuildStatusIcon {
  build: Build | GroupBuild;
  long?: boolean;
}

/**
 * Represents a component for displaying the status of a build/groupBuild in form of an icon.
 * There are two versions: short (default) and long.
 *
 * Long version additionally also includes the status in the text format next to the icon.
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 */
export const BuildStatusIcon = ({ build, long }: IBuildStatusIcon) => {
  const selectedIconData = build.status ? iconData[build.status] : iconData.UNKNOWN;
  const selectedIconImage = selectedIconData.icon;
  const isCorrupted =
    isBuild(build) &&
    ((build as Build).attributes?.POST_BUILD_REPO_VALIDATION === 'REPO_SYSTEM_ERROR' ||
      (build as Build).attributes?.PNC_SYSTEM_ERROR === 'DISABLED_FIREWALL');

  return (
    <span className={styles['build-status-icon']}>
      <Tooltip content={<div>{selectedIconData.tooltip}</div>}>
        <img
          src={selectedIconImage}
          width="28px"
          height="28px"
          className={selectedIconData.className && styles[selectedIconData.className]}
          alt={selectedIconData.tooltip}
        />
      </Tooltip>
      {isCorrupted && (
        <Tooltip
          position="right"
          content={<div>The build may have completed successfully but has since been corrupted by a system error.</div>}
        >
          <ExclamationTriangleIcon />
        </Tooltip>
      )}
      {build.temporaryBuild && (
        <Tooltip position="right" content={<div>{alignmentData[build.alignmentPreference || 'NOT_SPECIFIED'].tooltip}</div>}>
          <OutlinedClockIcon className={styles[alignmentData[build.alignmentPreference || 'NOT_SPECIFIED'].className]} />
        </Tooltip>
      )}
      {long && build.status}
    </span>
  );
};
