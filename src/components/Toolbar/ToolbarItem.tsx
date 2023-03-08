import { FlexItem, FlexProps } from '@patternfly/react-core';

const flexAlignRight: FlexProps['align'] = { default: 'alignRight' };

interface IToolbarItemProps {
  alignRight?: boolean;
  marginLeft?: string;
}

export const ToolbarItem = ({ children, alignRight, marginLeft }: React.PropsWithChildren<IToolbarItemProps>) => (
  <FlexItem style={marginLeft ? { marginLeft } : undefined} align={alignRight ? flexAlignRight : undefined}>
    {children}
  </FlexItem>
);
