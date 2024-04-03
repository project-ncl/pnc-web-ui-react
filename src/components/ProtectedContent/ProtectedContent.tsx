import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { KeycloakStatusPage } from 'components/KeycloakStatusPage/KeycloakStatusPage';

import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import { uiLogger } from 'services/uiLogger';

import styles from './ProtectedContent.module.css';

export enum PROTECTED_TYPE {
  Route,
  ComponentDisabled,
  ComponentHidden,
}

const HiddenContent = () => null;

interface IDisabledContentProps {
  reason: string;
}

const DisabledContent = ({ children, reason }: React.PropsWithChildren<IDisabledContentProps>) => (
  <div title={reason}>
    <div className={styles['disabled-content']}>{children}</div>
  </div>
);

interface IProtectedContentProps {
  type: PROTECTED_TYPE;
  role?: AUTH_ROLE;
  title?: string;
}

/**
 * {@link ProtectedComponent} and {@link ProtectedRoute} use this component. They are meant to be used directly instead of this component.
 */
export const ProtectedContent = ({
  children,
  type,
  role = AUTH_ROLE.User,
  title,
}: React.PropsWithChildren<IProtectedContentProps>) => {
  if (type === PROTECTED_TYPE.Route && !title) {
    uiLogger.error('Property "title" is required when "type" value "PROTECTED_TYPE.Route" is used.');
  }

  // Error state - Keycloak service not available
  if (!keycloakService.isKeycloakAvailable) {
    const reason = 'Keycloak service is not available.';
    switch (type) {
      case PROTECTED_TYPE.Route:
        return <KeycloakStatusPage errorPageTitle={title!} />;
      case PROTECTED_TYPE.ComponentHidden:
        return <HiddenContent />;
      case PROTECTED_TYPE.ComponentDisabled:
        return <DisabledContent reason={reason}>{children}</DisabledContent>;
    }
  }

  if (keycloakService.isAuthenticated()) {
    // Happy state, all requirements are met, protected content can be displayed
    if (keycloakService.hasRealmRole(role) || role === AUTH_ROLE.User) {
      return <>{children}</>;
    }

    // Warning state - required role is missing
    const reason = `User not allowed to enter this page, the following permissions are required: ${role}`;
    switch (type) {
      case PROTECTED_TYPE.Route:
        return <ErrorPage pageTitle={title!} errorDescription={reason} />;
      case PROTECTED_TYPE.ComponentHidden:
        return <HiddenContent />;
      case PROTECTED_TYPE.ComponentDisabled:
        return <DisabledContent reason={reason}>{children}</DisabledContent>;
    }
  }

  // Neutral state - not logged yet
  const reason = 'Login is required';
  switch (type) {
    case PROTECTED_TYPE.Route:
      keycloakService.login().catch(() => {
        throw new Error('Keycloak login failed.');
      });
      return <div>Redirecting to keycloak...</div>;

    case PROTECTED_TYPE.ComponentHidden:
      return <HiddenContent />;
    case PROTECTED_TYPE.ComponentDisabled:
      return <DisabledContent reason={reason}>{children}</DisabledContent>;
  }
};
