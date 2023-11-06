import { useCallback, useEffect } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { EntityTitles, PageTitles } from 'common/constants';
import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasDeliverablesAnalysisChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as operationsApi from 'services/operationsApi';
import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

export const ProductMilestoneDeliverablesAnalysisDetailPage = () => {
  const { deliverablesAnalysisId, productVersionId } = useParamsRequired();

  const serviceContainerProdutMilestoneDeliverablesAnalysis = useServiceContainer(operationsApi.getDeliverablesAnalysis);
  const serviceContainerProdutMilestoneDeliverablesAnalysisRunner = serviceContainerProdutMilestoneDeliverablesAnalysis.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const deliverabledAnalysis: DeliverableAnalyzerOperation | undefined =
    serviceContainerProdutMilestoneDeliverablesAnalysis.data || undefined;

  useEffect(() => {
    serviceContainerProdutMilestoneDeliverablesAnalysisRunner({
      serviceData: { id: deliverablesAnalysisId },
    });

    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [
    serviceContainerProdutMilestoneDeliverablesAnalysisRunner,
    serviceContainerProductVersionRunner,
    deliverablesAnalysisId,
    productVersionId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverablesAnalysisChanged(wsData, { operationId: deliverablesAnalysisId })) {
          serviceContainerProdutMilestoneDeliverablesAnalysisRunner({
            serviceData: { id: deliverablesAnalysisId },
          });
        }
      },
      [serviceContainerProdutMilestoneDeliverablesAnalysisRunner, deliverablesAnalysisId]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProdutMilestoneDeliverablesAnalysis,
      firstLevelEntity: 'Product',
      nestedEntity: 'Deliverables Analysis',
      entityName: `Deliverables Analysis ${deliverabledAnalysis?.id} ${PageTitles.delimiterSymbol} ${deliverabledAnalysis?.productMilestone?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title={EntityTitles.productVersion}>
      <ServiceContainerLoading
        {...serviceContainerProdutMilestoneDeliverablesAnalysis}
        title="Product Milestone Deliverables Analysis details"
      >
        <PageLayout
          title="Deliverables Analysis details"
          breadcrumbs={[
            { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
            {
              entity: breadcrumbData.productVersion.id,
              title: serviceContainerProductVersion.data?.version,
            },
            {
              entity: breadcrumbData.productMilestone.id,
              title: serviceContainerProdutMilestoneDeliverablesAnalysis.data?.productMilestone?.version,
              url: '-/deliverables-analysis/',
            },
            {
              entity: breadcrumbData.deliverablesAnalysis.id,
              title: breadcrumbData.deliverablesAnalysis.title,
              url: '+/deliverables-analysis',
              custom: true,
            },
            {
              entity: breadcrumbData.deliverablesAnalysisDetail.id,
              title: serviceContainerProdutMilestoneDeliverablesAnalysis.data?.id,
              custom: true,
            },
          ]}
        >
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
                {deliverabledAnalysis?.submitTime && <DateTime date={deliverabledAnalysis.submitTime} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.startTime.title}>
                {deliverabledAnalysis?.startTime && <DateTime date={deliverabledAnalysis.startTime} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.endTime.title}>
                {deliverabledAnalysis?.endTime && <DateTime date={deliverabledAnalysis.endTime} />}
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
    </ServiceContainerLoading>
  );
};
