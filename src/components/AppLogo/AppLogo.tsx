import { Brand } from '@patternfly/react-core';
import { Link } from 'react-router';

import pncLogoText from '../../pnc-logo-text.svg';
import styles from './AppLogo.module.css';

export const AppLogo = () => (
  <Link to="/">
    <Brand src={pncLogoText} alt="Newcastle Build System" heights={brandHeights} className={styles['app-logo']} />
  </Link>
);

const brandHeights = { default: '100%' };
