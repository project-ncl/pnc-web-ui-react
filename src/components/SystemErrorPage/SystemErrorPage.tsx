import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export const SystemErrorPage = () => {
  return (
    <EmptyState
      headingLevel="h1"
      icon={CubesIcon}
      titleText="System Error"
      variant={EmptyStateVariant.xl}
      className="pf-v5-u-pt-4xl"
    >
      <EmptyStateBody>Unexpected error occurred, report has been sent to the server.</EmptyStateBody>
      <EmptyStateFooter>
        <a href="/" className="pf-v5-c-button pf-m-primary">
          Return to Dashboard
        </a>
      </EmptyStateFooter>
    </EmptyState>
  );
};
