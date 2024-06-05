import { CubesIcon } from '@patternfly/react-icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { StorageKeys } from 'common/constants';

import { StateCard } from 'components/StateCard/StateCard';

interface IExperimentalContentProps {
  isRouteVariant?: boolean;
}

/**
 * Component encapsulating experimental content (REST API is experimental or mocked).
 * Based on local storage parameter ({@link StorageKeys.isExperimentalContentEnabled}), content is conditionally rendered.
 *
 * @param isRouteVariant - Is page route content variant enabled
 */
export const ExperimentalContent = ({ children, isRouteVariant = false }: PropsWithChildren<IExperimentalContentProps>) => {
  const [isExperimentalContentEnabled, setIsExperimentalContentEnabled] = useState<boolean>(false);

  useEffect(() => {
    const isEnabled = window.localStorage.getItem(StorageKeys.isExperimentalContentEnabled) === 'true';
    setIsExperimentalContentEnabled(isEnabled);
  }, []);

  if (isRouteVariant && !isExperimentalContentEnabled) {
    return (
      <StateCard title="404: Page does not exist" icon={CubesIcon}>
        <Link className="pf-v5-c-button pf-m-primary" to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    );
  }

  return <>{isExperimentalContentEnabled ? children : null}</>;
};
