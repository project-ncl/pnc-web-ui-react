import { AUTH_ROLE, keycloakService } from '../../services/keycloakService';
import { PageTitles } from '../../utils/PageTitles';
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
}

export const ProtectedContent = ({
  children,
  type,
  role = AUTH_ROLE.User,
  title,
}: React.PropsWithChildren<IProtectedContentProps>) => {
  if (!keycloakService.isKeycloakAvailable) {
    if (type === PROTECTED_TYPE.Route) {
      return <ErrorPage pageTitle={title ? title : PageTitles.pageNotFound} errorDescription="Keycloak uninitialized." />;
    } else if (type === PROTECTED_TYPE.Component) {
      return <div className={styles['disabled-content']}>{children}</div>;
    }
  }

  if (keycloakService.isAuthenticated()) {
    if (keycloakService.hasRealmRole(role)) {
      return <>{children}</>;
    } else {
      if (type === PROTECTED_TYPE.Route) {
        return (
          <ErrorPage
            pageTitle={title ? title : PageTitles.pageNotFound}
            errorDescription="User not allowed to enter this page."
          />
        );
      } else if (type === PROTECTED_TYPE.Component) {
        return <div className={styles['disabled-content']}>{children}</div>;
      }
    }
  }

  if (type === PROTECTED_TYPE.Route) {
    keycloakService.login().catch(() => {
      throw new Error('Keycloak login failed.');
    });

    return <div>Redirecting to keycloak...</div>;
  } else {
    return <>{children}</>;
  }
};
