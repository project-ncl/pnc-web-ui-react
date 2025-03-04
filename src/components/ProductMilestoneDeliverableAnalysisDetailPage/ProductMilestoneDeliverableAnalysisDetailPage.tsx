import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { EntityTitles } from 'common/constants';
import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';

import {
  deliverableAnalysisLogMatchFiltersPrefix,
  deliverableAnalysisLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasDeliverableAnalysisChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverableAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverableAnalysisProgressStatusLabelMapper';
import { DeliverableAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverableAnalysisResultLabelMapper';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as operationsApi from 'services/operationsApi';
import * as productVersionApi from 'services/productVersionApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';
import { generatePageTitle } from 'utils/titleHelper';

export const ProductMilestoneDeliverableAnalysisDetailPage = () => {
  const { deliverableAnalysisId, productVersionId } = useParamsRequired();

  const serviceContainerProductMilestoneDeliverableAnalysis = useServiceContainer(operationsApi.getDeliverableAnalysis);
  const serviceContainerProductMilestoneDeliverableAnalysisRunner = serviceContainerProductMilestoneDeliverableAnalysis.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const deliverableAnalysis: DeliverableAnalyzerOperation | undefined =
    serviceContainerProductMilestoneDeliverableAnalysis.data || undefined;

  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  useEffect(() => {
    serviceContainerProductMilestoneDeliverableAnalysisRunner({
      serviceData: { id: deliverableAnalysisId },
    });

    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [
    serviceContainerProductMilestoneDeliverableAnalysisRunner,
    serviceContainerProductVersionRunner,
    deliverableAnalysisId,
    productVersionId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverableAnalysisChanged(wsData, { operationId: deliverableAnalysisId })) {
          serviceContainerProductMilestoneDeliverableAnalysisRunner({
            serviceData: { id: deliverableAnalysisId },
          });
        }
      },
      [serviceContainerProductMilestoneDeliverableAnalysisRunner, deliverableAnalysisId]
    )
  );

  const filters = useMemo(
    () => ({
      prefixFilters: deliverableAnalysisLogPrefixFilters,
      matchFilters: `${deliverableAnalysisLogMatchFiltersPrefix}${deliverableAnalysisId}`,
    }),
    [deliverableAnalysisId]
  );

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    {
      filters,
    }
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductMilestoneDeliverableAnalysis,
      firstLevelEntity: 'Product',
      nestedEntity: 'Deliverable Analysis',
      entityName: [
        `Deliverable Analysis ${deliverableAnalysis?.id}`,
        deliverableAnalysis?.productMilestone?.version,
        serviceContainerProductVersion.data?.product?.name,
      ],
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title={EntityTitles.productVersion}>
      <ServiceContainerLoading
        {...serviceContainerProductMilestoneDeliverableAnalysis}
        title="Product Milestone Deliverable Analysis details"
      >
        <PageLayout
          title="Deliverable Analysis details"
          breadcrumbs={[
            { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
            {
              entity: breadcrumbData.productVersion.id,
              title: serviceContainerProductVersion.data?.version,
            },
            {
              entity: breadcrumbData.productMilestone.id,
              title: serviceContainerProductMilestoneDeliverableAnalysis.data?.productMilestone?.version,
              url: '-/deliverable-analyses/',
            },
            {
              entity: breadcrumbData.deliverableAnalyses.id,
              title: breadcrumbData.deliverableAnalyses.title,
              url: '+/deliverable-analyses',
              custom: true,
            },
            {
              entity: breadcrumbData.deliverableAnalysisDetail.id,
              title: serviceContainerProductMilestoneDeliverableAnalysis.data?.id,
              custom: true,
            },
          ]}
        >
          <ContentBox padding marginBottom isResponsive>
            <Attributes>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.id.title}>
                {deliverableAnalysis?.id}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes['user.username'].title}>
                {deliverableAnalysis?.user?.username}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.progressStatus.title}>
                {deliverableAnalysis?.progressStatus && (
                  <DeliverableAnalysisProgressStatusLabelMapper progressStatus={deliverableAnalysis.progressStatus} />
                )}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.result.title}>
                {deliverableAnalysis?.result && <DeliverableAnalysisResultLabelMapper result={deliverableAnalysis.result} />}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.submitTime.title}>
                {deliverableAnalysis?.submitTime && <DateTime date={deliverableAnalysis.submitTime} />}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.startTime.title}>
                {deliverableAnalysis?.startTime && <DateTime date={deliverableAnalysis.startTime} />}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.endTime.title}>
                {deliverableAnalysis?.endTime && <DateTime date={deliverableAnalysis.endTime} />}
              </AttributesItem>
              <AttributesItem title={deliverableAnalysisOperationEntityAttributes.parameters.title}>
                {deliverableAnalysis?.parameters &&
                  Object.values(deliverableAnalysis.parameters).map((parameter, index) => <div key={index}>{parameter}</div>)}
              </AttributesItem>
            </Attributes>
          </ContentBox>

          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Logs</Text>
              </TextContent>
            </ToolbarItem>
          </Toolbar>
          <ContentBox padding>
            <LogViewer isStatic={deliverableAnalysis?.progressStatus !== 'IN_PROGRESS'} data={logBuffer} />
          </ContentBox>
        </PageLayout>
      </ServiceContainerLoading>
    </ServiceContainerLoading>
  );
};
