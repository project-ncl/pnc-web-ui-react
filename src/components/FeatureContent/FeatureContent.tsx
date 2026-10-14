import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PropsWithChildren } from 'react';

import { StateCard } from 'components/StateCard/StateCard';

import { TFeature } from 'utils/features';

interface IFeatureContentProps {
  feature: TFeature;
  title: string;
}

/**
 * Component encapsulating content depending on a feature.
 * When the feature is disabled, the content is not rendered and the reason is displayed instead.
 *
 * @param feature - Feature the content depends on, for example {@link BREW}
 * @param title - Title, for example "Build Pushes"
 */
export const FeatureContent = ({ children, feature, title }: PropsWithChildren<IFeatureContentProps>) => {
  if (!feature.isEnabled) {
    return (
      <StateCard title={`${title} not available`} icon={ExclamationCircleIcon}>
        {feature.disabledReason}
      </StateCard>
    );
  }

  return <>{children}</>;
};
