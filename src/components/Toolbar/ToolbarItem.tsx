import { FlexItem, FlexProps } from '@patternfly/react-core';

const flexAlignRight: FlexProps['align'] = { default: 'alignRight' };
const flexAllowFloat: FlexProps['flex'] = { default: 'flex_1' };

interface IToolbarItemProps {
  alignRight?: boolean;
  marginLeft?: string;
  reservedWidth?: boolean;
}

export const ToolbarItem = ({ children, alignRight, marginLeft, reservedWidth }: React.PropsWithChildren<IToolbarItemProps>) => (
  <FlexItem
    flex={reservedWidth ? flexAllowFloat : undefined}
    style={marginLeft ? { marginLeft } : undefined}
    align={alignRight ? flexAlignRight : undefined}
  >
    {children}
  </FlexItem>
);
