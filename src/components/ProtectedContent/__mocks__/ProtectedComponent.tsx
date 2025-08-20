export const withProtection = (WrappedComponent: React.ComponentType, tooltipProp?: string) => {
  return ({ ...props }) => <WrappedComponent {...props} />;
};
