import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { EntityTitles } from 'common/constants';
import { productMilestoneCloseResultEntityAttributes } from 'common/productMilestoneCloseResultEntityAttributes';

import { useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasMilestoneCloseFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { ProductMilestoneCloseStatusLabelMapper } from 'components/LabelMapper/ProductMilestoneCloseStatusLabelMapper';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PushedBuildsList } from 'components/PushedBuildsList/PushedBuildsList';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';
import { generatePageTitle } from 'utils/titleHelper';

export const ProductMilestoneCloseResultDetailPage = () => {
  const { closeResultId, productMilestoneId, productVersionId } = useParamsRequired();

  const serviceContainerProductMilestoneCloseResult = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerProductMilestoneCloseResultRunner = serviceContainerProductMilestoneCloseResult.run;
  const serviceContainerProductMilestoneCloseResultSetter = serviceContainerProductMilestoneCloseResult.setData;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const closeResult: ProductMilestoneCloseResult | undefined = serviceContainerProductMilestoneCloseResult.data?.content?.[0];

  const [logBuffer, addLogLines] = useDataBuffer(750, timestampHiglighter);

  useEffect(() => {
    serviceContainerProductMilestoneCloseResultRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: {
        params: {
          q: `id==${closeResultId}`,
        },
      },
    });
    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [
    serviceContainerProductMilestoneCloseResultRunner,
    serviceContainerProductVersionRunner,
    productVersionId,
    productMilestoneId,
    closeResultId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasMilestoneCloseFinished(wsData, { closeResultId })) {
          const closeResult: ProductMilestoneCloseResult = wsData.productMilestoneCloseResult;
          serviceContainerProductMilestoneCloseResultSetter((oldCloseResult) => ({
            ...oldCloseResult,
            content: [closeResult],
          }));
        }
      },
      [serviceContainerProductMilestoneCloseResultSetter, closeResultId]
    )
  );

  useBifrostWebSocketEffect(
    useCallback(
      (logLine: string) => {
        addLogLines([logLine]);
      },
      [addLogLines]
    ),
    { closeResultId }
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductMilestoneCloseResult,
      firstLevelEntity: 'Product',
      nestedEntity: 'Close Result',
      entityName: ['Close Result', closeResult?.milestone?.version, serviceContainerProductVersion.data?.product?.name],
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title={EntityTitles.productVersion}>
      <ServiceContainerLoading {...serviceContainerProductMilestoneCloseResult} title="Product Milestone Close Result details">
        <PageLayout
          title="Close Result"
          breadcrumbs={[
            {
              entity: breadcrumbData.product.id,
              title: serviceContainerProductVersion.data?.product?.name,
            },
            {
              entity: breadcrumbData.productVersion.id,
              title: serviceContainerProductVersion.data?.version,
            },
            {
              entity: breadcrumbData.productMilestone.id,
              title: serviceContainerProductMilestoneCloseResult.data?.content?.at(0)?.milestone?.version,
              url: '-/close-results/',
            },
            {
              entity: breadcrumbData.closeResults.id,
              title: breadcrumbData.closeResults.title,
              url: '+/close-results',
              custom: true,
            },
            {
              entity: breadcrumbData.closeResult.id,
              title: serviceContainerProductMilestoneCloseResult.data?.content?.at(0)?.id,
              custom: true,
            },
          ]}
        >
          <ContentBox padding marginBottom isResponsive>
            <Attributes>
              <AttributesItem title={productMilestoneCloseResultEntityAttributes.id.title}>{closeResult?.id}</AttributesItem>
              <AttributesItem title={productMilestoneCloseResultEntityAttributes.status.title}>
                {closeResult && <ProductMilestoneCloseStatusLabelMapper status={closeResult.status} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneCloseResultEntityAttributes.startingDate.title}>
                {closeResult?.startingDate && <DateTime date={closeResult.startingDate} />}
              </AttributesItem>
              <AttributesItem title={productMilestoneCloseResultEntityAttributes.endDate.title}>
                {closeResult?.endDate && <DateTime date={closeResult.endDate} />}
              </AttributesItem>
            </Attributes>
          </ContentBox>

          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Pushed Builds</Text>
              </TextContent>
            </ToolbarItem>
          </Toolbar>
          <ContentBox marginBottom shadow={false} background={false}>
            <PushedBuildsList pushedBuilds={closeResult?.buildPushResults} />
          </ContentBox>

          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Logs</Text>
              </TextContent>
            </ToolbarItem>
          </Toolbar>
          <ContentBox padding>
            <LogViewer isStatic={closeResult?.status !== 'IN_PROGRESS'} data={logBuffer} />
          </ContentBox>
        </PageLayout>
      </ServiceContainerLoading>
    </ServiceContainerLoading>
  );
};
