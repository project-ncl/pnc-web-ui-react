import { Grid } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import styles from './Attributes.module.css';

interface IAttributesProps {
  isGridUniform?: boolean;
}

/**
 * Represents a stylized name-value table component.
 */
export const Attributes = ({ children, isGridUniform = true }: PropsWithChildren<IAttributesProps>) => (
  <Grid hasGutter className={css(isGridUniform && styles['uniform-grid'])}>
    {children}
  </Grid>
);
