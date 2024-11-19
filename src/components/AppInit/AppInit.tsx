import { Spinner } from '@patternfly/react-core';

import styles from './AppInit.module.css';

export const AppInit = () => (
  <div className={styles['app-init']}>
    <Spinner diameter="45px" aria-label="Initialization" />
  </div>
);
