import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as operationsApi from 'services/operationsApi';

import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime } from 'utils/utils';

export const ProductMilestoneDeliverablesAnalysisDetailPage = () => {
  const { deliverablesAnalysisId } = useParams();

  const serviceContainerProdutMilestoneDeliverablesAnalysis = useServiceContainer(operationsApi.getDeliverablesAnalysis);
  const serviceContainerProdutMilestoneDeliverablesAnalysisRunner = serviceContainerProdutMilestoneDeliverablesAnalysis.run;

  const deliverabledAnalysis: DeliverableAnalyzerOperation = serviceContainerProdutMilestoneDeliverablesAnalysis.data;

  useEffect(() => {
    serviceContainerProdutMilestoneDeliverablesAnalysisRunner({
      serviceData: { id: deliverablesAnalysisId },
    });
  }, [serviceContainerProdutMilestoneDeliverablesAnalysisRunner, deliverablesAnalysisId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProdutMilestoneDeliverablesAnalysis,
      firstLevelEntity: 'Product',
      nestedEntity: 'Deliverables Analysis',
      entityName: `Deliverables Analysis ${deliverabledAnalysis?.id} ${PageTitles.delimiterSymbol} ${deliverabledAnalysis?.productMilestone?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  return (
    <ServiceContainerLoading
      {...serviceContainerProdutMilestoneDeliverablesAnalysis}
      title="Product Milestone Deliverables Analysis details"
    >
      <PageLayout title="Deliverables Analysis details">
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.id.title}>
              {deliverabledAnalysis?.id}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes['user.username'].title}>
              {deliverabledAnalysis?.user?.username}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.progressStatus.title}>
              {deliverabledAnalysis?.progressStatus && (
                <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={deliverabledAnalysis.progressStatus} />
              )}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.result.title}>
              {deliverabledAnalysis?.result && <DeliverablesAnalysisResultLabelMapper result={deliverabledAnalysis.result} />}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.submitTime.title}>
              {deliverabledAnalysis?.submitTime && createDateTime({ date: deliverabledAnalysis.submitTime }).custom}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.startTime.title}>
              {deliverabledAnalysis?.startTime && createDateTime({ date: deliverabledAnalysis.startTime }).custom}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.endTime.title}>
              {deliverabledAnalysis?.endTime && createDateTime({ date: deliverabledAnalysis.endTime }).custom}
            </AttributesItem>
            <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.parameters.title}>
              {deliverabledAnalysis?.parameters &&
                Object.values(deliverabledAnalysis.parameters).map((parameter, index) => <div key={index}>{parameter}</div>)}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* TODO: Log*/}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
