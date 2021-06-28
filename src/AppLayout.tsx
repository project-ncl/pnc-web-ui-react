import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  Page,
  Button,
  ButtonVariant,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageHeader,
  Breadcrumb,
  BreadcrumbItem,
  PageSidebar,
} from '@patternfly/react-core';
import {
  CogIcon,
  OutlinedQuestionCircleIcon,
  BellIcon,
} from '@patternfly/react-icons';
import pncLogoText from './pnc-logo-text.svg';

interface IAppLayout {
  children: React.ReactNode;
}

export const AppLayout: React.FunctionComponent<IAppLayout> = ({
  children,
}) => {
  const AppLogoImage = () => (
    <img src={pncLogoText} alt="Newcastle Build System" />
  );

  const AppHeaderTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <Button variant={ButtonVariant.plain}>
            <CogIcon />
          </Button>
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <Button variant={ButtonVariant.plain}>
            <OutlinedQuestionCircleIcon />
          </Button>
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <Button variant={ButtonVariant.plain}>
            <BellIcon />
          </Button>
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );

  const AppHeader = (
    <PageHeader
      logo={<AppLogoImage />}
      headerTools={AppHeaderTools}
      showNavToggle
    />
  );

  const AppNavigation = (
    <Nav>
      <NavList>
        <NavItem>Dashboard</NavItem>
        <NavItem>Products</NavItem>
        <NavItem>Projects</NavItem>
        <NavExpandable title="Configs" groupId="grp-1">
          <NavItem to="#build-configs" groupId="grp-1" itemId="grp-1_itm-1">
            Build Configs
          </NavItem>
          <NavItem to="#group-configs" groupId="grp-1" itemId="grp-1_itm-2">
            Group Configs
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );

  const AppSidebar = <PageSidebar nav={AppNavigation} />;

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

  return (
    <Page
      header={AppHeader}
      sidebar={AppSidebar}
      breadcrumb={AppBreadcrumb}
      isManagedSidebar
    >
      {children}
    </Page>
  );
};
