import { FlexItem, FlexProps } from '@patternfly/react-core';

const flexAlignRight: FlexProps['align'] = { default: 'alignRight' };

interface IToolbarItemProps {
  alignRight?: boolean;
}

export const ToolbarItem = ({ alignRight, children }: React.PropsWithChildren<IToolbarItemProps>) => (
  <FlexItem align={alignRight ? flexAlignRight : undefined}>{children}</FlexItem>
);
