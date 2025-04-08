import { DropdownItem, DropdownItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router';

interface IDropdownLinkItemProps extends DropdownItemProps {
  to: string;
}

export const DropdownLinkItem = ({ to, children, ...restDropdownItemProps }: PropsWithChildren<IDropdownLinkItemProps>) => (
  <DropdownItem component={(props: any) => <Link {...props} to={to} />} {...restDropdownItemProps}>
    {children}
  </DropdownItem>
);
