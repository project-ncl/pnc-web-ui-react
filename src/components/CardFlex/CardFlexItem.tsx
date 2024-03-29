import { FlexItem, FlexItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { IDescription } from 'components/BoxDescription/BoxDescription';
import { ContentBox } from 'components/ContentBox/ContentBox';

import styles from './CardFlexItem.module.css';

const flexValue: FlexItemProps['flex'] = { default: 'flex_1' };

interface ICardFlexItemProps {
  description?: IDescription;
}

export const CardFlexItem = ({ children, description }: PropsWithChildren<ICardFlexItemProps>) => (
  <FlexItem flex={flexValue}>
    <ContentBox description={description}>
      <div className={styles['card-content']}>{children}</div>
    </ContentBox>
  </FlexItem>
);
