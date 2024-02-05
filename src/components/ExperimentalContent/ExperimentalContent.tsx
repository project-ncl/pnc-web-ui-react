import { CubesIcon } from '@patternfly/react-icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { StateCard } from 'components/StateCard/StateCard';

interface IExperimentalContentProps {
  isRouteVariant?: boolean;
}

export const experimentalContentEnabledLocalStorageId = 'is-experimental-content-enabled';

/**
 * Component encapsulating experimental content (REST API is experimental or mocked).
 * Based on local storage parameter ({@link experimentalContentEnabledLocalStorageId}), content is conditionally rendered.
 *
 * @param isRouteVariant - Is page route content variant enabled
 */
export const ExperimentalContent = ({ children, isRouteVariant = false }: PropsWithChildren<IExperimentalContentProps>) => {
  const [isExperimentalContentEnabled, setIsExperimentalContentEnabled] = useState<boolean>(false);

  useEffect(() => {
    const isEnabled = window.localStorage.getItem(experimentalContentEnabledLocalStorageId) === 'true';
    setIsExperimentalContentEnabled(isEnabled);
  }, []);

  if (isRouteVariant && !isExperimentalContentEnabled) {
    return (
      <StateCard title="404: Page does not exist" icon={CubesIcon}>
        <Link className="pf-c-button pf-m-primary" to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    );
  }

  return <>{isExperimentalContentEnabled ? children : null}</>;
};
