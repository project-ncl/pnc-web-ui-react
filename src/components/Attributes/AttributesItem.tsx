import { GridItem } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './Attributes.module.css';

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
      {/* zero is falsy */}
      {children || children === 0 ? children : <EmptyStateSymbol variant="text" />}
    </GridItem>
  </>
);
