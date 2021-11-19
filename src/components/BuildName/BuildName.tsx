import { Link } from 'react-router-dom';
import { Build } from 'pnc-api-types-ts';

const calculateBuildName = (build: Build) => {
  if (build.submitTime) {
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
  return '#INVALID_BUILD_NAME';
};

interface IBuildName {
  build: Build;
}

export const BuildName = ({ build }: IBuildName) => {
  const name = calculateBuildName(build);
  const link = 'TODO';
  const additionalIdentifier = 'TODO';
  const additionalLink = 'TODO';
  return (
    <span>
      {link ? <Link to={link}>{name}</Link> : <span>{name}</span>}
      {additionalIdentifier && (
        <> of {additionalLink ? <Link to={additionalLink}>{additionalIdentifier}</Link> : <span>{additionalIdentifier}</span>}</>
      )}
    </span>
  );
};
