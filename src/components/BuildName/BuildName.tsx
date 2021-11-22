import { Link } from 'react-router-dom';
import { Build, GroupBuild } from 'pnc-api-types-ts';

import { isGroupBuild, isBuild } from '../../utils/entityRecognition';

const calculateBuildName = (build: Build | GroupBuild) => {
  if (isGroupBuild(build)) {
    return '#' + build.id;
  }
  if ('submitTime' in build && build.submitTime) {
    const dateObject = new Date(build.submitTime);
    return [
      '#',
      dateObject.getUTCFullYear(),
      String(dateObject.getUTCMonth() + 1).padStart(2, '0'),
      String(dateObject.getUTCDate()).padStart(2, '0'),
      '-',
      String(dateObject.getUTCHours()).padStart(2, '0'),
      String(dateObject.getUTCMinutes()).padStart(2, '0'),
    ].join('');
  }
  console.error('Invalid build: ' + build.id);
  return '#INVALID_BUILD_NAME';
};

interface IBuildName {
  build: Build | GroupBuild;
  long?: boolean;
  includeBuildLink?: boolean;
  includeConfigLink?: boolean;
}

/**
 * Represents a component for displaying the name of a build/groupBuild
 * There are two versions: short (default) and long
 *
 * @remarks
 * Long version additionally also includes the name of the build configuration
 * Both "short" and "long" versions can also contain links to the actual build/config
 *
 * @param build - Build or GroupBuild
 * @param long - Whether the component should be of the long version
 * @param includeBuildLink - Whether the build name should be a link to the build page
 * @param includeConfigLink - Whether the build config (in the long version) should be a link to the build config page
 */
export const BuildName = ({ build, long, includeBuildLink, includeConfigLink }: IBuildName) => {
  const name = calculateBuildName(build);
  const configName =
    (isBuild(build) ? (build as Build).buildConfigRevision : (build as GroupBuild).groupConfig)?.name ?? 'unknown_build_config';
  const buildLink = 'TODO'; // TODO: FORMAT LINKS HERE
  const configLink = 'TODO';
  return (
    <span>
      {includeBuildLink ? <Link to={buildLink}>{name}</Link> : <span>{name}</span>}
      {long && <> of {includeConfigLink ? <Link to={configLink}>{configName}</Link> : <span>{configName}</span>}</>}
    </span>
  );
};
