declare global {
  interface Window {
    Keycloak?: any;
  }
}

export const Keycloak = window.Keycloak;
