import { Link } from 'react-router-dom';
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const SystemErrorPage = () => {
  return (
    <EmptyState variant={EmptyStateVariant.xl} className="pf-u-pt-4xl">
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h1" size="4xl">
        System Error
      </Title>
      <EmptyStateBody>Unexpected error occurred, report has been sent to the server.</EmptyStateBody>

      <Link to="/" className="pf-c-button pf-m-primary">
        Return to Dashboard
      </Link>
    </EmptyState>
  );
};

export default SystemErrorPage;
