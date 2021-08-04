import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  AboutModal,
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
  TextContent,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import { BellIcon, CaretDownIcon, CogIcon, OutlinedQuestionCircleIcon, UserIcon } from '@patternfly/react-icons';
import { Link, useLocation } from 'react-router-dom';
import pncLogoText from './pnc-logo-text.svg';

interface IAppLayout {
  children: React.ReactNode;
}

export const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const AppLogoImage = () => <img src={pncLogoText} alt="Newcastle Build System" />;

  const AppHeaderTools = () => {
    const pncRepositoryUrl = 'https://github.com/project-ncl/pnc';
    const pncWebUiRepositoryUrl = 'https://github.com/project-ncl/pnc-web-ui-react';
    const pncUserGuideUrl = 'https://docs.engineering.redhat.com/display/JP/User%27s+guide';

    const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
    const [isHeaderQuestionOpen, setIsHeaderQuestionOpen] = useState(false);
    const [isHeaderUserOpen, setIsHeaderUserOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const headerConfigDropdownItems = [
      <DropdownItem key="variables" href="/admin/variables">
        Variables
      </DropdownItem>,
      <DropdownItem key="administration" href="/admin/administration">
        Administration
      </DropdownItem>,
    ];

    const headerQuestionDropdownItems = [
      <DropdownItem
        key="about"
        onClick={() => {
          setIsAboutModalOpen(true);
          setIsHeaderQuestionOpen(false);
        }}
      >
        About
      </DropdownItem>,
      <DropdownItem key="users guide" href={pncUserGuideUrl} target="_blank">
        User's guide
      </DropdownItem>,
    ];

    const headerUserDropdownItems = [<DropdownItem key="logout">Logout</DropdownItem>];

    function processLogin() {
      if (currentUser) {
        setIsHeaderUserOpen(!isHeaderUserOpen);
      } else {
        setCurrentUser({ userName: 'Jhon Doe' });
      }
    }

    function processLogout() {
      setCurrentUser(null);
      setIsHeaderUserOpen(false);
    }

    return (
      <>
        <PageHeaderTools>
          <PageHeaderToolsGroup>
            <PageHeaderToolsItem>
              <Dropdown
                toggle={
                  <DropdownToggle
                    toggleIndicator={null}
                    icon={<CogIcon />}
                    onToggle={() => {
                      setIsHeaderConfigOpen(!isHeaderConfigOpen);
                    }}
                  >
                    <CaretDownIcon />
                  </DropdownToggle>
                }
                isOpen={isHeaderConfigOpen}
                isPlain={true}
                dropdownItems={headerConfigDropdownItems}
              />
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
              <Dropdown
                toggle={
                  <DropdownToggle
                    toggleIndicator={null}
                    icon={<OutlinedQuestionCircleIcon />}
                    onToggle={() => {
                      setIsHeaderQuestionOpen(!isHeaderQuestionOpen);
                    }}
                  >
                    <CaretDownIcon />
                  </DropdownToggle>
                }
                isOpen={isHeaderQuestionOpen}
                isPlain={true}
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
                onSelect={processLogout}
                toggle={
                  <DropdownToggle toggleIndicator={null} icon={<UserIcon />} onToggle={processLogin}>
                    {currentUser ? currentUser.userName : 'Login'}
                    {currentUser && <CaretDownIcon />}
                  </DropdownToggle>
                }
                isOpen={isHeaderUserOpen}
                isPlain={true}
                dropdownItems={headerUserDropdownItems}
              />
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
        </PageHeaderTools>
        <React.Fragment>
          <AboutModal
            isOpen={isAboutModalOpen}
            onClose={() => {
              setIsAboutModalOpen(false);
            }}
            trademark="Red Hat, Inc. © 2021"
            brandImageSrc={pncLogoText}
            brandImageAlt="PNC Logo"
            productName="Newcastle Build System(PNC)"
          >
            <TextContent>
              <TextList component="dl">
                <TextListItem component="dt">
                  <a href={pncRepositoryUrl}>PNC System Version</a>
                </TextListItem>
                <TextListItem component="dd">master</TextListItem>
                <TextListItem component="dt">
                  <a href={pncWebUiRepositoryUrl}>PNC Web UI Version</a>
                </TextListItem>
                <TextListItem component="dd">1.1.1-SNAPSHOT 27 July 2021 Rev: b46a170</TextListItem>
              </TextList>
            </TextContent>
          </AboutModal>
        </React.Fragment>
      </>
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
