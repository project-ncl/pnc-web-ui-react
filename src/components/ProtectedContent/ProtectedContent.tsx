import { AUTH_ROLE, keycloakService } from '../../services/keycloakService';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import styles from './ProtectedContent.module.css';

export enum PROTECTED_TYPE {
  Route = 'route',
  Component = 'component',
}

interface IProtectedContentProps {
  type: PROTECTED_TYPE;
  role?: AUTH_ROLE;
  title?: string;
  hide?: boolean;
}

export const ProtectedContent = ({
  children,
  type,
  role = AUTH_ROLE.User,
  title,
  hide = false,
}: React.PropsWithChildren<IProtectedContentProps>) => {
  const ErrorPageComponent = <ErrorPage pageTitle={title as string} errorDescription="User not allowed to enter this page." />;
  const DisabledContentComponent = hide ? null : <div className={styles['disabled-content']}>{children}</div>;

  if (!keycloakService.isKeycloakAvailable) {
    switch (type) {
      case PROTECTED_TYPE.Route:
        return ErrorPageComponent;
      case PROTECTED_TYPE.Component:
        return DisabledContentComponent;
    }
  }

  if (keycloakService.isAuthenticated()) {
    if (keycloakService.hasRealmRole(role)) {
      return <>{children}</>;
    } else {
      switch (type) {
        case PROTECTED_TYPE.Route:
          return ErrorPageComponent;
        case PROTECTED_TYPE.Component:
          return DisabledContentComponent;
      }
    }
  }

  switch (type) {
    case PROTECTED_TYPE.Route:
      keycloakService.login().catch(() => {
        throw new Error('Keycloak login failed.');
      });

      return <div>Redirecting to keycloak...</div>;
    case PROTECTED_TYPE.Component:
      return hide ? DisabledContentComponent : <>{children}</>;
  }
};
