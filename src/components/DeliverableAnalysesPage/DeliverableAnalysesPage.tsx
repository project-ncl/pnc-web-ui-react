import { useCallback, useState } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { hasDeliverableAnalysisChanged, hasDeliverableAnalysisStarted, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { AnalyzeDeliverablesModal } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModal';
import { AnalyzeDeliverablesModalButton } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModalButton';
import { DeliverableAnalysesList } from 'components/DeliverableAnalysesList/DeliverableAnalysesList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as operationsApi from 'services/operationsApi';

import { refreshPage } from 'utils/refreshHelper';

interface IDeliverableAnalysesPageProps {
  componentId?: string;
}

export const DeliverableAnalysesPage = ({ componentId = 'da' }: IDeliverableAnalysesPageProps) => {
  const { componentQueryParamsObject: deliverableAnalysesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerDeliverableAnalyses = useServiceContainer(operationsApi.getDeliverableAnalyses);
  const serviceContainerDeliverableAnalysesRunner = serviceContainerDeliverableAnalyses.run;
  const serviceContainerDeliverableAnalysesSetter = serviceContainerDeliverableAnalyses.setData;

  const [isAnalyzeDeliverablesModalOpen, setIsAnalyzeDeliverablesModalOpen] = useState<boolean>(false);

  const toggleAnalyzeDeliverablesModal = () =>
    setIsAnalyzeDeliverablesModalOpen((isAnalyzeDeliverablesModalOpen) => !isAnalyzeDeliverablesModalOpen);

  useQueryParamsEffect(useCallback(serviceContainerDeliverableAnalysesRunner, [serviceContainerDeliverableAnalysesRunner]), {
    componentId,
  });

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverableAnalysisStarted(wsData)) {
          serviceContainerDeliverableAnalysesRunner({
            requestConfig: { params: deliverableAnalysesQueryParamsObject },
          });
        } else if (hasDeliverableAnalysisChanged(wsData)) {
          const wsOperation: DeliverableAnalyzerOperation = wsData.operation;
          serviceContainerDeliverableAnalysesSetter((previousPage) => refreshPage(previousPage!, wsOperation));
        }
      },
      [serviceContainerDeliverableAnalysesRunner, serviceContainerDeliverableAnalysesSetter, deliverableAnalysesQueryParamsObject]
    )
  );

  useTitle(PageTitles.deliverableAnalyses);

  return (
    <PageLayout
      title={PageTitles.deliverableAnalyses}
      description={
        <>
          This page contains a list of all Deliverable Analyses, including those created for Milestones as well as those that are
          Milestone-less.
        </>
      }
      actions={<AnalyzeDeliverablesModalButton toggleModal={toggleAnalyzeDeliverablesModal} variant="detail" />}
    >
      <DeliverableAnalysesList {...{ serviceContainerDeliverableAnalyses, componentId }} />

      {isAnalyzeDeliverablesModalOpen && (
        <AnalyzeDeliverablesModal isModalOpen={isAnalyzeDeliverablesModalOpen} toggleModal={toggleAnalyzeDeliverablesModal} />
      )}
    </PageLayout>
  );
};
