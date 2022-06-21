import { Link } from 'react-router-dom';
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useTitle } from '../../containers/useTitle';

export const NotFoundPage = () => {
  useTitle('Not Found');
  return (
    <EmptyState variant={EmptyStateVariant.xl} className="pf-u-pt-4xl">
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h1" size="4xl">
        404: That page no longer exists
      </Title>
      <EmptyStateBody>The requested resource could not be found.</EmptyStateBody>

      <Link to="/" className="pf-c-button pf-m-primary">
        Return to Dashboard
      </Link>
    </EmptyState>
  );
};
