/**
 * Whether SERVICE Build Category can be used for creating Build Configs and starting Builds.
 */
export const SERVICE_BUILD_CATEGORY = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'SERVICE Build Category is not supported.',
};

/**
 * Whether Brew can be used, to push (Group) Builds to Brew, or to activate Brew Pull in Build Configs.
 */
export const BREW = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'Brew is not supported.',
};
