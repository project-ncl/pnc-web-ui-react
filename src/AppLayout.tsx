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
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { BellIcon, CaretDownIcon, CogIcon, OutlinedQuestionCircleIcon, UserIcon } from '@patternfly/react-icons';
import { Link, useLocation } from 'react-router-dom';
import pncLogoText from './pnc-logo-text.svg';
import { AboutModalPage } from './components/AboutModalPage/AboutModalPage';
import * as WebConfigAPI from './services/WebConfigService';
import { AUTH_ROLE, keycloakService } from './services/keycloakService';
import styles from './AppLayout.module.css';
import { ProtectedComponent } from './components/ProtectedContent/ProtectedComponent';

interface IAppLayoutProps {}

export const AppLayout = ({ children }: React.PropsWithChildren<IAppLayoutProps>) => {
  const webConfig = WebConfigAPI.getWebConfig();

  const user = keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null;

  const AppLogoImage = () => <img src={pncLogoText} alt="Newcastle Build System" />;

  const AppHeaderTools = () => {
    const pncUserGuideUrl = webConfig.userGuideUrl;

    const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
    const [isHeaderQuestionOpen, setIsHeaderQuestionOpen] = useState(false);
    const [isHeaderUserOpen, setIsHeaderUserOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const headerConfigDropdownItems = [
      <DropdownItem component={<Link to="/admin/demo">Demo</Link>} key="demo" />,
      <DropdownItem component={<Link to="/admin/variables">Variables</Link>} key="variables" />,
      <ProtectedComponent role={AUTH_ROLE.Admin} hide={true}>
        <DropdownItem component={<Link to="/admin/administration">Administration</Link>} key="administration" />
      </ProtectedComponent>,
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
      <DropdownItem key="users guide" href={pncUserGuideUrl} target="_blank" rel="noopener noreferrer">
        User's guide
      </DropdownItem>,
    ];

    const headerUserDropdownItems = [<DropdownItem key="logout">Logout</DropdownItem>];

    function processLogin() {
      if (user) {
        setIsHeaderUserOpen(!isHeaderUserOpen);
      } else {
        keycloakService.login().catch(() => {
          throw new Error('Keycloak login failed.');
        });
      }
    }

    function processLogout() {
      keycloakService.logout();
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
              {keycloakService.isKeycloakAvailable ? (
                <Dropdown
                  onSelect={processLogout}
                  toggle={
                    <DropdownToggle toggleIndicator={null} icon={<UserIcon />} onToggle={processLogin}>
                      {user ? user : 'Login'}
                      {user && <CaretDownIcon />}
                    </DropdownToggle>
                  }
                  isOpen={isHeaderUserOpen}
                  isPlain={true}
                  dropdownItems={headerUserDropdownItems}
                />
              ) : (
                <Button isDisabled={true} variant={ButtonVariant.plain}>
                  <Flex>
                    <FlexItem>
                      <UserIcon />
                    </FlexItem>
                    <FlexItem>KEYCLOAK UNAVAILABLE</FlexItem>
                  </Flex>
                </Button>
              )}
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
        </PageHeaderTools>
        <AboutModalPage
          isOpen={isAboutModalOpen}
          onClose={() => {
            setIsAboutModalOpen(false);
          }}
        />
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
    <>
      {!keycloakService.isKeycloakAvailable && (
        <div className={styles['top-level-error']}>
          RESTRICTED MODE - Keycloak could not be initialized, check if there is network, vpn or certificate issue
        </div>
      )}
      <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
        {children}
      </Page>
    </>
  );
};
