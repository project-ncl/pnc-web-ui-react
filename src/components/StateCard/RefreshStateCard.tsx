import styles from './RefreshStateCard.module.css';

interface IRefreshStateCard {}

/**
 * Refresh State component with loading indicator displayed over real data that were valid for previous state.
 */
export const RefreshStateCard = ({ children }: React.PropsWithChildren<IRefreshStateCard>) => (
  <div className={styles['refresh-state-card']}>
    <div className={styles['refresh-state-card__body']}>{children}</div>
    <div className={styles['refresh-state-card__indicator']}></div>
  </div>
);
