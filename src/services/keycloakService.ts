import { authBroadcastService } from 'services/broadcastService';
import { Keycloak } from 'services/keycloakHolder';
import { userService } from 'services/userService';
import * as webConfigService from 'services/webConfigService';

/**
 * Enum with possible authentication roles in Keycloak.
 *
 */
export enum AUTH_ROLE {
  Admin = 'pnc-users-admin',
  User = 'Employee',
}

/**
 * Authentication manager.
 */
const createKeycloakService = () => {
  // We can't get KeycloakInstance type because of dynamic loading of Keycloak library
  let keycloakAuth: any = null;

  let authenticated: boolean | null = null;

  /**
   * Variable from config (webConfigService.getWebConfig().ssoTokenLifespan) is used differently in
   * Angular UI, we're here setting minimal validity for token.
   * 5 = if token has less than 5 seconds of validity left then refresh.
   */
  const KEYCLOAK_TOKEN_MIN_EXP = 5;

  let isKeycloakInitialized: Promise<any>;

  /*
  false if: 
  - Keycloak library is not loaded,
  or library is loaded, but:
  - was not initialized yet
  - is initializing
  - initialization failed
  */
  let _isKeycloakAvailable: boolean = false;

  const isKeycloakAvailable = (): boolean => {
    return _isKeycloakAvailable;
  };

  /**
   * Initialize Keycloak and create instance.
   */
  const init = (): void => {
    console.log('keycloakService init');
    const keycloakConfig = webConfigService.getWebConfig().keycloak;

    if (Keycloak) {
      keycloakAuth = new Keycloak({
        url: keycloakConfig.url,
        realm: keycloakConfig.realm,
        clientId: keycloakConfig.clientId,
      });

      isKeycloakInitialized = new Promise((resolve, reject) => {
        console.log('G1: keycloakAuth init');
        keycloakAuth
          .init({ onLoad: 'check-sso' })
          .then(() => {
            _isKeycloakAvailable = true;
            if (isAuthenticated()) {
              userService.fetchUser().finally(() => {
                resolve('success');
              });
            } else {
              resolve('success');
            }
          })
          .catch((errorData: any) => {
            reject(errorData);
          });
      });
    } else {
      isKeycloakInitialized = Promise.reject('Keycloak library not available');
    }
  };
  /**
   * Returns promise of Keycloak initialization.
   *
   * @returns Promise.
   */
  const isInitialized = (): Promise<any> => {
    return isKeycloakInitialized;
  };
  /**
   * Returns if user is authenticated.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns True if user is authenticated, false otherwise.
   */
  const isAuthenticated = (): boolean => {
    checkKeycloakAvailability();
    const authenticatedResult = keycloakAuth.authenticated!;
    const user = getUser();
    if (authenticated !== authenticatedResult) {
      authBroadcastService.send(authenticatedResult, user ? user : null);
      authenticated = authenticatedResult;
    }

    return authenticatedResult;
  };

  /**
   * Initiate login process in keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Promise.
   */
  const login = (): Promise<any> => {
    checkKeycloakAvailability();

    return keycloakAuth.login();
  };

  /**
   * Initiate logout process in keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @param redirectUri URI to redirect after logout.
   */
  const logout = (redirectUri?: string): void => {
    checkKeycloakAvailability();

    keycloakAuth.logout({ redirectUri });
  };

  /**
   * Gets keycloak token.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns String with token if user is logged in, undefined otherwise.
   */
  const getToken = async (): Promise<string> => {
    checkKeycloakAvailability();

    await updateToken().catch(() => {
      throw new Error('Failed to refresh token');
    });

    return keycloakAuth.token;
  };

  /**
   * Returns token validity string.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Token validity string.
   */
  const getTokenValidity = (): string => {
    checkKeycloakAvailability();

    if (!keycloakAuth.tokenParsed) {
      return 'Not authenticated';
    }

    let validity =
      'Token Expires:\t\t' + new Date((keycloakAuth.tokenParsed.exp + keycloakAuth.timeSkew) * 1000).toLocaleString() + '\n';
    validity +=
      'Token Expires in:\t' +
      Math.round(keycloakAuth.tokenParsed.exp + keycloakAuth.timeSkew - new Date().getTime() / 1000) +
      ' seconds\n';

    if (keycloakAuth.refreshTokenParsed) {
      validity +=
        'Refresh Token Expires:\t' +
        new Date((keycloakAuth.refreshTokenParsed.exp + keycloakAuth.timeSkew) * 1000).toLocaleString() +
        '\n';
      validity +=
        'Refresh Expires in:\t' +
        Math.round(keycloakAuth.refreshTokenParsed.exp + keycloakAuth.timeSkew - new Date().getTime() / 1000) +
        ' seconds';
    }

    return validity;
  };

  /**
   * Returns whether is token expired.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns True if token is expired, false otherwise.
   */
  const isTokenExpired = (): boolean => {
    checkKeycloakAvailability();

    return keycloakAuth.isTokenExpired(KEYCLOAK_TOKEN_MIN_EXP);
  };

  /**
   * Updates token.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Promise.
   */
  const updateToken = (): Promise<boolean> => {
    checkKeycloakAvailability();

    return keycloakAuth.updateToken(KEYCLOAK_TOKEN_MIN_EXP);
  };

  /**
   * Gets user name from keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns String with username if user is logged in, undefined otherwise.
   */
  const getUser = (): string | null => {
    checkKeycloakAvailability();

    return keycloakAuth.idTokenParsed?.preferred_username;
  };

  /**
   * Checks if user has required auth role.
   *
   * Throws exception if Keycloak is not available.
   *
   * @param role AUTH_ROLE
   * @returns True when user is logged in and has required role for access, false otherwise.
   */
  const hasRealmRole = (role: AUTH_ROLE): boolean => {
    checkKeycloakAvailability();

    return keycloakAuth.hasRealmRole(role);
  };

  /**
   * Checks Keycloak availability and throws exception if Keycloak is not available.
   */
  const checkKeycloakAvailability = () => {
    if (!isKeycloakAvailable) {
      throw new Error('Keycloak not available! Please check Keycloak availability before using Keycloak service method.');
    }
  };

  /**
   * API
   */
  return {
    init,
    login,
    isInitialized,
    isKeycloakAvailable,
    isAuthenticated,
    getToken,
    hasRealmRole,
    logout,
    getUser,

    // Not used yet
    getTokenValidity, // For testing purposes
    isTokenExpired,
  };
};

/**
 * Instance providing group of Keycloak related API operations.
 */
export const keycloakService = createKeycloakService();
