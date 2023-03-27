import { FlexItem, FlexItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { IDescription } from 'components/DescriptionIcon/DescriptionIcon';

import styles from './CardFlexItem.module.css';

const flexValue: FlexItemProps['flex'] = { default: 'flex_1' };

interface ICardFlexItemProps {
  description?: IDescription | string;
}

export const CardFlexItem = ({ children, description }: PropsWithChildren<ICardFlexItemProps>) => (
  <FlexItem flex={flexValue}>
    <ContentBox description={description}>
      <div className={styles['card-content']}>{children}</div>
    </ContentBox>
  </FlexItem>
);
