import { PropsWithChildren } from 'react';

import styles from './TooltipSimple.module.css';

interface ITooltipSimple {
  title: string;
}

/**
 * Simple tooltip implementation compatible also with inline elements. It operates solely on the browser built-in capabilities, no additional libraries are included.
 *
 * @param title - text tooltip to be displayed
 */
export const TooltipSimple = ({ title, children }: PropsWithChildren<ITooltipSimple>) => (
  <span className={`${styles['tooltip-simple']}`} title={title}>
    {children}
  </span>
);
