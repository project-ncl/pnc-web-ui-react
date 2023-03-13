import { Flex, FlexProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

const alignItemsFlexStart: FlexProps['alignItems'] = { default: 'alignItemsFlexStart' };
const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };
const flexWrap: FlexProps['flexWrap'] = { default: 'wrap' };
const styleGap = { gap: '1rem' };

interface ICardFlexProps {}

export const CardFlex = ({ children }: PropsWithChildren<ICardFlexProps>) => (
  <Flex alignItems={alignItemsFlexStart} spaceItems={spaceItemsNone} flexWrap={flexWrap} style={styleGap}>
    {children}
  </Flex>
);
