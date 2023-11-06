import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import styles from './PageTabsLabel.module.css';

interface IPageTabsLabelProps {
  serviceContainer: IServiceContainer;
  title: string;
}

export const PageTabsLabel = ({ serviceContainer, title, children }: PropsWithChildren<IPageTabsLabelProps>) => {
  return (
    <span className={styles['page-section-tabs-label']}>
      <Tooltip content={title}>
        <Label>
          <ServiceContainerLoading {...serviceContainer} variant="inline" title={title}>
            {children}
          </ServiceContainerLoading>
        </Label>
      </Tooltip>
    </span>
  );
};
