import * as WebConfigAPI from '../services/WebConfigService';
declare global {
  interface Window {
    Keycloak?: any;
  }
}
/**
 * Enum with possible authentication roles in keycloak.
 *
 */
export enum AUTH_ROLE {
  Admin = 'admin',
  User = 'user',
  System = 'system-user',
  Power = 'power-user',
}

/**
 * Class managing authentication functionality.
 */
class KeycloakService {
  //We can't get KeycloakInstance type because of dynamic loading of keycloak library
  private keycloakAuth: any;

  private isKeycloakInitialized;

  constructor() {
    this.isKeycloakInitialized = this.init();
  }

  /**
   * Initialize keycloak and create instance.
   *
   * @returns Promise
   */
  private init(): Promise<any> {
    const keycloakConfig = WebConfigAPI.getWebConfig().keycloak;

    this.keycloakAuth = window.Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    });

    return new Promise((resolve, reject) => {
      this.keycloakAuth
        .init({ onLoad: 'check-sso' })
        .then(() => {
          resolve('success');
        })
        .catch((errorData: any) => {
          reject(errorData);
        });
    });
  }
  /**
   * Returns promise of keycloak initialization.
   *
   * @returns Promise
   */
  public isInitialized(): Promise<any> {
    return this.isKeycloakInitialized;
  }
  /**
   * Returns if user is authenticated.
   *
   * @returns true if user is authenticated, otherwise returns false.
   */
  public isAuthenticated(): boolean {
    return this.keycloakAuth.authenticated!;
  }

  /**
   * Initiate login process in keycloak.
   *
   * @returns Promise
   */
  public login(): Promise<any> {
    return this.keycloakAuth.login();
  }

  /**
   * Initiate logout process in keycloak.
   *
   * @param redirectUri - uri to redirect after logout
   */
  public logout(redirectUri?: String): void {
    this.keycloakAuth.logout({ redirectUri });
  }

  /**
   * Gets keycloak token.
   *
   * @returns String with token if user is logged in or returns undefined when not.
   */
  public getToken(): String {
    return this.keycloakAuth.token;
  }

  /**
   * Gets user name from keycloak.
   *
   * @returns String with username if user is logged in or returns undefined when not.
   */
  public getUser(): String {
    return this.keycloakAuth.idTokenParsed?.preferred_username;
  }

  /**
   * Checks if user has required auth role.
   *
   * @param role AUTH_ROLE
   * @returns true when user is logged in and has required role for access, otherwise return false.
   */
  public hasRealmRole(role: AUTH_ROLE): boolean {
    return this.keycloakAuth.hasRealmRole(role);
  }
}
/**
 * Instance of KeycloakService providing group of Keycloak related API operations.
 */
export const keycloakService = new KeycloakService();
