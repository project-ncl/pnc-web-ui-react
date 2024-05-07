import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import styles from './IconWrapper.module.css';

interface IIconWrapperProps {
  variant: 'small' | 'medium';
}

/**
 * Icon Wrapper aims to set minimal width to icons and stop them disapearing with resizing.
 *
 * @param children - icon to display
 */
export const IconWrapper = ({ children, variant }: PropsWithChildren<IIconWrapperProps>) => (
  <span
    className={css(
      styles['icon-wrapper'],
      variant === 'small' && styles['icon-wrapper--small'],
      variant === 'medium' && styles['icon-wrapper--medium']
    )}
  >
    {children}
  </span>
);
