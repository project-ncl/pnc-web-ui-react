import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import styles from './TabsLabel.module.css';

interface ITabsLabelProps {
  serviceContainer: IServiceContainer;
  title: string;
}

export const TabsLabel = ({ serviceContainer, title, children }: PropsWithChildren<ITabsLabelProps>) => {
  return (
    <span className={styles['page-section-tabs-label']}>
      <Tooltip content={title}>
        <Label>
          <ServiceContainerLoading loadingStateDelay={0} {...serviceContainer} variant="inline" title={title}>
            {children}
          </ServiceContainerLoading>
        </Label>
      </Tooltip>
    </span>
  );
};
