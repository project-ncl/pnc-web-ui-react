import { ActionsColumn, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ProductRelease } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';

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

interface IProductVersionReleasesListProps {
  serviceContainerProductReleases: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Product Releases.
 *
 * @param serviceContainerProductReleases - Service Container for Product Releases
 * @param componentId - Component ID
 */
export const ProductVersionReleasesList = ({
  serviceContainerProductReleases,
  componentId,
}: IProductVersionReleasesListProps) => {
  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(productReleaseEntityAttributes)} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductReleases} title={PageTitles.productReleases}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={25}>Version</Th>
                <Th width={20}>Release Date</Th>
                <Th width={20}>Released In</Th>
                <Th width={20}>Support Level</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductReleases.data?.content.map((productRelease: ProductRelease, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <ProductMilestoneReleaseLabel productMilestoneRelease={productRelease} isCurrent={false} />
                  </Td>
                  <Td>{productRelease.releaseDate && createDateTime({ date: productRelease.releaseDate }).date}</Td>
                  <Td>
                    {productRelease.productMilestone && (
                      <ProductMilestoneReleaseLabel
                        link={`../milestones/${productRelease.productMilestone.id}`}
                        productMilestoneRelease={productRelease.productMilestone}
                        isCurrent={
                          productRelease.productMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id
                        }
                      />
                    )}
                  </Td>
                  <Td>{productRelease.supportLevel}</Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          title: 'Edit Release',
                        },
                        {
                          title: 'Delete Release',
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

      <Pagination componentId={componentId} count={serviceContainerProductReleases.data?.totalHits} />
    </>
  );
};
