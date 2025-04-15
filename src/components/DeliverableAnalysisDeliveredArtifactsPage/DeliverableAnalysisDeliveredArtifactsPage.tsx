import { Text, TextContent } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';

interface IDeliverableAnalysisDeliveredArtifactsPageProps {
  componentId?: string;
}

export const DeliverableAnalysisDeliveredArtifactsPage = ({
  componentId = 'd2',
}: IDeliverableAnalysisDeliveredArtifactsPageProps) => {
  const { deliverableAnalysisId } = useParamsRequired();

  const serviceContainerArtifacts = useServiceContainer(deliverableAnalysisApi.getAnalyzedArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: deliverableAnalysisId }, requestConfig }),
      [serviceContainerArtifactsRunner, deliverableAnalysisId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component="h2">Delivered Artifacts</Text>
            <Text>
              This list contains artifacts analyzed in the current deliverable analysis. Each Artifact is represented by PNC
              Identifier.
            </Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>
      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />;
    </>
  );
};
