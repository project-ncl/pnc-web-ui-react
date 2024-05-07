import { Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon, OutlinedClockIcon } from '@patternfly/react-icons';
import { PropsWithChildren, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { buildStatusData } from 'common/buildStatusData';

import { IconWrapper } from 'components/IconWrapper/IconWrapper';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isBuild } from 'utils/entityRecognition';

import styles from './BuildStatusIcon.module.css';

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
  const selectedIconData = build.status ? buildStatusData[build.status] : buildStatusData.UNKNOWN;
  const isCorrupted =
    isBuild(build) &&
    ((build as Build).attributes?.POST_BUILD_REPO_VALIDATION === 'REPO_SYSTEM_ERROR' ||
      (build as Build).attributes?.PNC_SYSTEM_ERROR === 'DISABLED_FIREWALL');

  const buildImage = (
    <IconWrapper variant="medium">
      <img
        src={selectedIconData.icon}
        width="28px"
        height="28px"
        className={selectedIconData.className && styles[selectedIconData.className]}
        alt={selectedIconData.tooltip}
      />
    </IconWrapper>
  );

  return (
    <span className={styles['build-status-icon']}>
      {isBuild(build) ? (
        <BuildLogLink build={build}>{buildImage}</BuildLogLink>
      ) : (
        <TooltipWrapper tooltip={build.status && buildStatusData[build.status].tooltip}>{buildImage}</TooltipWrapper>
      )}
      {isCorrupted && (
        <Tooltip
          removeFindDomNode
          position="right"
          content="The build may have completed successfully but has since been corrupted by a system error."
        >
          <IconWrapper variant="small">
            <ExclamationTriangleIcon />
          </IconWrapper>
        </Tooltip>
      )}
      {build.temporaryBuild && (
        <Tooltip
          removeFindDomNode
          position="right"
          content={<span>{alignmentData[build.alignmentPreference || 'NOT_SPECIFIED'].tooltip}</span>}
        >
          <IconWrapper variant="small">
            <OutlinedClockIcon className={styles[alignmentData[build.alignmentPreference || 'NOT_SPECIFIED'].className]} />
          </IconWrapper>
        </Tooltip>
      )}
      {long && build.status}
    </span>
  );
};

interface IBuildLogLinkProps {
  build: Build;
}

const BuildLogLink = ({ build, children }: PropsWithChildren<IBuildLogLinkProps>) => {
  const buildLogLink = useMemo(() => getAdequateBuildLogLink(build), [build]);

  return (
    <TooltipWrapper tooltip={build.status && `${buildStatusData[build.status].tooltip}. Click to open the log`}>
      <Link to={buildLogLink} className={styles['build-log-link']}>
        {children}
      </Link>
    </TooltipWrapper>
  );
};

const getAdequateBuildLogLink = (build: Build): string =>
  !build.scmUrl && buildStatusData[build.status!].failed ? `/builds/${build.id}/alignment-log` : `/builds/${build.id}/build-log`;
