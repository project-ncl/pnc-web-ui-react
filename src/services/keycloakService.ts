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
 * Class managing authentication functionality.
 */
class KeycloakService {
  // We can't get KeycloakInstance type because of dynamic loading of Keycloak library
  private keycloakAuth: any = null;

  private KEYCLOAK_TOKEN_MIN_EXP = webConfigService.getWebConfig().ssoTokenLifespan;

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
   * Initialize Keycloak and create instance.
   *
   * @returns Promise.
   */
  private init(): Promise<any> {
    const keycloakConfig = webConfigService.getWebConfig().keycloak;

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
            if (this.isAuthenticated()) {
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
      return Promise.reject('Keycloak library not available');
    }
  }
  /**
   * Returns promise of Keycloak initialization.
   *
   * @returns Promise.
   */
  public isInitialized(): Promise<any> {
    return this.isKeycloakInitialized;
  }
  /**
   * Returns if user is authenticated.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns True if user is authenticated, false otherwise.
   */
  public isAuthenticated(): boolean {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.authenticated!;
  }

  /**
   * Initiate login process in keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Promise.
   */
  public login(): Promise<any> {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.login();
  }

  /**
   * Initiate logout process in keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @param redirectUri URI to redirect after logout.
   */
  public logout(redirectUri?: string): void {
    this.checkKeycloakAvailability();

    this.keycloakAuth.logout({ redirectUri });
  }

  /**
   * Gets keycloak token.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns String with token if user is logged in, undefined otherwise.
   */
  public getToken(): string {
    this.checkKeycloakAvailability();

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

  /**
   * Returns token validity string.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Token validity string.
   */
  public getTokenValidity(): string {
    this.checkKeycloakAvailability();

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

  /**
   * Returns whether is token expired.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns True if token is expired, false otherwise.
   */
  public isTokenExpired(): boolean {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.isTokenExpired(this.KEYCLOAK_TOKEN_MIN_EXP);
  }

  /**
   * Updates token.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns Promise.
   */
  public updateToken(): Promise<boolean> {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.updateToken(this.KEYCLOAK_TOKEN_MIN_EXP);
  }

  /**
   * Gets user name from keycloak.
   *
   * Throws exception if Keycloak is not available.
   *
   * @returns String with username if user is logged in, undefined otherwise.
   */
  public getUser(): string | null {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.idTokenParsed?.preferred_username;
  }

  /**
   * Checks if user has required auth role.
   *
   * Throws exception if Keycloak is not available.
   *
   * @param role AUTH_ROLE
   * @returns True when user is logged in and has required role for access, false otherwise.
   */
  public hasRealmRole(role: AUTH_ROLE): boolean {
    this.checkKeycloakAvailability();

    return this.keycloakAuth.hasRealmRole(role);
  }

  /**
   * Checks Keycloak availability and throws exception if Keycloak is not available.
   */
  private checkKeycloakAvailability() {
    if (!this.isKeycloakAvailable) {
      throw new Error('Keycloak not available! Please check Keycloak availability before using Keycloak service method.');
    }
  }
}

/**
 * Instance of KeycloakService providing group of Keycloak related API operations.
 */
export const keycloakService = new KeycloakService();
