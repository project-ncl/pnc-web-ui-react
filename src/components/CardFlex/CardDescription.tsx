import { PropsWithChildren } from 'react';

import styles from './CardDescription.module.css';

interface ICardDescriptionProps {}

export const CardDescription = ({ children }: PropsWithChildren<ICardDescriptionProps>) => (
  <div className={styles['card-description']}>{children}</div>
);
