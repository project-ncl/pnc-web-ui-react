import { GridItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './Attributes.module.css';

interface IAttributesItemProps {
  title: React.ReactNode;
  tooltip?: string;
  forceStringWrap?: boolean;
}

export const AttributesItem = ({ children, title, tooltip, forceStringWrap }: PropsWithChildren<IAttributesItemProps>) => (
  <>
    <GridItem xl2={2} lg={3} sm={12} className={styles['name']}>
      <>
        {title}
        {tooltip && <TooltipWrapper tooltip={tooltip} />}
      </>
    </GridItem>
    <GridItem xl2={10} lg={9} sm={12} className={css(forceStringWrap && 'overflow-break-word')}>
      {/* zero is falsy */}
      {children || children === 0 ? children : <EmptyStateSymbol />}
    </GridItem>
  </>
);
