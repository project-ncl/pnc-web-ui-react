export type TFeature = {
  isEnabled: boolean;
  disabledReason: string;
};

/**
 * Whether SERVICE Build Category can be used for creating Build Configs and starting Builds.
 */
export const SERVICE_BUILD_CATEGORY = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'This feature is not available in the current system.',
};

/**
 * Whether Brew can be used, to push (Group) Builds to Brew, or to activate Brew Pull in Build Configs.
 */
export const BREW = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'Brew is not available in the current system.',
};

/**
 * Whether Causeway is available, to display its version.
 */
export const CAUSEWAY = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'Causeway is not available in the current system.',
};

/**
 * Whether ETT is available, to display its version.
 */
export const ETT = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'ETT is not available in the current system.',
};

/**
 * Whether Grafana service status widgets are available on the dashboard.
 */
export const SERVICE_STATUS = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'Service status is not available in the current system.',
};

/**
 * Whether app can be accessed anonymously. False redirects to login.
 */
export const ANONYMOUS_ACCESS = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'Login is required to access the API.',
};

/**
 * Whether services are behind OAuth proxy.
 */
export const OAUTH_PROXY = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE === 'primary',
  disabledReason: 'OAuth proxy is not available in the current system.',
};
