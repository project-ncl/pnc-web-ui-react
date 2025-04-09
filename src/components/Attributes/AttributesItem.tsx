import { GridItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren, ReactNode } from 'react';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { InfoTooltip } from 'components/InfoTooltip/InfoTooltip';

import styles from './Attributes.module.css';

interface IAttributesItemProps {
  title: React.ReactNode;
  tooltip?: ReactNode;
  forceStringWrap?: boolean;
}

export const AttributesItem = ({ children, title, tooltip, forceStringWrap }: PropsWithChildren<IAttributesItemProps>) => (
  <>
    <GridItem xl2={2} lg={3} sm={12} className={styles['name']}>
      <>
        {title}
        {tooltip && <InfoTooltip tooltip={tooltip} tooltipPosition="right-start" />}
      </>
    </GridItem>
    <GridItem xl2={10} lg={9} sm={12} className={css(forceStringWrap && 'overflow-break-word')}>
      {/* zero is falsy */}
      {children || children === 0 ? children : <EmptyStateSymbol />}
    </GridItem>
  </>
);
