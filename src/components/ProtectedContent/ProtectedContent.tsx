import { AUTH_ROLE, keycloakService } from '../../services/keycloakService';
import styles from './ProtectedContent.module.css';

interface IProtectedContentProps {
  role?: AUTH_ROLE;
}

export const ProtectedContent = ({ children, role = AUTH_ROLE.User }: React.PropsWithChildren<IProtectedContentProps>) => {
  if (!keycloakService.isKeycloakAvailable) {
    return <div className={styles['disabled-content']}>{children}</div>;
  }

  if (keycloakService.isAuthenticated()) {
    if (keycloakService.hasRealmRole(role)) {
      return <>{children}</>;
    } else {
      return <div className={styles['disabled-content']}>{children}</div>;
    }
  }

  return <>{children}</>;
};
