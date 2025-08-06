import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { AnalyzedArtifactsList } from 'components/AnalyzedArtifactsList/AnalyzedArtifactsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
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
    <div>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <PageSectionHeader
            title="Delivered Artifacts"
            description={
              <>
                This list contains Artifacts analyzed in the Deliverable Analysis. Each Artifact is represented by a PNC
                Identifier.
              </>
            }
          />
        </ToolbarItem>
      </Toolbar>
      <AnalyzedArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </div>
  );
};
