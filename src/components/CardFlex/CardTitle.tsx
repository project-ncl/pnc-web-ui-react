import { PropsWithChildren } from 'react';

import styles from './CardTitle.module.css';

interface ICardTitleProps {}

export const CardTitle = ({ children }: PropsWithChildren<ICardTitleProps>) => (
  <div className={styles['card-title']}>{children}</div>
);
