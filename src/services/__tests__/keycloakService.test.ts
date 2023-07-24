jest.mock('services/userService');
jest.mock('services/webConfigService');

const mockInit = jest.fn(() => {
  return Promise.resolve();
});

const mockLogout = jest.fn();
const mockLogin = jest.fn();
const mockIsTokenExpired = jest.fn();
const mockUpdateToken = jest.fn();
const mockHasRealmRole = jest.fn();

jest.mock('services/keycloakHolder', () => {
  return {
    Keycloak: jest.fn().mockImplementation(() => ({
      init: mockInit,
      login: mockLogin,
      logout: mockLogout,
      authenticated: true,
      idTokenParsed: {
        preferred_username: 'username123test',
      },
      token: 'token',
      isTokenExpired: mockIsTokenExpired,
      updateToken: mockUpdateToken,
      hasRealmRole: mockHasRealmRole,
    })),
  };
});

describe('keycloakService works properly', () => {
  const { keycloakService } = require('services/keycloakService');

  test('isInitialized() returns correct value', () => {
    expect(keycloakService.isInitialized()).resolves.toBe('success');
  });

  test('isAuthenticated() returns correct value', () => {
    expect(keycloakService.isAuthenticated()).toBe(true);
  });

  test('login() calls keycloak login function correctly', async () => {
    keycloakService.login();
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  test('logout() calls keycloak logout function correctly', () => {
    keycloakService.logout();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('isTokenExpired() returns correct value', () => {
    mockIsTokenExpired.mockReturnValue(true);
    expect(keycloakService.isTokenExpired()).toBe(true);
    mockIsTokenExpired.mockReturnValue(false);
    expect(keycloakService.isTokenExpired()).toBe(false);
    expect(mockIsTokenExpired).toHaveBeenCalledTimes(2);
  });

  test('updateToken() updates token', () => {
    keycloakService.updateToken();
    expect(mockUpdateToken).toHaveBeenCalledTimes(1);
  });

  test('getUser() returns correct value', () => {
    expect(keycloakService.getUser()).toBe('username123test');
  });

  test('hasRealmRole() returns correct value', () => {
    mockHasRealmRole.mockReturnValue(false);
    expect(keycloakService.hasRealmRole()).toBe(false);
    expect(mockHasRealmRole).toHaveBeenCalledTimes(1);
  });
});

export {};
