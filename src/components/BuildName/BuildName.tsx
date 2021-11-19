import { Link } from 'react-router-dom';

interface IBuildName {
  name: string;
  link?: string;
  additionalIdentifier?: string;
  additionalLink?: string;
}

export const BuildName = ({ name, link, additionalIdentifier, additionalLink }: IBuildName) => {
  name = '#' + name;
  return (
    <span>
      {link ? <Link to={link}>{name}</Link> : <span>{name}</span>}
      {additionalIdentifier && (
        <> of {additionalLink ? <Link to={additionalLink}>{additionalIdentifier}</Link> : <span>{additionalIdentifier}</span>}</>
      )}
    </span>
  );
};
