import { Spinner } from '@patternfly/react-core';

import styles from './RefreshStateCard.module.css';

interface IRefreshStateCard {
  isInline?: boolean;
}

/**
 * Refresh State component with loading indicator displayed over real data that were valid for previous state.
 */
export const RefreshStateCard = ({ children, isInline = false }: React.PropsWithChildren<IRefreshStateCard>) =>
  isInline ? (
    <Spinner isInline isSVG aria-label="Loading..." />
  ) : (
    <div className={styles['refresh-state-card']}>
      <div className={styles['refresh-state-card__body']}>{children}</div>
      <div className={styles['refresh-state-card__indicator']}></div>
    </div>
  );
