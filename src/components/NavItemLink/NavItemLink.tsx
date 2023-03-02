import { NavItem } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

interface INavItemLinkProps {
  to: string;
  groupId?: string;
  itemId?: string;
  matchChildren?: boolean;
}

export const NavItemLink = ({ children, to, groupId, itemId, matchChildren = true }: PropsWithChildren<INavItemLinkProps>) => {
  const { pathname } = useLocation();

  return (
    <NavItem isActive={!!matchPath({ path: to, end: !matchChildren }, pathname)} groupId={groupId} itemId={itemId}>
      <Link to={to}>{children}</Link>
    </NavItem>
  );
};
