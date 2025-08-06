import { FlexItem } from '@patternfly/react-core';

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

const flexAlignRight = { default: 'alignRight' } as const;

const flexAllowFloat = { default: 'flex_1' } as const;
