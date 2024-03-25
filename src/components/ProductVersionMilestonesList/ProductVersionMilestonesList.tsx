import { ActionsColumn, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';

import { ProductMilestone, ProductMilestonePage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneAnalyzeDeliverablesModal } from 'components/ProductMilestoneAnalyzeDeliverablesModal/ProductMilestoneAnalyzeDeliverablesModal';
import { ProductMilestoneAnalyzeDeliverablesModalButton } from 'components/ProductMilestoneAnalyzeDeliverablesModal/ProductMilestoneAnalyzeDeliverablesModalButton';
import { ProductMilestoneCloseModal } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModal';
import { ProductMilestoneCloseModalButton } from 'components/ProductMilestoneCloseModal/ProductMilestoneCloseModalButton';
import { ProductMilestoneMarkModal } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ProductMilestoneMarkModalButton } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModalButton';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const actionItemStyle = { padding: 0 };

interface IProductVersionMilestonesListProps {
  serviceContainerProductMilestones: IServiceContainerState<ProductMilestonePage>;
  componentId: string;
}

type TModalType = 'mark-as-current' | 'close' | 'analyze-deliverables';

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
  const [currentModalType, setCurrentModalType] = useState<TModalType>();

  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: productMilestoneEntityAttributes,
        defaultSorting: {
          attribute: productMilestoneEntityAttributes.plannedEndDate.id,
          direction: 'desc',
        },
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  const toggleCurrentModalProductMilestoneId = (productMilestoneId: string, modalType: TModalType) => () => {
    setCurrentModalProductMilestoneId((currentModalProductMilestoneId) =>
      currentModalProductMilestoneId ? undefined : productMilestoneId
    );
    setCurrentModalType(currentModalProductMilestoneId ? undefined : modalType);
  };

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
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.version.id)}>
                  {productMilestoneEntityAttributes.version.title}
                </Th>
                <Th width={10}>{productMilestoneEntityAttributes.status.title}</Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.startingDate.id)}>
                  {productMilestoneEntityAttributes.startingDate.title}
                </Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.plannedEndDate.id)}>
                  {productMilestoneEntityAttributes.plannedEndDate.title}
                </Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.endDate.id)}>
                  {productMilestoneEntityAttributes.endDate.title}
                </Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductMilestones.data?.content?.map((productMilestone: ProductMilestone, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <ProductMilestoneReleaseLabel
                      link={`../milestones/${productMilestone.id}`}
                      productMilestoneRelease={productMilestone}
                      isCurrent={productMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id}
                    />
                  </Td>
                  <Td>{productMilestone.endDate ? 'CLOSED' : 'OPEN'}</Td>
                  <Td>
                    {productMilestone.startingDate && <DateTime date={productMilestone.startingDate} displayTime={false} />}
                  </Td>
                  <Td>
                    {productMilestone.plannedEndDate && <DateTime date={productMilestone.plannedEndDate} displayTime={false} />}
                  </Td>
                  <Td>{productMilestone.endDate && <DateTime date={productMilestone.endDate} displayTime={false} />}</Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          style: actionItemStyle,
                          title: (
                            <ProductMilestoneMarkModalButton
                              toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'mark-as-current')}
                              productMilestone={productMilestone}
                              serviceContainerProductVersion={serviceContainerProductVersion}
                              variant="list"
                            />
                          ),
                        },
                        {
                          style: actionItemStyle,
                          title: (
                            <ProductMilestoneCloseModalButton
                              toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'close')}
                              variant="list"
                            />
                          ),
                        },
                        {
                          style: actionItemStyle,
                          title: (
                            <ProductMilestoneAnalyzeDeliverablesModalButton
                              toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'analyze-deliverables')}
                              variant="list"
                            />
                          ),
                        },
                      ]}
                    />
                    {currentModalProductMilestoneId === productMilestone.id && currentModalType === 'mark-as-current' && (
                      <ProductMilestoneMarkModal
                        isModalOpen={
                          currentModalProductMilestoneId === productMilestone.id && currentModalType === 'mark-as-current'
                        }
                        toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'mark-as-current')}
                        productMilestone={productMilestone}
                        productVersion={serviceContainerProductVersion.data!}
                        variant="list"
                      />
                    )}
                    {currentModalProductMilestoneId === productMilestone.id && currentModalType === 'close' && (
                      <ProductMilestoneCloseModal
                        isModalOpen={currentModalProductMilestoneId === productMilestone.id && currentModalType === 'close'}
                        toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'close')}
                        productMilestone={productMilestone}
                      />
                    )}
                    {currentModalProductMilestoneId === productMilestone.id && currentModalType === 'analyze-deliverables' && (
                      <ProductMilestoneAnalyzeDeliverablesModal
                        isModalOpen={
                          currentModalProductMilestoneId === productMilestone.id && currentModalType === 'analyze-deliverables'
                        }
                        toggleModal={toggleCurrentModalProductMilestoneId(productMilestone.id, 'analyze-deliverables')}
                        productMilestone={productMilestone}
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
