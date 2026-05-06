export enum AUTH_ROLE {
  Admin = 'admin',
  User = 'user',
  System = 'system-user',
  Power = 'power-user',
}

const createKeycloakServiceMock = () => {
  const initialized: boolean = false;
  let user: any;
  let isLogin: boolean = false;
  const roles: String[] = ['Admin'];

  const isKeycloakAvailable = (): boolean => {
    return initialized;
  };

  const isInitialized = (): Promise<any> => {
    return new Promise<any>((resolve) => {
      resolve(initialized);
    });
  };

  const isAuthenticated = (): boolean => {
    return isLogin;
  };

  const login = (userNew: String): Promise<any> => {
    user = userNew;
    isLogin = true;
    return new Promise<any>((resolve) => {
      resolve(true);
    });
  };

  const logout = (): void => {
    isLogin = false;
    user = undefined;
  };

  const getToken = (): String => {
    return 'example_token';
  };

  const getUser = (): String => {
    return user;
  };

  const hasRealmRole = (role: String): boolean => {
    if (roles.includes(role)) {
      return true;
    }
    return false;
  };

  return { isKeycloakAvailable, isInitialized, isAuthenticated, login, logout, getToken, getUser, hasRealmRole };
};

export const keycloakService = createKeycloakServiceMock();
