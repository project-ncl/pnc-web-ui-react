import { ActionsColumn, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';

import { ProductMilestone } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions } from 'common/entityAttributes';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneMarkModal } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ProductMilestoneMarkModalButton } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModalButton';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const actionItemStyle = { padding: 0 };

interface IProductVersionMilestonesListProps {
  serviceContainerProductMilestones: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Product Milestones.
 *
 * @param serviceContainerProductMilestones - Service Container for Product Milestones
 * @param componentId - Component ID
 */
export const ProductVersionMilestonesList = ({
  serviceContainerProductMilestones,
  componentId,
}: IProductVersionMilestonesListProps) => {
  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  const [currentModalProductMilestoneId, setCurrentModalProductMilestoneId] = useState<string>();

  const toggleCurrentModalProductMilestoneId = (productMilestoneId: string) => () =>
    setCurrentModalProductMilestoneId((currentModalProductMilestoneId) =>
      currentModalProductMilestoneId ? undefined : productMilestoneId
    );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: productMilestoneEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductMilestones} title={PageTitles.productMilestones}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={15}>{productMilestoneEntityAttributes.version.title}</Th>
                <Th width={10}>{productMilestoneEntityAttributes.status.title}</Th>
                <Th width={15}>{productMilestoneEntityAttributes.startingDate.title}</Th>
                <Th width={15}>{productMilestoneEntityAttributes.plannedEndDate.title}</Th>
                <Th width={15}>{productMilestoneEntityAttributes.endDate.title}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductMilestones.data?.content.map((productMilestone: ProductMilestone, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <ProductMilestoneReleaseLabel
                      link={`../milestones/${productMilestone.id}`}
                      productMilestoneRelease={productMilestone}
                      isCurrent={productMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id}
                    />
                  </Td>
                  <Td>{productMilestone.endDate ? 'CLOSED' : 'OPEN'}</Td>
                  <Td>{productMilestone.startingDate && createDateTime({ date: productMilestone.startingDate }).custom}</Td>
                  <Td>{productMilestone.plannedEndDate && createDateTime({ date: productMilestone.plannedEndDate }).custom}</Td>
                  <Td>{productMilestone.endDate && createDateTime({ date: productMilestone.endDate }).custom}</Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          style: actionItemStyle,
                          title: (
                            <ProductMilestoneMarkModalButton
                              toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id)}
                              productMilestone={productMilestone}
                              serviceContainerProductVersion={serviceContainerProductVersion}
                              variant="list"
                            />
                          ),
                        },
                        {
                          title: 'Close',
                        },
                        {
                          title: 'Analyze Deliverables',
                        },
                      ]}
                    />
                    {currentModalProductMilestoneId === productMilestone.id && (
                      <ProductMilestoneMarkModal
                        isModalOpen={currentModalProductMilestoneId === productMilestone.id}
                        toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id)}
                        productMilestone={productMilestone}
                        productVersion={serviceContainerProductVersion.data}
                        variant="list"
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProductMilestones.data?.totalHits} />
    </>
  );
};
