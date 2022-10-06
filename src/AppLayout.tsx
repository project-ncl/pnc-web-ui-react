import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Flex,
  FlexItem,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  /*Breadcrumb,
BreadcrumbItem,*/
  PageSidebar,
} from '@patternfly/react-core';
import { BellIcon, CaretDownIcon, CogIcon, OutlinedQuestionCircleIcon, UserIcon } from '@patternfly/react-icons';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AboutModalPage } from './components/AboutModalPage/AboutModalPage';
import { ProtectedComponent } from './components/ProtectedContent/ProtectedComponent';
import { TopBarError } from './components/TopBar/TopBarError';
import { TopBarInfo } from './components/TopBar/TopBarInfo';

import * as WebConfigAPI from './services/WebConfigService';
import { genericSettingsService } from './services/genericSettingsService';
import { AUTH_ROLE, keycloakService } from './services/keycloakService';

import pncLogoText from './pnc-logo-text.svg';

interface IAppLayoutProps {}

export const AppLayout = ({ children }: React.PropsWithChildren<IAppLayoutProps>) => {
  const webConfig = WebConfigAPI.getWebConfig();

  const user = keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null;

  const [announcementMessage, setAnnouncementMessage] = useState<string>('');

  useEffect(() => {
    genericSettingsService
      .getAnnouncementBanner()
      .then((response: any) => {
        setAnnouncementMessage(response.data.banner);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

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
      {announcementMessage && <TopBarInfo>Announcement - {announcementMessage}</TopBarInfo>}
      {!keycloakService.isKeycloakAvailable && (
        <TopBarError>
          RESTRICTED MODE - Keycloak could not be initialized, check if there is network, vpn or certificate issue
        </TopBarError>
      )}
      <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
        {children}
      </Page>
    </>
  );
};
