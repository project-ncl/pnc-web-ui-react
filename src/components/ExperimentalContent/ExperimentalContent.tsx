import { CubesIcon } from '@patternfly/react-icons';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router';

import { StorageKeys, useStorage } from 'hooks/useStorage';

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
  const { storageValue: isExperimentalContentEnabled } = useStorage<boolean>({
    storageKey: StorageKeys.isExperimentalContentEnabled,
    initialValue: false,
  });

  if (isRouteVariant && !isExperimentalContentEnabled) {
    return (
      <StateCard title="404: Page does not exist" icon={CubesIcon}>
        <Link className="pf-v6-c-button pf-m-primary" to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    );
  }

  return <>{isExperimentalContentEnabled ? children : null}</>;
};
