import { PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { breadcrumbData } from 'common/breadcrumbData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';
import * as operationsApi from 'services/operationsApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IDeliverableAnalysisPagesProps {}

export const DeliverableAnalysisPages = ({ children }: PropsWithChildren<IDeliverableAnalysisPagesProps>) => {
  const { deliverableAnalysisId } = useParamsRequired();

  const serviceContainerDeliverableAnalysis = useServiceContainer(operationsApi.getDeliverableAnalysis);

  const serviceContainerArtifacts = useServiceContainer(deliverableAnalysisApi.getAnalyzedArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerArtifactsRunner({
      serviceData: { id: deliverableAnalysisId },
      requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
    });
  }, [deliverableAnalysisId, serviceContainerArtifactsRunner]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerDeliverableAnalysis,
      firstLevelEntity: 'Deliverable Analysis',
      entityName: `Deliverable Analysis ${deliverableAnalysisId}`,
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="delivered-artifacts">
        Delivered Artifacts
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Delivered Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
    </PageTabs>
  );

  return (
    <PageLayout
      title={`Deliverable Analysis ${deliverableAnalysisId}`}
      breadcrumbs={[
        {
          entity: breadcrumbData.deliverableAnalysisDetail.id,
          title: deliverableAnalysisId,
        },
      ]}
      tabs={pageTabs}
    >
      <Outlet />
    </PageLayout>
  );
};
