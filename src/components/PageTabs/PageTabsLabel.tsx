import { PropsWithChildren } from 'react';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ServiceContainerLabel } from 'components/ServiceContainerLabel/ServiceContainerLabel';

import styles from './PageTabsLabel.module.css';

interface IPageTabsLabelProps {
  serviceContainer: IServiceContainerState<Object>;
  title: string;
}

export const PageTabsLabel = ({ serviceContainer, title, children }: PropsWithChildren<IPageTabsLabelProps>) => {
  return (
    <span className={styles['page-section-tabs-label']}>
      <ServiceContainerLabel loading={serviceContainer.loading} error={serviceContainer.error} title={title}>
        {children}
      </ServiceContainerLabel>
    </span>
  );
};
