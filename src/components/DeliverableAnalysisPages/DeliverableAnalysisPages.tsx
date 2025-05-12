import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { DeliverableAnalyzerOperation, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasDeliverableAnalysisChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { DeliverableAnalysisAddLabelModal } from 'components/DeliverableAnalysisAddLabelModal/DeliverableAnalysisAddLabelModal';
import { DeliverableAnalysisAddLabelModalButton } from 'components/DeliverableAnalysisAddLabelModal/DeliverableAnalysisAddLabelModalButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';
import * as operationsApi from 'services/operationsApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IDeliverableAnalysisPagesProps {}

export const DeliverableAnalysisPages = ({ children }: PropsWithChildren<IDeliverableAnalysisPagesProps>) => {
  const { deliverableAnalysisId } = useParamsRequired();

  const serviceContainerDeliverableAnalysis = useServiceContainer(operationsApi.getDeliverableAnalysis);
  const serviceContainerDeliverableAnalysisRunner = serviceContainerDeliverableAnalysis.run;

  const serviceContainerDeliverableAnalysisReport = useServiceContainer(deliverableAnalysisApi.getDeliverableAnalysisReport);
  const serviceContainerDeliverableAnalysisReportRunner = serviceContainerDeliverableAnalysisReport.run;

  const serviceContainerArtifacts = useServiceContainer(deliverableAnalysisApi.getAnalyzedArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerDeliverableAnalysisRunner({
      serviceData: { id: deliverableAnalysisId },
      onSuccess: (result) => {
        if (result.response.data.result === 'SUCCESSFUL') {
          serviceContainerDeliverableAnalysisReportRunner({ serviceData: { id: deliverableAnalysisId } });
        }
      },
    });

    serviceContainerArtifactsRunner({
      serviceData: { id: deliverableAnalysisId },
      requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
    });
  }, [
    deliverableAnalysisId,
    serviceContainerDeliverableAnalysisRunner,
    serviceContainerDeliverableAnalysisReportRunner,
    serviceContainerArtifactsRunner,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (
          hasDeliverableAnalysisChanged(wsData, {
            operationId: deliverableAnalysisId,
          })
        ) {
          serviceContainerDeliverableAnalysisRunner({
            serviceData: { id: deliverableAnalysisId },
            onSuccess: (result) => {
              if (result.response.data.result === 'SUCCESSFUL') {
                serviceContainerDeliverableAnalysisReportRunner({ serviceData: { id: deliverableAnalysisId } });
              }
            },
          });
        }
      },
      [deliverableAnalysisId, serviceContainerDeliverableAnalysisRunner, serviceContainerDeliverableAnalysisReportRunner]
    )
  );

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
        Delivered Artifacts{' '}
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Delivered Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerDeliverableAnalysis} title="Deliverable Analysis details">
      <PageLayout
        title={`Deliverable Analysis ${deliverableAnalysisId}`}
        actions={
          <DeliverableAnalysisAddLabelModalAndButton
            deliverableAnalysisOperation={serviceContainerDeliverableAnalysis.data!}
            serviceContainerDeliverableAnalysisReport={serviceContainerDeliverableAnalysisReport}
          />
        }
        breadcrumbs={[
          {
            entity: breadcrumbData.deliverableAnalysisDetail.id,
            title: deliverableAnalysisId,
          },
        ]}
        tabs={pageTabs}
      >
        <Outlet
          context={{
            serviceContainerDeliverableAnalysisOperation: serviceContainerDeliverableAnalysis,
            serviceContainerDeliverableAnalysisReport: serviceContainerDeliverableAnalysisReport,
          }}
        />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

interface IDeliverableAnalysisAddLabelModalAndButtonProps {
  deliverableAnalysisOperation: DeliverableAnalyzerOperation;
  serviceContainerDeliverableAnalysisReport: IServiceContainerState<DeliverableAnalyzerReport>;
}

const DeliverableAnalysisAddLabelModalAndButton = ({
  deliverableAnalysisOperation,
  serviceContainerDeliverableAnalysisReport,
}: IDeliverableAnalysisAddLabelModalAndButtonProps) => {
  const [isAddLabelModalOpen, setIsAddLabelModalOpen] = useState<boolean>(false);

  const toggleAddLabelModal = () => setIsAddLabelModalOpen((open) => !open);

  return (
    <>
      <DeliverableAnalysisAddLabelModalButton
        toggleModal={toggleAddLabelModal}
        deliverableAnalysisOperation={deliverableAnalysisOperation}
        serviceContainerDeliverableAnalysisReport={serviceContainerDeliverableAnalysisReport}
      />
      {isAddLabelModalOpen && (
        <DeliverableAnalysisAddLabelModal
          isModalOpen={isAddLabelModalOpen}
          toggleModal={toggleAddLabelModal}
          deliverableAnalysisReport={serviceContainerDeliverableAnalysisReport.data!}
        />
      )}
    </>
  );
};
