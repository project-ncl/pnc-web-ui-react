import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  Page,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageHeader,
  /*Breadcrumb,
  BreadcrumbItem,*/
  PageSidebar,
} from '@patternfly/react-core';
import { BellIcon, CaretDownIcon, CogIcon, OutlinedQuestionCircleIcon, UserIcon } from '@patternfly/react-icons';
import { Link, useLocation } from 'react-router-dom';
import pncLogoText from './pnc-logo-text.svg';

interface IAppLayout {
  children: React.ReactNode;
}

export const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const AppLogoImage = () => <img src={pncLogoText} alt="Newcastle Build System" />;

  const headerConfigDropdownItems = [
    <DropdownItem key="variables" href="/admin/variables">
      Variables
    </DropdownItem>,
    <DropdownItem key="administration" href="/admin/administration">
      Administration
    </DropdownItem>,
  ];

  const headerQuestionDropdownItems = [
    <DropdownItem key="about" href="/pnc-web/about">
      About
    </DropdownItem>,
    <DropdownItem key="users guide" href="https://docs.engineering.redhat.com/display/JP/User%27s+guide">
      User's guide
    </DropdownItem>,
  ];

  const headerUserDropdownItems = [<DropdownItem key="logout">Logout</DropdownItem>];

  const AppHeaderTools = () => {
    const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
    const [isHeaderQuestionOpen, setIsHeaderQuestionOpen] = useState(false);
    const [isHeaderUserOpen, setIsHeaderUserOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    return (
      <PageHeaderTools>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem isSelected={true}>
            <Dropdown
              onSelect={() => {
                setIsHeaderConfigOpen(!isHeaderConfigOpen);
              }}
              toggle={
                <DropdownToggle
                  id="toggle-config"
                  toggleIndicator={null}
                  onToggle={() => {
                    setIsHeaderConfigOpen(!isHeaderConfigOpen);
                  }}
                >
                  <CogIcon />
                  <CaretDownIcon />
                </DropdownToggle>
              }
              isOpen={isHeaderConfigOpen}
              isPlain
              dropdownItems={headerConfigDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Dropdown
              onSelect={() => {
                setIsHeaderQuestionOpen(!isHeaderQuestionOpen);
              }}
              toggle={
                <DropdownToggle
                  id="toggle-question"
                  toggleIndicator={null}
                  onToggle={() => {
                    setIsHeaderQuestionOpen(!isHeaderQuestionOpen);
                  }}
                >
                  <OutlinedQuestionCircleIcon />
                  <CaretDownIcon />
                </DropdownToggle>
              }
              isOpen={isHeaderQuestionOpen}
              isPlain
              dropdownItems={headerQuestionDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Button variant={ButtonVariant.plain}>
              <BellIcon />
            </Button>
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Dropdown
              onSelect={() => {
                setCurrentUser(null);
                setIsHeaderUserOpen(false);
              }}
              toggle={
                <DropdownToggle
                  id="toggle-user-name"
                  toggleIndicator={null}
                  icon={<UserIcon />}
                  onToggle={() => {
                    if (currentUser) {
                      setIsHeaderUserOpen(!isHeaderUserOpen);
                    } else {
                      setCurrentUser({ userName: 'Jhon Doe' });
                    }
                  }}
                >
                  {currentUser ? currentUser.userName : 'Login'}
                  {currentUser && <CaretDownIcon />}
                </DropdownToggle>
              }
              isOpen={isHeaderUserOpen}
              isPlain
              dropdownItems={headerUserDropdownItems}
            />
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
      </PageHeaderTools>
    );
  };

  const AppHeader = <PageHeader logo={<AppLogoImage />} headerTools={<AppHeaderTools />} showNavToggle />;

  const AppNavigation = () => {
    const { pathname } = useLocation();

    return (
      <Nav>
        <NavList>
          <NavItem isActive={pathname === '/'}>
            <Link to="/">Dashboard</Link>
          </NavItem>

          <NavItem isActive={pathname.includes('/products')}>
            <Link to="/products">Products</Link>
          </NavItem>

          <NavItem isActive={pathname.includes('/projects')}>
            <Link to="/projects">Projects</Link>
          </NavItem>

          <NavExpandable
            title="Configs"
            groupId="grp-configs"
            isActive={pathname.includes('/build-configs') || pathname.includes('/group-configs')}
          >
            <NavItem groupId="grp-configs" itemId="grp-configs_build-configs" isActive={pathname.includes('/build-configs')}>
              <Link to="/build-configs">Build Configs</Link>
            </NavItem>

            <NavItem groupId="grp-configs" itemId="grp-configs_group-configs" isActive={pathname.includes('/group-configs')}>
              <Link to="/group-configs">Group Configs</Link>
            </NavItem>
          </NavExpandable>

          <NavExpandable
            title="Builds"
            groupId="grp-builds"
            isActive={pathname.includes('/builds') || pathname.includes('/group-builds')}
          >
            <NavItem groupId="grp-builds" itemId="grp-builds_builds" isActive={pathname.includes('/builds')}>
              <Link to="/builds">Builds</Link>
            </NavItem>

            <NavItem groupId="grp-builds" itemId="grp-builds_group-builds" isActive={pathname.includes('/group-builds')}>
              <Link to="/group-builds">Group Builds</Link>
            </NavItem>
          </NavExpandable>

          <NavItem isActive={pathname.includes('/artifacts')}>
            <Link to="/artifacts">Artifacts</Link>
          </NavItem>

          <NavItem isActive={pathname.includes('/scm-repositories')}>
            <Link to="/scm-repositories">SCM Repositories</Link>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  const AppSidebar = <PageSidebar nav={<AppNavigation />} />;

  /*
  const AppBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem>Section home</BreadcrumbItem>
      <BreadcrumbItem to="#">Section title</BreadcrumbItem>
      <BreadcrumbItem to="#">Section title</BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        Section landing
      </BreadcrumbItem>
    </Breadcrumb>
  );
  */

  return (
    <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
      {children}
    </Page>
  );
};
