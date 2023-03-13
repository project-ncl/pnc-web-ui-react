import { FlexItem, FlexItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { ContentBox } from 'components/ContentBox/ContentBox';

import styles from './CardFlexItem.module.css';

interface ICardTextProps {}

export const LargeCardText = ({ children }: PropsWithChildren<ICardTextProps>) => (
  <div className={styles['large-font']}>{children}</div>
);

export const ExtraLargeCardText = ({ children }: PropsWithChildren<ICardTextProps>) => (
  <div className={styles['extra-large-font']}>{children}</div>
);

const flexValue: FlexItemProps['flex'] = { default: 'flex_1' };

interface ICardFlexItemProps {}

export const CardFlexItem = ({ children }: PropsWithChildren<ICardFlexItemProps>) => (
  <FlexItem flex={flexValue}>
    <ContentBox>
      <div className={styles['card-content']}>{children}</div>
    </ContentBox>
  </FlexItem>
);
