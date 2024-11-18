import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  BarsIcon,
  CaretDownIcon,
  CogIcon,
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
  UserIcon,
} from '@patternfly/react-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useMatches } from 'react-router-dom';

import { hasPncStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useResizeObserver } from 'hooks/useResizeObserver';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { StorageKeys, useStorage } from 'hooks/useStorage';

import { DropdownLinkItem } from 'components/Dropdown/DropdownLinkItem';
import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { LegacyUrlRedirector } from 'components/OldUrlRedirector/LegacyUrlRedirector';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { OldUIAnnouncement } from 'components/TopBar/OldUIAnnouncement';
import { TopBarAnnouncement } from 'components/TopBar/TopBarAnnouncement';

import { IAuthBroadcastMessage, authBroadcastService } from 'services/broadcastService';
import * as genericSettingsApi from 'services/genericSettingsApi';
import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

import { createDateTime } from 'utils/utils';

import pncLogoText from './pnc-logo-text.svg';

export const AppLayout = () => {
  const webConfig = webConfigService.getWebConfig();

  const [user, setUser] = useState(keycloakService.isKeycloakAvailable ? keycloakService.getUser() : null);

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

  useEffect(() => {
    const removeAuthListener = authBroadcastService.addMessageListener((event: MessageEvent<IAuthBroadcastMessage>) => {
      setUser(event.data.user);
    });

    return () => {
      removeAuthListener();
      authBroadcastService.close();
    };
  }, []);

  const AppLogoImage = () => (
    <Link to="/" className="p-t-10 p-b-10">
      <img src={pncLogoText} alt="Newcastle Build System" />
    </Link>
  );

  const AppHeaderToolbar = () => {
    const pncUserGuideUrl = webConfig.userGuideUrl;
    const pncUserSupportUrl = webConfig.userSupportUrl;

    const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
    const [isHeaderQuestionOpen, setIsHeaderQuestionOpen] = useState(false);
    const [isHeaderUserOpen, setIsHeaderUserOpen] = useState(false);

    const { storageValue: loggerLabel } = useStorage<string>({
      storageKey: StorageKeys.loggerLabel,
      initialValue: '',
    });

    const headerConfig = useMemo(
      () => ({
        color: loggerLabel ? 'red' : undefined,
        tooltip: loggerLabel ? `Logger Label is active: ${loggerLabel}, it can be deactivated on Preferences page` : undefined,
      }),
      [loggerLabel]
    );

    const headerConfigDropdownItems = (
      <>
        <DropdownLinkItem key="preferences" to="/preferences">
          Preferences
        </DropdownLinkItem>
        <DropdownLinkItem key="demo" to="/admin/demo">
          Demo
        </DropdownLinkItem>
        <DropdownLinkItem key="variables" to="/admin/variables">
          Variables
        </DropdownLinkItem>
        <ProtectedComponent role={AUTH_ROLE.Admin} hide key="administration">
          <DropdownLinkItem to="/admin/administration">Administration</DropdownLinkItem>
        </ProtectedComponent>
        {process.env.REACT_APP_PNC_OLD_UI_WEB && (
          <DropdownLinkItem key="old-ui" to={process.env.REACT_APP_PNC_OLD_UI_WEB}>
            Old UI Version <ExternalLinkAltIcon />
          </DropdownLinkItem>
        )}
      </>
    );

    const headerQuestionDropdownItems = [
      <DropdownLinkItem to="/about" key="about">
        About
      </DropdownLinkItem>,
    ];

    if (pncUserGuideUrl) {
      headerQuestionDropdownItems.push(
        <DropdownItem key="users-guide" to={pncUserGuideUrl} target="_blank" rel="noopener noreferrer">
          User's guide <ExternalLinkAltIcon />
        </DropdownItem>
      );
    }

    if (pncUserSupportUrl) {
      headerQuestionDropdownItems.push(
        <DropdownItem
          key="users-channel"
          to={pncUserSupportUrl}
          title="Live user's support channel for PNC services provided by developers"
          target="_blank"
          rel="noopener noreferrer"
        >
          User's support <ExternalLinkAltIcon />
        </DropdownItem>
      );
    }

    const headerUserDropdownItems = (
      <>
        <DropdownItem key="logout" onClick={user ? processLogout : processLogin}>
          {user ? 'Logout' : 'Login'}
        </DropdownItem>
      </>
    );

    const headerKeycloakUnavailableDropdownItems = (
      <>
        <DropdownLinkItem key="keycloak-status" to="/system/keycloak-status">
          Keycloak Status
        </DropdownLinkItem>
      </>
    );

    function processLogin() {
      keycloakService.login().catch(() => {
        throw new Error('Keycloak login failed.');
      });
    }

    function processLogout() {
      keycloakService.logout();
      setIsHeaderUserOpen(false);
    }

    return (
      <Toolbar isFullHeight isStatic>
        <ToolbarContent>
          <ToolbarGroup variant="icon-button-group" align={toolbarGroupAlign}>
            <ToolbarItem>
              <Dropdown
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    aria-label={headerConfig.tooltip}
                    isExpanded={isHeaderConfigOpen}
                    onClick={() => setIsHeaderConfigOpen((isHeaderConfigOpen) => !isHeaderConfigOpen)}
                  >
                    <CogIcon color={headerConfig.color} className="m-r-5" /> <CaretDownIcon color={headerConfig.color} />
                  </MenuToggle>
                )}
                isOpen={isHeaderConfigOpen}
                onOpenChange={(isOpen: boolean) => setIsHeaderConfigOpen(isOpen)}
              >
                <DropdownList>{headerConfigDropdownItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    isExpanded={isHeaderQuestionOpen}
                    onClick={() => setIsHeaderQuestionOpen((isHeaderQuestionOpen) => !isHeaderQuestionOpen)}
                  >
                    <OutlinedQuestionCircleIcon className="m-r-5" /> <CaretDownIcon />
                  </MenuToggle>
                )}
                isOpen={isHeaderQuestionOpen}
                onOpenChange={(isOpen: boolean) => setIsHeaderQuestionOpen(isOpen)}
              >
                <DropdownList>{headerQuestionDropdownItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem>
            <Dropdown
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  isFullHeight
                  icon={<UserIcon />}
                  isExpanded={isHeaderUserOpen}
                  onClick={() => setIsHeaderUserOpen((isHeaderUserOpen) => !isHeaderUserOpen)}
                >
                  {keycloakService.isKeycloakAvailable ? <>{user ? user : 'Not logged in'}</> : <>KEYCLOAK UNAVAILABLE</>}
                </MenuToggle>
              )}
              isOpen={isHeaderUserOpen}
              onOpenChange={(isOpen: boolean) => setIsHeaderUserOpen(isOpen)}
            >
              <DropdownList>
                {keycloakService.isKeycloakAvailable ? headerUserDropdownItems : headerKeycloakUnavailableDropdownItems}
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    );
  };

  const appHeader = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <AppLogoImage />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <AppHeaderToolbar />
      </MastheadContent>
    </Masthead>
  );

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
      <LegacyUrlRedirector />
      <div ref={topBarsRef}>
        <OldUIAnnouncement />
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

const toolbarGroupAlign = { default: 'alignRight' } as const;
