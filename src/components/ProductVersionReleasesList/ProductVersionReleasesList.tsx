import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ProductReleasePage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IProductVersionReleasesListProps {
  serviceContainerProductReleases: IServiceContainerState<ProductReleasePage>;
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
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: productReleaseEntityAttributes,
        defaultSorting: {
          attribute: productReleaseEntityAttributes.releaseDate.id,
          direction: 'desc',
        },
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: productReleaseEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductReleases} title={PageTitles.productReleases}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={25} sort={getSortParams(sortOptions.sortAttributes.version.id)}>
                  {productReleaseEntityAttributes.version.title}
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes.releaseDate.id)}>
                  {productReleaseEntityAttributes.releaseDate.title}
                  <TooltipWrapper tooltip={productReleaseEntityAttributes.releaseDate.tooltip} />
                </Th>
                <Th width={20}>{productReleaseEntityAttributes.productMilestone.title}</Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes.supportLevel.id)}>
                  {productReleaseEntityAttributes.supportLevel.title}
                </Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductReleases.data?.content?.map((productRelease, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <ProductMilestoneReleaseLabel productMilestoneRelease={productRelease} isCurrent={false} />
                  </Td>
                  <Td>{productRelease.releaseDate && <DateTime date={productRelease.releaseDate} displayTime={false} />}</Td>
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
                    <ProtectedComponent>
                      <Link to={`${productRelease.id}/edit`}>edit</Link>
                    </ProtectedComponent>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProductReleases.data?.totalHits} />
    </>
  );
};
