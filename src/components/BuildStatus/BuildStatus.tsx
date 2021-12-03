import { Build, GroupBuild } from 'pnc-api-types-ts';

import './BuildStatus.css';

import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';
import { isBuild } from '../../utils/entityRecognition';

interface IBuildStatus {
  build: Build | GroupBuild;
  long?: boolean;
}

/**
 * Represents a component for displaying the status and main information of a build/groupBuild
 * There are two versions: short (default) and long
 *
 * @remarks
 * Long version additionally also includes the name of the build config
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 */
export const BuildStatus = ({ build, long }: IBuildStatus) => {
  let dateString, dateTitle;
  if ((dateString = build.endTime)) {
    dateTitle = 'End Time';
  } else if ((dateString = build.startTime)) {
    dateTitle = 'Start Time';
  } else if (isBuild(build) && (dateString = (build as Build).submitTime)) {
    dateTitle = 'Submit Time';
  }
  return (
    <div className="build-status">
      <BuildStatusIcon build={build} />
      <BuildName build={build} includeBuildLink long={long} />
      <span title={dateTitle}>
        {new Date(dateString!).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </span>
      <b>{build.user?.username}</b>
    </div>
  );
};
