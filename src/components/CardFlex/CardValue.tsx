import { PropsWithChildren } from 'react';

import styles from './CardText.module.css';

interface ICardValueProps {}

export const CardValue = ({ children }: PropsWithChildren<ICardValueProps>) => (
  <div className={styles['card-value']}>{children}</div>
);
