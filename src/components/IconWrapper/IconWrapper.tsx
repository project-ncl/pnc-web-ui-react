import { PropsWithChildren } from 'react';

import styles from './IconWrapper.module.css';

/**
 * Icon Wrapper aims to set minimal width to icons and stop them disapearing with resizing.
 *
 * @param children - icon to display
 */
export const IconWrapper = ({ children }: PropsWithChildren<{}>) => <span className={styles['icon-wrapper']}>{children}</span>;
