import { Icon } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { StateCard } from './StateCard';

interface IErrorStateCard {
  title: string;
  error?: string;
  isInline: boolean;
}

/**
 * Dump component representing error state.
 *
 * @param title - Title subject, for example "Project List"
 * @param error - Error details
 */
export const ErrorStateCard = ({ title, error, isInline }: IErrorStateCard) => {
  const errorTitle = `Error when loading ${title}`;

  if (isInline) {
    return (
      <span>
        <Icon status="danger">
          <ExclamationCircleIcon />
        </Icon>
        {` ${errorTitle}`}
      </span>
    );
  }

  return (
    <StateCard title={errorTitle} icon={CubesIcon}>
      <pre>{error}</pre>
    </StateCard>
  );
};
