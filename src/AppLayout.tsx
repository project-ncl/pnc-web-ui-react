import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Flex,
  FlexItem,
  Nav,
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
import { Link } from 'react-router-dom';

import { NavItemExpandable } from 'components/NavItemExpandable/NavItemExpandable';
import { NavItemLink } from 'components/NavItemLink/NavItemLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TopBarError } from 'components/TopBar/TopBarError';
import { TopBarInfo } from 'components/TopBar/TopBarInfo';

import * as genericSettingsApi from 'services/genericSettingsApi';
import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

import pncLogoText from './pnc-logo-text.svg';

interface IAppLayoutProps {}

export const AppLayout = ({ children }: React.PropsWithChildren<IAppLayoutProps>) => {
  const webConfig = webConfigService.getWebConfig();

  const user = keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null;

  const [announcementMessage, setAnnouncementMessage] = useState<string>('');

  useEffect(() => {
    genericSettingsApi
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

    const headerConfigDropdownItems = [
      <DropdownItem component={<Link to="/admin/demo">Demo</Link>} key="demo" />,
      <DropdownItem component={<Link to="/admin/variables">Variables</Link>} key="variables" />,
      <ProtectedComponent role={AUTH_ROLE.Admin} hide={true} key="administration">
        <DropdownItem component={<Link to="/admin/administration">Administration</Link>} />
      </ProtectedComponent>,
    ];

    const headerQuestionDropdownItems = [
      <DropdownItem component={<Link to="/about">About</Link>} key="about" />,
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
      </>
    );
  };

  const AppHeader = <PageHeader logo={<AppLogoImage />} headerTools={<AppHeaderTools />} showNavToggle />;

  const AppNavigation = () => (
    <Nav>
      <NavList>
        <NavItemLink matchChildren={false} to="/">
          Dashboard
        </NavItemLink>

        <NavItemLink to="/products">Products</NavItemLink>

        <NavItemLink to="/projects">Projects</NavItemLink>

        <NavItemExpandable title="Configs" to={['/build-configs', '/group-configs']} groupId="grp-configs">
          <NavItemLink to="/build-configs" groupId="grp-configs" itemId="grp-configs_build-configs">
            Build Configs
          </NavItemLink>

          <NavItemLink to="/group-configs" groupId="grp-configs" itemId="grp-configs_group-configs">
            Group Configs
          </NavItemLink>
        </NavItemExpandable>

        <NavItemExpandable title="Builds" to={['/builds', '/group-builds']} groupId="grp-builds">
          <NavItemLink to="/builds" groupId="grp-builds" itemId="grp-builds_builds">
            Builds
          </NavItemLink>

          <NavItemLink to="/group-builds" groupId="grp-builds" itemId="grp-builds_group-builds">
            Group Builds
          </NavItemLink>
        </NavItemExpandable>

        <NavItemLink to="/artifacts">Artifacts</NavItemLink>

        <NavItemLink to="/scm-repositories">SCM Repositories</NavItemLink>
      </NavList>
    </Nav>
  );

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
