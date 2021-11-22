import { Build, GroupBuild } from 'pnc-api-types-ts';

import './BuildStatus.css';

import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';

interface IBuildStatus {
  build: Build | GroupBuild;
  long?: boolean;
}

/**
 * Represents a component for displaying the status and main information of a build/groupBuild
 * There are two versions: short (default) and long
 *
 * @remarks
 * Long version additionally also includes the name of the build configuration
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 */
export const BuildStatus = ({ build, long }: IBuildStatus) => (
  <div className="build-status">
    <BuildStatusIcon build={build} />
    <BuildName build={build} includeBuildLink long={long} />
    <span>
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
    <span>
      <b>{build.user?.username}</b>
    </span>
  </div>
);
