import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
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
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { useResizeObserver } from 'hooks/useResizeObserver';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TopBarInfo } from 'components/TopBar/TopBarInfo';

import * as genericSettingsApi from 'services/genericSettingsApi';
import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

import pncLogoText from './pnc-logo-text.svg';

export const AppLayout = () => {
  const webConfig = webConfigService.getWebConfig();

  const user = keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null;

  const [announcementMessage, setAnnouncementMessage] = useState<string>('');

  const { ref: topBarsRef, height: topBarsHeight } = useResizeObserver();

  useEffect(() => {
    genericSettingsApi
      .getAnnouncementBanner()
      .then((response) => {
        setAnnouncementMessage(response.data.banner || '');
      })
      .catch((error) => {
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
      <ProtectedComponent role={AUTH_ROLE.Admin} hide key="administration">
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

    const headerKeycloakUnavailableDropdownItems = [
      <DropdownItem component={<Link to="/system/keycloak-status">Keycloak Status</Link>} key="keycloak-status" />,
    ];

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
                isPlain
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
                <Dropdown
                  toggle={
                    <DropdownToggle
                      toggleIndicator={null}
                      icon={<UserIcon />}
                      onToggle={() => {
                        setIsHeaderUserOpen((isHeaderUserOpen) => !isHeaderUserOpen);
                      }}
                    >
                      KEYCLOAK UNAVAILABLE <CaretDownIcon />
                    </DropdownToggle>
                  }
                  isOpen={isHeaderUserOpen}
                  isPlain={true}
                  dropdownItems={headerKeycloakUnavailableDropdownItems}
                />
              )}
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
        </PageHeaderTools>
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

          <NavItem isActive={pathname.includes('/deliverables-analysis')}>
            <Link to="/deliverables-analysis">Deliverables Analyses</Link>
          </NavItem>

          <NavExpandable title="Insights" groupId="insights" isActive={pathname.includes('/product-milestone-comparison')}>
            <NavItem
              groupId="insights"
              itemId="insights_product-milestone-comparison"
              isActive={pathname.includes('/product-milestone-comparison')}
            >
              <Link to="/insights/product-milestone-comparison">Product Milestone Comparison</Link>
            </NavItem>
          </NavExpandable>
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
      <div ref={topBarsRef}>{announcementMessage && <TopBarInfo>Announcement - {announcementMessage}</TopBarInfo>}</div>
      <div style={{ height: `calc(100% - ${topBarsHeight}px)` }}>
        <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar>
          <Outlet />
        </Page>
      </div>
    </>
  );
};
