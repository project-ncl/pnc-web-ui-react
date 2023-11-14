import { useState } from 'react';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { AnalyzeDeliverablesModal } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModal';
import { AnalyzeDeliverablesModalButton } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModalButton';
import { DeliverablesAnalysesList } from 'components/DeliverablesAnalysesList/DeliverablesAnalysesList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as operationsApi from 'services/operationsApi';

interface IDeliverablesAnalysesPageProps {
  componentId?: string;
}

export const DeliverablesAnalysesPage = ({ componentId = 'd1' }: IDeliverablesAnalysesPageProps) => {
  const serviceContainerDeliverablesAnalyses = useServiceContainer(operationsApi.getDeliverablesAnalyses);

  const [isAnalyzeDeliverablesModalOpen, setIsAnalyzeDeliverablesModalOpen] = useState<boolean>(false);

  const toggleAnalyzeDeliverablesModal = () =>
    setIsAnalyzeDeliverablesModalOpen((isAnalyzeDeliverablesModalOpen) => !isAnalyzeDeliverablesModalOpen);

  useQueryParamsEffect(serviceContainerDeliverablesAnalyses.run, { componentId });

  useTitle(PageTitles.deliverablesAnalyses);

  return (
    <>
      <PageLayout
        title={PageTitles.deliverablesAnalyses}
        description={<>This page contains list of all Deliverables Analysis operations.</>}
        actions={<AnalyzeDeliverablesModalButton toggleModal={toggleAnalyzeDeliverablesModal} variant="detail" />}
      >
        <DeliverablesAnalysesList {...{ serviceContainerDeliverablesAnalyses, componentId }} />
      </PageLayout>
      {isAnalyzeDeliverablesModalOpen && (
        <AnalyzeDeliverablesModal isModalOpen={isAnalyzeDeliverablesModalOpen} toggleModal={toggleAnalyzeDeliverablesModal} />
      )}
    </>
  );
};
