import { NavExpandable } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

interface INavItemExpandableProps {
  to: string[];
  title: string;
  groupId?: string;
  matchChildren?: boolean;
}

export const NavItemExpandable = ({
  children,
  to,
  title,
  groupId,
  matchChildren = true,
}: PropsWithChildren<INavItemExpandableProps>) => {
  const { pathname } = useLocation();

  return (
    <NavExpandable
      isActive={to.some((path: string) => !!matchPath({ path, end: !matchChildren }, pathname))}
      title={title}
      groupId={groupId}
    >
      {children}
    </NavExpandable>
  );
};
