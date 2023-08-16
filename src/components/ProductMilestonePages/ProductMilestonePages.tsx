import { PropsWithChildren, useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { PageTitles, SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductMilestoneAnalyzeDeliverablesModal } from 'components/ProductMilestoneAnalyzeDeliverablesModal/ProductMilestoneAnalyzeDeliverablesModal';
import { ProductMilestoneAnalyzeDeliverablesModalButton } from 'components/ProductMilestoneAnalyzeDeliverablesModal/ProductMilestoneAnalyzeDeliverablesModalButton';
import { ProductMilestoneCloseModal } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModal';
import { ProductMilestoneCloseModalButton } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModalButton';
import { ProductMilestoneMarkModal } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ProductMilestoneMarkModalButton } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModalButton';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';
import { TabsLabel } from 'components/Tabs/TabsLabel';

import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductMilestonePagesProps {}

type ContextType = { serviceContainerProductMilestone: IServiceContainer };

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePagesProps>) => {
  const { productMilestoneId } = useParams();

  const serviceContainerProductMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerProductMilestoneRunner = serviceContainerProductMilestone.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const [isMarkModalOpen, setIsMarkModalOpen] = useState<boolean>(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
  const [isAnalyzeDeliverablesModalOpen, setIsAnalyzeDeliverablesModalOpen] = useState<boolean>(false);

  const toggleMarkModal = () => setIsMarkModalOpen((isMarkModalOpen) => !isMarkModalOpen);

  const toggleCloseModal = () => setIsCloseModalOpen((isCloseModalOpen) => !isCloseModalOpen);

  const toggleAnalyzeDeliverablesModal = () =>
    setIsAnalyzeDeliverablesModalOpen((isAnalyzeDeliverablesModalOpen) => !isAnalyzeDeliverablesModalOpen);

  useEffect(() => {
    serviceContainerProductMilestoneRunner({ serviceData: { id: productMilestoneId } }).then((response: any) => {
      const productMilestone: ProductMilestone = response.data;

      if (productMilestone.productVersion) {
        serviceContainerProductVersionRunner({ serviceData: { id: productMilestone.productVersion.id } });
      }
    });

    serviceContainerArtifactsRunner({ serviceData: { id: productMilestoneId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [
    serviceContainerProductMilestoneRunner,
    serviceContainerProductVersionRunner,
    serviceContainerArtifactsRunner,
    productMilestoneId,
  ]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductMilestone,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: `${serviceContainerProductMilestone.data?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="builds-performed">Builds Performed</TabsItem>
      <TabsItem url="close-results">Close Results</TabsItem>
      <TabsItem url="deliverables-analysis">Deliverables Analysis</TabsItem>
      <TabsItem url="delivered-artifacts">
        Delivered Artifacts{' '}
        <TabsLabel serviceContainer={serviceContainerArtifacts} title={'Delivered Artifacts Count'}>
          {serviceContainerArtifacts.data?.totalHits}
        </TabsLabel>
      </TabsItem>
      <TabsItem url="interconnection-graph">Interconnection Graph</TabsItem>
    </Tabs>
  );

  const actions = [
    <ProductMilestoneMarkModalButton
      toggleModal={toggleMarkModal}
      productMilestone={serviceContainerProductMilestone.data}
      serviceContainerProductVersion={serviceContainerProductVersion}
      variant="detail"
    />,
    <ProductMilestoneCloseModalButton toggleModal={toggleCloseModal} variant="detail" />,
    <ProductMilestoneAnalyzeDeliverablesModalButton toggleModal={toggleAnalyzeDeliverablesModal} variant="detail" />,
  ];

  return (
    <ServiceContainerLoading {...serviceContainerProductMilestone} title="Product Milestone details">
      <PageLayout title={`Product Milestone ${serviceContainerProductMilestone.data?.version}`} tabs={pageTabs} actions={actions}>
        <Outlet context={{ serviceContainerProductMilestone }} />
      </PageLayout>
      {isMarkModalOpen && (
        <ProductMilestoneMarkModal
          isModalOpen={isMarkModalOpen}
          toggleModal={toggleMarkModal}
          productMilestone={serviceContainerProductMilestone.data}
          productVersion={serviceContainerProductVersion.data}
          variant="detail"
        />
      )}
      {isCloseModalOpen && (
        <ProductMilestoneCloseModal
          isModalOpen={isCloseModalOpen}
          toggleModal={toggleCloseModal}
          productMilestone={serviceContainerProductMilestone.data}
        />
      )}
      {isAnalyzeDeliverablesModalOpen && (
        <ProductMilestoneAnalyzeDeliverablesModal
          isModalOpen={isAnalyzeDeliverablesModalOpen}
          toggleModal={toggleAnalyzeDeliverablesModal}
          productMilestone={serviceContainerProductMilestone.data}
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerProductMilestone() {
  return useOutletContext<ContextType>();
}
