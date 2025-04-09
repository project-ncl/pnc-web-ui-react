import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DeliverableAnalyzerOperation, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { EntityTitles } from 'common/constants';
import { DeliverableAnalysisLabel, deliverableAnalysisLabels } from 'common/deliverableAnalysisLabelEntryEntityAttributes';
import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';
import { deliverableAnalysisReportEntityAttributes } from 'common/deliverableAnalysisReportEntityAttributes';

import {
  deliverableAnalysisLogMatchFiltersPrefix,
  deliverableAnalysisLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasDeliverableAnalysisChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverableAnalysisAddLabelModal } from 'components/DeliverableAnalysisAddLabelModal/DeliverableAnalysisAddLabelModal';
import { DeliverableAnalysisAddLabelModalButton } from 'components/DeliverableAnalysisAddLabelModal/DeliverableAnalysisAddLabelModalButton';
import { DeliverableAnalysisRemoveLabelModal } from 'components/DeliverableAnalysisRemoveLabelModal/DeliverableAnalysisRemoveLabelModal';
import { DeliverableAnalysisLabelLabelMapper } from 'components/LabelMapper/DeliverableAnalysisLabelLabelMapper';
import { DeliverableAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverableAnalysisProgressStatusLabelMapper';
import { DeliverableAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverableAnalysisResultLabelMapper';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';
import * as operationsApi from 'services/operationsApi';
import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';
import { generatePageTitle } from 'utils/titleHelper';

export const DeliverableAnalysisDetailPage = () => {
  const { deliverableAnalysisId } = useParamsRequired();

  const serviceContainerDeliverableAnalysisOperation = useServiceContainer(operationsApi.getDeliverableAnalysis);
  const serviceContainerDeliverableAnalysisOperationRunner = serviceContainerDeliverableAnalysisOperation.run;

  const serviceContainerDeliverableAnalysisReport = useServiceContainer(deliverableAnalysisApi.getDeliverableAnalysisReport, 0);
  const serviceContainerDeliverableAnalysisReportRunner = serviceContainerDeliverableAnalysisReport.run;

  const serviceContainerProductMilestone = useServiceContainer(productMilestoneApi.getProductMilestone, 0);
  const serviceContainerProductMilestoneRunner = serviceContainerProductMilestone.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const deliverableAnalysis: DeliverableAnalyzerOperation | undefined =
    serviceContainerDeliverableAnalysisOperation.data || undefined;

  useEffect(() => {
    serviceContainerDeliverableAnalysisOperationRunner({
      serviceData: { id: deliverableAnalysisId },
      onSuccess: (result) => {
        if (result.response.data.result === 'SUCCESSFUL') {
          serviceContainerDeliverableAnalysisReportRunner({ serviceData: { id: deliverableAnalysisId } });
        }

        const productMilestoneId = result.response.data.productMilestone?.id;

        if (productMilestoneId) {
          serviceContainerProductMilestoneRunner({
            serviceData: { id: productMilestoneId },
            onSuccess: (result) => {
              const productVersionId = result.response.data.productVersion?.id;

              if (productVersionId) {
                serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
              }
            },
          });
        }
      },
    });
  }, [
    serviceContainerDeliverableAnalysisOperationRunner,
    serviceContainerDeliverableAnalysisReportRunner,
    serviceContainerProductMilestoneRunner,
    serviceContainerProductVersionRunner,
    deliverableAnalysisId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverableAnalysisChanged(wsData, { operationId: deliverableAnalysisId })) {
          serviceContainerDeliverableAnalysisOperationRunner({
            serviceData: { id: deliverableAnalysisId },
            onSuccess: (result) => {
              if (result.response.data.result === 'SUCCESSFUL') {
                serviceContainerDeliverableAnalysisReportRunner({ serviceData: { id: deliverableAnalysisId } });
              }
            },
          });
        }
      },
      [serviceContainerDeliverableAnalysisOperationRunner, serviceContainerDeliverableAnalysisReportRunner, deliverableAnalysisId]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerDeliverableAnalysisOperation,
      firstLevelEntity: 'Deliverable Analysis',
      entityName: `Deliverable Analysis ${deliverableAnalysis?.id}`,
    })
  );

  return (
    <ServiceContainerLoading
      {...serviceContainerDeliverableAnalysisOperation}
      title="Product Milestone Deliverable Analysis details"
    >
      <PageLayout
        title="Deliverable Analysis details"
        actions={
          <DeliverableAnalysisAddLabelModalAndButton
            deliverableAnalysisOperation={deliverableAnalysis!}
            serviceContainerDeliverableAnalysisReport={serviceContainerDeliverableAnalysisReport}
          />
        }
        breadcrumbs={[
          {
            entity: breadcrumbData.deliverableAnalysisDetail.id,
            title: serviceContainerDeliverableAnalysisOperation.data?.id,
          },
        ]}
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={deliverableAnalysisOperationEntityAttributes.id.title}>
              {deliverableAnalysis?.id}
            </AttributesItem>
            <AttributesItem title={deliverableAnalysisOperationEntityAttributes['productMilestone.version'].title}>
              {deliverableAnalysis?.productMilestone && (
                <ServiceContainerLoading
                  {...serviceContainerProductMilestone}
                  variant="inline"
                  title={EntityTitles.productMilestone}
                >
                  <ServiceContainerLoading
                    {...serviceContainerProductVersion}
                    variant="inline"
                    title={EntityTitles.productVersion}
                  >
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
                  title={'Deliverable Analysis label'}
                >
                  <div className="display-flex gap-5">
                    {serviceContainerDeliverableAnalysisReport.data?.labels?.map((label) => (
                      <DeliverableAnalysisLabelLabel key={label} label={label} deliverableAnalysisReport={deliverableAnalysis!} />
                    ))}
                  </div>
                </ServiceContainerLoading>
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <LogViewerSection deliverableAnalysis={deliverableAnalysis} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

interface ILogViewerSectionProps {
  deliverableAnalysis?: DeliverableAnalyzerOperation;
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

  return (
    <>
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
    </>
  );
};

const DeliverableAnalysisLabelTooltip = () => (
  <div>
    Label defines additional metadata about a Deliverable Analysis. This influences which Delivered Artifacts are included in
    Product Milestone Comparison or Product statistics dashboards.
    <dl className="m-t-20">
      <dt>
        <b>SCRATCH</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'SCRATCH')!.description}</dd>
    </dl>
    <dl className="m-t-20">
      <dt>
        <b>DELETED</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'DELETED')!.description}</dd>
    </dl>
    <dl className="m-t-20">
      <dt>
        <b>RELEASED</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'RELEASED')!.description}</dd>
    </dl>
  </div>
);

interface IDeliverableAnalysisAddLabelModalAndButtonProps {
  deliverableAnalysisOperation: DeliverableAnalyzerOperation;
  serviceContainerDeliverableAnalysisReport: IServiceContainerState<DeliverableAnalyzerReport>;
}

const DeliverableAnalysisAddLabelModalAndButton = ({
  deliverableAnalysisOperation,
  serviceContainerDeliverableAnalysisReport,
}: IDeliverableAnalysisAddLabelModalAndButtonProps) => {
  const [isAddLabelModalOpen, setIsAddLabelModalOpen] = useState<boolean>(false);

  const toggleAddLabelModal = () => setIsAddLabelModalOpen((isAddLabelModalOpen) => !isAddLabelModalOpen);

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

interface IDeliverableAnalysisLabelLabelProps {
  label: DeliverableAnalysisLabel;
  deliverableAnalysisReport: DeliverableAnalyzerReport;
}

const DeliverableAnalysisLabelLabel = ({ label, deliverableAnalysisReport }: IDeliverableAnalysisLabelLabelProps) => {
  const [isRemoveLabelModalOpen, setIsRemoveLabelModalOpen] = useState<boolean>(false);

  const toggleRemoveLabelModal = () => setIsRemoveLabelModalOpen((isRemoveLabelModalOpen) => !isRemoveLabelModalOpen);

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
