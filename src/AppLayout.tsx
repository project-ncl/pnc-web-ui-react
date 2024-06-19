import {
  Button,
  ButtonVariant,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from '@patternfly/react-core/deprecated';
import {
  BellIcon,
  CaretDownIcon,
  CogIcon,
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
  UserIcon,
} from '@patternfly/react-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useMatches } from 'react-router-dom';

import { StorageKeys } from 'common/constants';

import { hasPncStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useResizeObserver } from 'hooks/useResizeObserver';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TopBarAnnouncement } from 'components/TopBar/TopBarAnnouncement';

import * as genericSettingsApi from 'services/genericSettingsApi';
import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

import { createDateTime } from 'utils/utils';

import pncLogoText from './pnc-logo-text.svg';

export const AppLayout = () => {
  const webConfig = webConfigService.getWebConfig();

  const user = keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null;

  const serviceContainerPncStatus = useServiceContainer(genericSettingsApi.getPncStatus);
  const serviceContainerPncStatusRunner = serviceContainerPncStatus.run;
  const serviceContainerPncStatusSetter = serviceContainerPncStatus.setData;

  const { ref: topBarsRef, height: topBarsHeight } = useResizeObserver();

  useEffect(() => {
    serviceContainerPncStatusRunner();
  }, [serviceContainerPncStatusRunner]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasPncStatusChanged(wsData)) {
          const wsMessage = JSON.parse(wsData.message);
          serviceContainerPncStatusSetter(wsMessage);
        }
      },
      [serviceContainerPncStatusSetter]
    )
  );

  const AppLogoImage = () => (
    <Link to="/" className="p-t-10 p-b-10">
      <img src={pncLogoText} alt="Newcastle Build System" />
    </Link>
  );

  const AppHeaderTools = () => {
    const pncUserGuideUrl = webConfig.userGuideUrl;
    const pncUserSupportUrl = webConfig.userSupportUrl;

    const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
    const [isHeaderQuestionOpen, setIsHeaderQuestionOpen] = useState(false);
    const [isHeaderUserOpen, setIsHeaderUserOpen] = useState(false);

    const loggerLabel = window.localStorage.getItem(StorageKeys.loggerLabel);

    const headerConfig = useMemo(
      () => ({
        color: loggerLabel ? 'red' : undefined,
        tooltip: loggerLabel ? `Logger Label is active: ${loggerLabel}, it can be deactivated on Preferences page` : undefined,
      }),
      [loggerLabel]
    );

    const headerConfigDropdownItems = [
      <DropdownItem component={<Link to="/preferences">Preferences</Link>} key="preferences" />,
      <DropdownItem component={<Link to="/admin/demo">Demo</Link>} key="demo" />,
      <DropdownItem component={<Link to="/admin/variables">Variables</Link>} key="variables" />,
      <ProtectedComponent role={AUTH_ROLE.Admin} hide key="administration">
        <DropdownItem component={<Link to="/admin/administration">Administration</Link>} />
      </ProtectedComponent>,
    ];

    const headerQuestionDropdownItems = [<DropdownItem component={<Link to="/about">About</Link>} key="about" />];

    if (pncUserGuideUrl) {
      headerQuestionDropdownItems.push(
        <DropdownItem key="users-guide" href={pncUserGuideUrl} target="_blank" rel="noopener noreferrer">
          User's guide <ExternalLinkAltIcon />
        </DropdownItem>
      );
    }

    if (pncUserSupportUrl) {
      headerQuestionDropdownItems.push(
        <DropdownItem
          key="users-channel"
          href={pncUserSupportUrl}
          title="Live user's support channel for PNC services provided by developers"
          target="_blank"
          rel="noopener noreferrer"
        >
          User's support <ExternalLinkAltIcon />
        </DropdownItem>
      );
    }

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
                    icon={<CogIcon color={headerConfig.color} />}
                    title={headerConfig.tooltip}
                    onToggle={() => {
                      setIsHeaderConfigOpen(!isHeaderConfigOpen);
                    }}
                  >
                    <CaretDownIcon color={headerConfig.color} />
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

  const appHeader = <PageHeader logo={<AppLogoImage />} headerTools={<AppHeaderTools />} showNavToggle />;

  const AppNavigation = () => {
    const pathname = useMatches()[1].pathname; //1 index = 2nd match which contains the first part of the path

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

          <ExperimentalContent>
            <ExperimentalContentMarker dataSource="mock" contentType="text" showTooltip>
              <NavExpandable title="Insights" groupId="insights" isActive={pathname.includes('/product-milestone-comparison')}>
                <NavItem
                  groupId="insights"
                  itemId="insights_product-milestone-comparison"
                  isActive={pathname.includes('/product-milestone-comparison')}
                >
                  <Link to="/insights/product-milestone-comparison">Product Milestone Comparison</Link>
                </NavItem>
              </NavExpandable>
            </ExperimentalContentMarker>
          </ExperimentalContent>
        </NavList>
      </Nav>
    );
  };

  const appSidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <AppNavigation />
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <>
      <div ref={topBarsRef}>
        {serviceContainerPncStatus.data && (
          <TopBarAnnouncement
            id="site-top-bar"
            banner={serviceContainerPncStatus.data.banner}
            isMaintenanceMode={serviceContainerPncStatus.data.isMaintenanceMode}
            eta={serviceContainerPncStatus.data.eta && createDateTime({ date: serviceContainerPncStatus.data.eta }).custom}
          />
        )}
      </div>
      <div style={{ height: topBarsHeight ? `calc(100% - ${topBarsHeight}px)` : '100%' }}>
        <Page header={appHeader} sidebar={appSidebar} isManagedSidebar>
          <Outlet />
        </Page>
      </div>
    </>
  );
};
