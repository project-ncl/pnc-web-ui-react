import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

import styles from './RefreshStateCard.module.css';

interface IRefreshStateCard {
  isInline?: boolean;
}

/**
 * Refresh State component with loading indicator displayed over real data that were valid for previous state.
 */
export const RefreshStateCard = ({ children, isInline = false }: React.PropsWithChildren<IRefreshStateCard>) =>
  isInline ? (
    <LoadingSpinner isInline />
  ) : (
    <div className={styles['refresh-state-card']}>
      <div className={styles['refresh-state-card__body']}>{children}</div>
      <div className={styles['refresh-state-card__indicator']}></div>
    </div>
  );
