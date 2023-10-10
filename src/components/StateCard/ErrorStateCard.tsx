import { Icon } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './ErrorStateCard.module.css';
import { StateCard } from './StateCard';

interface IErrorStateCard {
  title: string;
  error?: string;
  variant?: 'block' | 'inline' | 'icon';
}

/**
 * Dump component representing error state.
 *
 * @param title - Title subject, for example "Project List"
 * @param error - Error details
 * @param variant - Style variant. Defaults to 'block'
 */
export const ErrorStateCard = ({ title, error, variant = 'block' }: IErrorStateCard) => {
  const errorTitle = `Error when loading ${title}`;

  if (variant === 'inline') {
    return (
      <span>
        <Icon status="danger">
          <ExclamationCircleIcon />
        </Icon>
        {` ${errorTitle}`}
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <span>
        <TooltipWrapper tooltip={errorTitle}>
          <ExclamationCircleIcon color="#c9190b" />
        </TooltipWrapper>
      </span>
    );
  }

  return (
    <div className={styles['error-state-card-block']}>
      <StateCard title={errorTitle} icon={CubesIcon}>
        <pre>{error}</pre>
      </StateCard>
    </div>
  );
};
