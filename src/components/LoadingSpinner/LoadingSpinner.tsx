import { Spinner } from '@patternfly/react-core';

interface ILoadingSpinnerProps {
  isInline?: boolean;
}

export const LoadingSpinner = ({ isInline = false }: ILoadingSpinnerProps) =>
  // isInline - beta feature currently in this Patternfly component
  isInline ? <Spinner isInline isSVG aria-label="Loading..." /> : <Spinner diameter="75px" isSVG aria-label="Loading..." />;
