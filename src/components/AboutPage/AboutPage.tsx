import { TextContent, TextList, TextListItem } from '@patternfly/react-core';
import { useEffect } from 'react';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';
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
      <ContentBox padding marginBottom>
        <TextContent>
          <TextList component="dl">
            <TextListItem component="dt">
              <a href={pncRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC System Version
              </a>
            </TextListItem>
            <TextListItem component="dd">
              <ServiceContainerLoading {...serviceContainerPncVersionGet} title="PNC version" isInline>
                {serviceContainerPncVersionGet.data}
              </ServiceContainerLoading>
            </TextListItem>

            <TextListItem component="dt">
              <a href={pncWebUiRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC Web UI Version (Revision)
              </a>
            </TextListItem>
            <TextListItem component="dd">
              {process.env.REACT_APP_VERSION || <EmptyStateSymbol title="Version" />} (
              {process.env.REACT_APP_GIT_SHORT_SHA || <EmptyStateSymbol title="Revision" />})
            </TextListItem>
          </TextList>
        </TextContent>
      </ContentBox>
    </PageLayout>
  );
};
