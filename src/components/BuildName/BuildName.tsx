import { Link } from 'react-router-dom';
import { Build, GroupBuild } from 'pnc-api-types-ts';

import { isGroupBuild } from '../../utils/entityRecognition';

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

export const BuildName = ({ build, long, includeBuildLink, includeConfigLink }: IBuildName) => {
  const name = calculateBuildName(build);
  const configName =
    ('buildConfigRevision' in build ? build.buildConfigRevision : (build as GroupBuild).groupConfig)?.name ??
    'unknown_build_config';
  const buildLink = 'TODO'; // TODO: FORMAT LINKS HERE
  const configLink = 'TODO';
  return (
    <span>
      {includeBuildLink ? <Link to={buildLink}>{name}</Link> : <span>{name}</span>}
      {long && <> of {includeConfigLink ? <Link to={configLink}>{configName}</Link> : <span>{configName}</span>}</>}
    </span>
  );
};
