import { FC } from 'react';
import { Link } from 'react-router-dom';

export const BuildName: FC<{ identifier: string; link?: string; additionalIdentifier?: string; additionalLink?: string }> = ({
  identifier,
  link,
  additionalIdentifier,
  additionalLink,
}) => {
  identifier = '#' + identifier;
  return (
    <span>
      {link ? <Link to={link}>{identifier}</Link> : <span>{identifier}</span>}
      {additionalIdentifier && (
        <> of {additionalLink ? <Link to={additionalLink}>{additionalIdentifier}</Link> : <span>{additionalIdentifier}</span>}</>
      )}
    </span>
  );
};
