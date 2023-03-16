import { Grid, GridItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './AttributesItems.module.css';

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

interface IAttributesItemProps {
  title: React.ReactNode;
  tooltip?: string;
}

export const AttributesItem = ({ children, title, tooltip }: PropsWithChildren<IAttributesItemProps>) => (
  <>
    <GridItem xl={3} lg={4} md={6} sm={12} className={styles['name']}>
      <>
        {title}
        {tooltip && <TooltipWrapper tooltip={tooltip} />}
      </>
    </GridItem>
    <GridItem xl={9} lg={8} md={6} sm={12}>
      {children ? children : <EmptyStateSymbol variant="text" />}
    </GridItem>
  </>
);
