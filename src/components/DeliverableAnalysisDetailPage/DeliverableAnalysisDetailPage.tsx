import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import { DeliverableAnalyzerOperation, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { EntityTitles, PageTitles } from 'common/constants';
import { DeliverableAnalysisLabel } from 'common/deliverableAnalysisLabelEntryEntityAttributes';
import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';
import { deliverableAnalysisReportEntityAttributes } from 'common/deliverableAnalysisReportEntityAttributes';

import {
  deliverableAnalysisLogMatchFiltersPrefix,
  deliverableAnalysisLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverableAnalysisLabelsHistoryList } from 'components/DeliverableAnalysisLabelHistoryList/DeliverableAnalysisLabelHistoryList';
import { DeliverableAnalysisLabelTooltip } from 'components/DeliverableAnalysisLabelTooltip/DeliverableAnalysisLabelTooltip';
import { DeliverableAnalysisRemoveLabelModal } from 'components/DeliverableAnalysisRemoveLabelModal/DeliverableAnalysisRemoveLabelModal';
import { DeliverableAnalysisLabelLabelMapper } from 'components/LabelMapper/DeliverableAnalysisLabelLabelMapper';
import { OperationProgressStatusLabelMapper } from 'components/LabelMapper/OperationProgressStatusLabelMapper';
import { OperationResultLabelMapper } from 'components/LabelMapper/OperationResultLabelMapper';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';
import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';

interface IDeliverableAnalysisDetailPage {
  componentId?: string;
}

interface ContextType {
  serviceContainerDeliverableAnalysisOperation: IServiceContainerState<DeliverableAnalyzerOperation>;
  serviceContainerDeliverableAnalysisReport: IServiceContainerState<DeliverableAnalyzerReport>;
}

export const DeliverableAnalysisDetailPage = ({ componentId = 'da1' }: IDeliverableAnalysisDetailPage) => {
  const { serviceContainerDeliverableAnalysisOperation, serviceContainerDeliverableAnalysisReport } =
    useOutletContext<ContextType>();

  const { deliverableAnalysisId } = useParamsRequired();

  const serviceContainerLabelsHistory = useServiceContainer(deliverableAnalysisApi.getLabelsHistory, 0);
  const serviceContainerlabelsHistoryRunner = serviceContainerLabelsHistory.run;

  const serviceContainerProductMilestone = useServiceContainer(productMilestoneApi.getProductMilestone, 0);
  const serviceContainerProductMilestoneRunner = serviceContainerProductMilestone.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const deliverableAnalysis = serviceContainerDeliverableAnalysisOperation.data;

  useEffect(() => {
    const milestoneId = deliverableAnalysis?.productMilestone?.id;
    if (milestoneId) {
      serviceContainerProductMilestoneRunner({
        serviceData: { id: milestoneId },
        onSuccess: (res) => {
          const versionId = res.response.data.productVersion?.id;
          if (versionId) {
            serviceContainerProductVersionRunner({ serviceData: { id: versionId } });
          }
        },
      });
    }
  }, [deliverableAnalysis?.productMilestone?.id, serviceContainerProductMilestoneRunner, serviceContainerProductVersionRunner]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerlabelsHistoryRunner({
          serviceData: { id: deliverableAnalysisId },
          requestConfig,
        }),
      [deliverableAnalysisId, serviceContainerlabelsHistoryRunner]
    ),
    {
      componentId,
      mandatoryQueryParams: listMandatoryQueryParams.pagination,
    }
  );

  return (
    <ServiceContainerLoading
      {...serviceContainerDeliverableAnalysisOperation}
      title="Product Milestone Deliverable Analysis details"
    >
      <ContentBox padding marginBottom isResponsive>
        <Attributes>
          <AttributesItem title={deliverableAnalysisOperationEntityAttributes.id.title}>{deliverableAnalysis?.id}</AttributesItem>
          <AttributesItem title={deliverableAnalysisOperationEntityAttributes['productMilestone.version'].title}>
            {deliverableAnalysis?.productMilestone && (
              <ServiceContainerLoading
                {...serviceContainerProductMilestone}
                variant="inline"
                title={EntityTitles.productMilestone}
              >
                <ServiceContainerLoading {...serviceContainerProductVersion} variant="inline" title={EntityTitles.productVersion}>
                  <ProductMilestoneReleaseLabel
                    link={`/products/${serviceContainerProductVersion.data?.product?.id}/versions/${serviceContainerProductVersion.data?.id}/milestones/${serviceContainerProductMilestone.data?.id}`}
                    productMilestoneRelease={serviceContainerProductMilestone.data!}
                    productName={serviceContainerProductVersion.data?.product?.name}
                    isCurrent={
                      serviceContainerProductVersion.data?.currentProductMilestone?.id ===
                      serviceContainerProductMilestone.data?.id
                    }
                  />
                </ServiceContainerLoading>
              </ServiceContainerLoading>
            )}
          </AttributesItem>
          <AttributesItem title={deliverableAnalysisOperationEntityAttributes['user.username'].title}>
            {deliverableAnalysis?.user?.username}
          </AttributesItem>
          <AttributesItem title={deliverableAnalysisOperationEntityAttributes.progressStatus.title}>
            {deliverableAnalysis?.progressStatus && (
              <OperationProgressStatusLabelMapper progressStatus={deliverableAnalysis.progressStatus} />
            )}
          </AttributesItem>
          <AttributesItem title={deliverableAnalysisOperationEntityAttributes.result.title}>
            {deliverableAnalysis?.result && <OperationResultLabelMapper result={deliverableAnalysis.result} />}
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
              Object.values(deliverableAnalysis.parameters).map((param, idx) => <div key={idx}>{param}</div>)}
          </AttributesItem>
          <AttributesItem
            title={deliverableAnalysisReportEntityAttributes.labels.title}
            tooltip={<DeliverableAnalysisLabelTooltip />}
          >
            {(serviceContainerDeliverableAnalysisReport.loading ||
              serviceContainerDeliverableAnalysisReport.error ||
              !!serviceContainerDeliverableAnalysisReport.data?.labels?.length) && (
              <ServiceContainerLoading
                {...serviceContainerDeliverableAnalysisReport}
                variant="inline"
                title="Deliverable Analysis label"
              >
                <div className="display-flex gap-5">
                  {serviceContainerDeliverableAnalysisReport.data?.labels?.map((label) => (
                    <DeliverableAnalysisLabelLabel
                      key={label}
                      label={label}
                      deliverableAnalysisReport={serviceContainerDeliverableAnalysisReport.data!}
                    />
                  ))}
                </div>
              </ServiceContainerLoading>
            )}
          </AttributesItem>
        </Attributes>
      </ContentBox>

      <ContentBox marginBottom>
        <Toolbar borderBottom>
          <ToolbarItem>
            <Content component={ContentVariants.h2}>{PageTitles.deliverableAnalysisLabelsHistory}</Content>
          </ToolbarItem>
        </Toolbar>
        <DeliverableAnalysisLabelsHistoryList
          serviceContainerLabelsHistory={serviceContainerLabelsHistory}
          componentId={componentId}
        />
      </ContentBox>

      <LogViewerSection deliverableAnalysis={deliverableAnalysis} />
    </ServiceContainerLoading>
  );
};

interface ILogViewerSectionProps {
  deliverableAnalysis: DeliverableAnalyzerOperation | null | undefined;
}

const LogViewerSection = ({ deliverableAnalysis }: ILogViewerSectionProps) => {
  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  const filters = useMemo(
    () => ({
      prefixFilters: deliverableAnalysisLogPrefixFilters,
      matchFilters: `${deliverableAnalysisLogMatchFiltersPrefix}${deliverableAnalysis?.id}`,
    }),
    [deliverableAnalysis?.id]
  );

  useBifrostWebSocketEffect(
    useCallback((logLines) => addLogLines(logLines), [addLogLines]),
    { filters }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem>
          <Content component={ContentVariants.h2}>Logs</Content>
        </ToolbarItem>
      </Toolbar>
      <ContentBox padding>
        <LogViewer isStatic={deliverableAnalysis?.progressStatus !== 'IN_PROGRESS'} data={logBuffer} />
      </ContentBox>
    </>
  );
};

interface IDeliverableAnalysisLabelLabelProps {
  label: DeliverableAnalysisLabel;
  deliverableAnalysisReport: DeliverableAnalyzerReport;
}

const DeliverableAnalysisLabelLabel = ({ label, deliverableAnalysisReport }: IDeliverableAnalysisLabelLabelProps) => {
  const [isRemoveLabelModalOpen, setIsRemoveLabelModalOpen] = useState<boolean>(false);

  const toggleRemoveLabelModal = () => setIsRemoveLabelModalOpen((open) => !open);

  const canLabelBeChanged = label !== 'SCRATCH';

  return (
    <>
      {canLabelBeChanged ? (
        <ProtectedComponent>
          <DeliverableAnalysisLabelLabelMapper label={label} onRemove={toggleRemoveLabelModal} />
        </ProtectedComponent>
      ) : (
        <DeliverableAnalysisLabelLabelMapper label={label} />
      )}
      {canLabelBeChanged && (
        <DeliverableAnalysisRemoveLabelModal
          isModalOpen={isRemoveLabelModalOpen}
          toggleModal={toggleRemoveLabelModal}
          deliverableAnalysisReport={deliverableAnalysisReport}
          label={label}
        />
      )}
    </>
  );
};
