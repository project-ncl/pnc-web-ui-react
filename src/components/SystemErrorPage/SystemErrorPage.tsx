import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export const SystemErrorPage = () => {
  return (
    <EmptyState variant={EmptyStateVariant.xl} className="pf-u-pt-4xl">
      <EmptyStateHeader titleText="System Error" icon={<EmptyStateIcon icon={CubesIcon} />} headingLevel="h1" />
      <EmptyStateBody>Unexpected error occurred, report has been sent to the server.</EmptyStateBody>
      <EmptyStateFooter>
        <a href="/" className="pf-c-button pf-m-primary">
          Return to Dashboard
        </a>
      </EmptyStateFooter>
    </EmptyState>
  );
};
