import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { EntityTitles } from 'common/constants';
import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

import {
  deliverablesAnalysisLogMatchFiltersPrefix,
  deliverablesAnalysisLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
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
import { LogViewer } from 'components/LogViewer/LogViewer';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as operationsApi from 'services/operationsApi';
import * as productVersionApi from 'services/productVersionApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';
import { generatePageTitle } from 'utils/titleHelper';

export const ProductMilestoneDeliverablesAnalysisDetailPage = () => {
  const { deliverablesAnalysisId, productVersionId } = useParamsRequired();

  const serviceContainerProductMilestoneDeliverablesAnalysis = useServiceContainer(operationsApi.getDeliverablesAnalysis);
  const serviceContainerProductMilestoneDeliverablesAnalysisRunner = serviceContainerProductMilestoneDeliverablesAnalysis.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const deliverablesAnalysis: DeliverableAnalyzerOperation | undefined =
    serviceContainerProductMilestoneDeliverablesAnalysis.data || undefined;

  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  useEffect(() => {
    serviceContainerProductMilestoneDeliverablesAnalysisRunner({
      serviceData: { id: deliverablesAnalysisId },
    });

    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [
    serviceContainerProductMilestoneDeliverablesAnalysisRunner,
    serviceContainerProductVersionRunner,
    deliverablesAnalysisId,
    productVersionId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverablesAnalysisChanged(wsData, { operationId: deliverablesAnalysisId })) {
          serviceContainerProductMilestoneDeliverablesAnalysisRunner({
            serviceData: { id: deliverablesAnalysisId },
          });
        }
      },
      [serviceContainerProductMilestoneDeliverablesAnalysisRunner, deliverablesAnalysisId]
    )
  );

  const filters = useMemo(
    () => ({
      prefixFilters: deliverablesAnalysisLogPrefixFilters,
      matchFilters: `${deliverablesAnalysisLogMatchFiltersPrefix}${deliverablesAnalysisId}`,
    }),
    [deliverablesAnalysisId]
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
      serviceContainer: serviceContainerProductMilestoneDeliverablesAnalysis,
      firstLevelEntity: 'Product',
      nestedEntity: 'Deliverables Analysis',
      entityName: [
        `Deliverables Analysis ${deliverablesAnalysis?.id}`,
        deliverablesAnalysis?.productMilestone?.version,
        serviceContainerProductVersion.data?.product?.name,
      ],
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title={EntityTitles.productVersion}>
      <ServiceContainerLoading
        {...serviceContainerProductMilestoneDeliverablesAnalysis}
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
              title: serviceContainerProductMilestoneDeliverablesAnalysis.data?.productMilestone?.version,
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
              title: serviceContainerProductMilestoneDeliverablesAnalysis.data?.id,
              custom: true,
            },
          ]}
        >
          <ContentBox padding marginBottom isResponsive>
            <Attributes>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.id.title}>
                {deliverablesAnalysis?.id}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes['user.username'].title}>
                {deliverablesAnalysis?.user?.username}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.progressStatus.title}>
                {deliverablesAnalysis?.progressStatus && (
                  <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={deliverablesAnalysis.progressStatus} />
                )}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.result.title}>
                {deliverablesAnalysis?.result && <DeliverablesAnalysisResultLabelMapper result={deliverablesAnalysis.result} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.submitTime.title}>
                {deliverablesAnalysis?.submitTime && <DateTime date={deliverablesAnalysis.submitTime} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.startTime.title}>
                {deliverablesAnalysis?.startTime && <DateTime date={deliverablesAnalysis.startTime} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.endTime.title}>
                {deliverablesAnalysis?.endTime && <DateTime date={deliverablesAnalysis.endTime} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneDeliverablesAnalysisEntityAttributes.parameters.title}>
                {deliverablesAnalysis?.parameters &&
                  Object.values(deliverablesAnalysis.parameters).map((parameter, index) => <div key={index}>{parameter}</div>)}
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
            <LogViewer isStatic={deliverablesAnalysis?.progressStatus !== 'IN_PROGRESS'} data={logBuffer} />
          </ContentBox>
        </PageLayout>
      </ServiceContainerLoading>
    </ServiceContainerLoading>
  );
};
