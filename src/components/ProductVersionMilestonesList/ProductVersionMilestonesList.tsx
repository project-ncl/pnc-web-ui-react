import { ActionsColumn, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ProductMilestone } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

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

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(productMilestoneEntityAttributes)} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductMilestones} title={PageTitles.productMilestones}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={15}>Version</Th>
                <Th width={10}>Status</Th>
                <Th width={15}>Start Date</Th>
                <Th width={15}>Planned End Date</Th>
                <Th width={15}>End Date</Th>
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
                          title: 'Mark the Milestone as current',
                        },
                        {
                          title: 'Close the Milestone',
                        },
                        {
                          title: 'Analyze Deliverables',
                        },
                      ]}
                    />
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
