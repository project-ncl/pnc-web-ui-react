import { useEffect } from 'react';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as genericSettingsApi from 'services/genericSettingsApi';

export const AboutPage = () => {
  const pncRepositoryUrl = 'https://github.com/project-ncl/pnc';
  const pncWebUiRepositoryUrl = 'https://github.com/project-ncl/pnc-web-ui-react';

  const serviceContainerPncVersionGet = useServiceContainer(genericSettingsApi.getPncVersion);
  const serviceContainerPncVersionGetRunner = serviceContainerPncVersionGet.run;

  useEffect(() => {
    serviceContainerPncVersionGetRunner();
  }, [serviceContainerPncVersionGetRunner]);

  return (
    <PageLayout title="About PNC Build System" description="System for managing, executing and tracking builds">
      <ContentBox padding marginBottom isResponsive>
        <Attributes>
          <AttributesItem
            title={
              <a href={pncRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC System Version
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerPncVersionGet} variant="inline" title="PNC version">
              {serviceContainerPncVersionGet.data}
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={pncWebUiRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC Web UI Version (Revision)
              </a>
            }
          >
            {process.env.REACT_APP_VERSION || <EmptyStateSymbol text={false} title="Version" />} (
            {process.env.REACT_APP_GIT_SHORT_SHA || <EmptyStateSymbol text={false} title="Revision" />})
          </AttributesItem>
        </Attributes>
      </ContentBox>
    </PageLayout>
  );
};
