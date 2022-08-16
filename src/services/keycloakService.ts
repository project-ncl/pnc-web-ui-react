import * as WebConfigAPI from '../services/WebConfigService';
import { Keycloak } from '../services/keycloakHolder';

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

  private KEYCLOAK_TOKEN_MIN_EXP = 86400; // Default: 24 Hours

  private isKeycloakInitialized;

  /*
  false if: 
  - Keycloak library is not loaded,
  or library is loaded, but:
  - was not initialized yet
  - is initializing
  - initialization failed
  */
  private _isKeycloakAvailable: boolean = false;

  constructor() {
    this.isKeycloakInitialized = this.init();
  }

  public get isKeycloakAvailable(): boolean {
    return this._isKeycloakAvailable;
  }

  /**
   * Initialize keycloak and create instance.
   *
   * @returns Promise
   */
  private init(): Promise<any> {
    const keycloakConfig = WebConfigAPI.getWebConfig().keycloak;

    if (Keycloak) {
      this.keycloakAuth = new Keycloak({
        url: keycloakConfig.url,
        realm: keycloakConfig.realm,
        clientId: keycloakConfig.clientId,
      });

      return new Promise((resolve, reject) => {
        this.keycloakAuth
          .init({ onLoad: 'check-sso' })
          .then(() => {
            this._isKeycloakAvailable = true;
            resolve('success');
          })
          .catch((errorData: any) => {
            reject(errorData);
          });
      });
    } else {
      return Promise.reject('Keycloak library not available');
    }
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
    this.updateToken()
      .then((isTokenRefreshed: boolean) => {
        if (isTokenRefreshed) {
          console.log('Token refreshed.');
        } else {
          //console.log('Token not refreshed, valid for: \n' + this.getTokenValidity()); //dev purpose, too much spam
        }
      })
      .catch(() => {
        throw new Error('Failed to refresh token');
      });

    return this.keycloakAuth.token;
  }

  public getTokenValidity(): String {
    if (!this.keycloakAuth.tokenParsed) {
      return 'Not authenticated';
    }

    let validity =
      'Token Expires:\t\t' +
      new Date((this.keycloakAuth.tokenParsed.exp + this.keycloakAuth.timeSkew) * 1000).toLocaleString() +
      '\n';
    validity +=
      'Token Expires in:\t' +
      Math.round(this.keycloakAuth.tokenParsed.exp + this.keycloakAuth.timeSkew - new Date().getTime() / 1000) +
      ' seconds\n';

    if (this.keycloakAuth.refreshTokenParsed) {
      validity +=
        'Refresh Token Expires:\t' +
        new Date((this.keycloakAuth.refreshTokenParsed.exp + this.keycloakAuth.timeSkew) * 1000).toLocaleString() +
        '\n';
      validity +=
        'Refresh Expires in:\t' +
        Math.round(this.keycloakAuth.refreshTokenParsed.exp + this.keycloakAuth.timeSkew - new Date().getTime() / 1000) +
        ' seconds';
    }

    return validity;
  }

  public isTokenExpired(): boolean {
    return this.keycloakAuth.isTokenExpired(this.KEYCLOAK_TOKEN_MIN_EXP);
  }

  public updateToken(): Promise<boolean> {
    return this.keycloakAuth.updateToken(this.KEYCLOAK_TOKEN_MIN_EXP);
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
