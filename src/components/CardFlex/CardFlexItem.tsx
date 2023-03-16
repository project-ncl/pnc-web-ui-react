import { FlexItem, FlexItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { ContentBox } from 'components/ContentBox/ContentBox';

import styles from './CardFlexItem.module.css';

const flexValue: FlexItemProps['flex'] = { default: 'flex_1' };

interface ICardFlexItemProps {}

export const CardFlexItem = ({ children }: PropsWithChildren<ICardFlexItemProps>) => (
  <FlexItem flex={flexValue}>
    <ContentBox>
      <div className={styles['card-content']}>{children}</div>
    </ContentBox>
  </FlexItem>
);
