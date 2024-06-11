import { Spinner } from '@patternfly/react-core';

interface ILoadingSpinnerProps {
  isInline?: boolean;
}

export const LoadingSpinner = ({ isInline = false }: ILoadingSpinnerProps) =>
  // isInline - beta feature currently in this Patternfly component
  isInline ? <Spinner isInline aria-label="Loading..." /> : <Spinner diameter="75px" aria-label="Loading..." />;
