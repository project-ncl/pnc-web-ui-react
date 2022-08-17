export enum AUTH_ROLE {
  Admin = 'admin',
  User = 'user',
  System = 'system-user',
  Power = 'power-user',
}

class KeycloakServiceMock {
  private initialized: boolean = false;
  private user: any;
  private isLogin: boolean = false;
  private roles: String[] = ['Admin'];

  constructor() {
    this.initialized = true;
  }

  public isInitialized(): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve(this.initialized);
    });
  }

  public isAuthenticated(): boolean {
    return this.isLogin;
  }

  public login(user: String): Promise<any> {
    this.user = user;
    this.isLogin = true;
    return new Promise<any>((resolve) => {
      resolve(true);
    });
  }

  public logout(): void {
    this.isLogin = false;
    this.user = undefined;
  }

  public getToken(): String {
    return 'example_token';
  }

  public getUser(): String {
    return this.user;
  }

  public hasRealmRole(role: String): boolean {
    if (this.roles.includes(role)) {
      return true;
    }
    return false;
  }
}

export const keycloakService = new KeycloakServiceMock();
