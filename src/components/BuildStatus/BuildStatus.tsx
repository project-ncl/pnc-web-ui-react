import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildName } from 'components/BuildName/BuildName';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { Username } from 'components/Username/Username';

import { isBuild } from 'utils/entityRecognition';
import { createDateTime } from 'utils/utils';

import './BuildStatus.css';

interface IBuildStatus {
  build: Build | GroupBuild;
  long?: boolean;
  includeBuildLink?: boolean;
  includeConfigLink?: boolean;
  hideDatetime?: boolean;
  hideUsername?: boolean;
}

/**
 * Represents a component for displaying the status and main information of a build/groupBuild.
 * There are two versions: short (default) and long.
 *
 * Long version additionally also includes the name of the build config.
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 * @param includeBuildLink - Whether the build name should be a link to the build page
 * @param includeConfigLink - Whether the build config (in the long version) should be a link to the build config page
 * @param hideDatetime - Whether build datetime will be displayed
 * @param hideUsername - Whether build username will be displayed
 */
export const BuildStatus = ({ build, long, includeBuildLink, includeConfigLink, hideDatetime, hideUsername }: IBuildStatus) => {
  let dateString, dateTitle;
  if ((dateString = build.endTime)) {
    dateTitle = 'End Time';
  } else if ((dateString = build.startTime)) {
    dateTitle = 'Start Time';
  } else if (isBuild(build) && (dateString = (build as Build).submitTime)) {
    dateTitle = 'Submit Time';
  }
  return (
    <span className="build-status">
      <BuildStatusIcon build={build} />
      <BuildName build={build} includeBuildLink={includeBuildLink} includeConfigLink={includeConfigLink} long={long} />
      {!hideDatetime && <span title={dateTitle}>{createDateTime({ date: dateString! }).custom}</span>}
      {!hideUsername && <b>{build.user?.username && <Username text={build.user.username} />}</b>}
    </span>
  );
};
