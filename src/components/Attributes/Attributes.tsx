import { Grid } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import styles from './Attributes.module.css';

interface IAttributesProps {}

/**
 * Represents a stylized name-value table component.
 */
export const Attributes = ({ children }: PropsWithChildren<IAttributesProps>) => (
  <Grid hasGutter className={styles['minmax-grid']}>
    {children}
  </Grid>
);
