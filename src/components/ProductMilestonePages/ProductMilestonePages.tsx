import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import {
  hasBuildStarted,
  hasDeliverableAnalysisStarted,
  hasMilestoneCloseFinished,
  usePncWebSocketEffect,
} from 'hooks/usePncWebSocketEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AnalyzeDeliverablesModal } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModal';
import { AnalyzeDeliverablesModalButton } from 'components/AnalyzeDeliverablesModal/AnalyzeDeliverablesModalButton';
import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ProductMilestoneCloseModal } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModal';
import { ProductMilestoneCloseModalButton } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModalButton';
import { ProductMilestoneMarkModal } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ProductMilestoneMarkModalButton } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModalButton';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';
import { debounce } from 'utils/utils';

interface IProductMilestonePagesProps {}

type ContextType = {
  serviceContainerProductMilestone: IServiceContainerState<ProductMilestone>;
};

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePagesProps>) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerProductMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerProductMilestoneRunner = serviceContainerProductMilestone.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerBuilds = useServiceContainer(productMilestoneApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  const serviceContainerCloseResults = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerCloseResultsRunner = serviceContainerCloseResults.run;

  const serviceContainerDeliverableAnalyses = useServiceContainer(productMilestoneApi.getDeliverableAnalyses);
  const serviceContainerDeliverableAnalysesRunner = serviceContainerDeliverableAnalyses.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const [isMarkModalOpen, setIsMarkModalOpen] = useState<boolean>(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
  const [isAnalyzeDeliverablesModalOpen, setIsAnalyzeDeliverablesModalOpen] = useState<boolean>(false);

  const toggleMarkModal = () => setIsMarkModalOpen((isMarkModalOpen) => !isMarkModalOpen);

  const toggleCloseModal = () => setIsCloseModalOpen((isCloseModalOpen) => !isCloseModalOpen);

  const toggleAnalyzeDeliverablesModal = () =>
    setIsAnalyzeDeliverablesModalOpen((isAnalyzeDeliverablesModalOpen) => !isAnalyzeDeliverablesModalOpen);

  const serviceContainerBuildsRunnerDebounced = useMemo(
    () => debounce(serviceContainerBuildsRunner),
    [serviceContainerBuildsRunner]
  );

  useEffect(() => {
    serviceContainerProductMilestoneRunner({
      serviceData: { id: productMilestoneId },
      onSuccess: (result) => {
        const productMilestone = result.response.data;

        if (productMilestone.productVersion) {
          serviceContainerProductVersionRunner({ serviceData: { id: productMilestone.productVersion.id } });
        }
      },
    });

    serviceContainerBuildsRunner({ serviceData: { id: productMilestoneId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerCloseResultsRunner({ serviceData: { id: productMilestoneId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerDeliverableAnalysesRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
    });
    serviceContainerArtifactsRunner({ serviceData: { id: productMilestoneId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
  }, [
    serviceContainerProductMilestoneRunner,
    serviceContainerProductVersionRunner,
    serviceContainerBuildsRunner,
    serviceContainerCloseResultsRunner,
    serviceContainerDeliverableAnalysesRunner,
    serviceContainerArtifactsRunner,
    productMilestoneId,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData, { productMilestoneId })) {
          serviceContainerBuildsRunnerDebounced({
            serviceData: { id: productMilestoneId },
            requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
          });
        } else if (hasMilestoneCloseFinished(wsData, { productMilestoneId })) {
          serviceContainerCloseResultsRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
          });
        } else if (hasDeliverableAnalysisStarted(wsData, { productMilestoneId })) {
          serviceContainerDeliverableAnalysesRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
          });
        }
      },
      [
        serviceContainerBuildsRunnerDebounced,
        serviceContainerCloseResultsRunner,
        serviceContainerDeliverableAnalysesRunner,
        productMilestoneId,
      ]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductMilestone,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: [serviceContainerProductMilestone.data?.version, serviceContainerProductVersion.data?.product?.name],
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="builds-performed">
        Builds Performed{' '}
        <PageTabsLabel serviceContainer={serviceContainerBuilds} title="Build Performed Count">
          {serviceContainerBuilds.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="close-results">
        Close Results{' '}
        <PageTabsLabel serviceContainer={serviceContainerCloseResults} title="Close Results Count">
          {serviceContainerCloseResults.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="deliverable-analyses">
        Deliverable Analyses{' '}
        <PageTabsLabel serviceContainer={serviceContainerDeliverableAnalyses} title="Deliverable Analyses Count">
          {serviceContainerDeliverableAnalyses.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="delivered-artifacts">
        Delivered Artifacts{' '}
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Delivered Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <ExperimentalContent>
        <PageTabsItem url="interconnection-graph">
          <ExperimentalContentMarker dataSource="mock" contentType="text" showTooltip>
            Interconnection Graph
          </ExperimentalContentMarker>
        </PageTabsItem>
      </ExperimentalContent>
    </PageTabs>
  );

  const actions = [
    <ProductMilestoneMarkModalButton
      key="mark-milestone-button"
      toggleModal={toggleMarkModal}
      productMilestone={serviceContainerProductMilestone.data!}
      serviceContainerProductVersion={serviceContainerProductVersion}
      variant="detail"
    />,
    <ProductMilestoneCloseModalButton key="close-milestone-button" toggleModal={toggleCloseModal} variant="detail" />,
    <AnalyzeDeliverablesModalButton key="del-analysis-button" toggleModal={toggleAnalyzeDeliverablesModal} variant="detail" />,
    <ProtectedComponent key="edit-milestone-button">
      <ActionButton link="edit">Edit Milestone</ActionButton>
    </ProtectedComponent>,
  ];

  return (
    <ServiceContainerLoading {...serviceContainerProductMilestone} title="Product Milestone details">
      <ServiceContainerLoading {...serviceContainerProductVersion} title="Product Version">
        <PageLayout
          title={`${serviceContainerProductVersion.data?.product?.name ?? ''} ${serviceContainerProductMilestone.data?.version}`}
          tabs={pageTabs}
          actions={actions}
          breadcrumbs={[
            { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
            {
              entity: breadcrumbData.productVersion.id,
              title: serviceContainerProductMilestone.data?.productVersion?.version,
            },
            { entity: breadcrumbData.productMilestone.id, title: serviceContainerProductMilestone.data?.version },
          ]}
        >
          <Outlet context={{ serviceContainerProductMilestone }} />
        </PageLayout>
        {isMarkModalOpen && (
          <ProductMilestoneMarkModal
            isModalOpen={isMarkModalOpen}
            toggleModal={toggleMarkModal}
            productMilestone={serviceContainerProductMilestone.data!}
            productVersion={serviceContainerProductVersion.data!}
            variant="detail"
          />
        )}
        {isCloseModalOpen && (
          <ProductMilestoneCloseModal
            isModalOpen={isCloseModalOpen}
            toggleModal={toggleCloseModal}
            productMilestone={serviceContainerProductMilestone.data!}
          />
        )}
        {isAnalyzeDeliverablesModalOpen && (
          <AnalyzeDeliverablesModal
            isModalOpen={isAnalyzeDeliverablesModalOpen}
            toggleModal={toggleAnalyzeDeliverablesModal}
            productMilestone={serviceContainerProductMilestone.data!}
          />
        )}
      </ServiceContainerLoading>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerProductMilestone() {
  return useOutletContext<ContextType>();
}
