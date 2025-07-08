import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { AnalyzedArtifactsList } from 'components/AnalyzedArtifactsList/AnalyzedArtifactsList';
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
          <Content>
            <Content component={ContentVariants.h2}>Delivered Artifacts</Content>
            <Content component={ContentVariants.p}>
              This list contains Artifacts analyzed in the Deliverable Analysis. Each Artifact is represented by a PNC Identifier.
            </Content>
          </Content>
        </ToolbarItem>
      </Toolbar>
      <AnalyzedArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </>
  );
};
