import { Flex, FlexItem, FlexProps } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ProductMilestoneRef, ProductReleaseRef, ProductVersionPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions } from 'common/entityAttributes';
import { productVersionEntityAttributes } from 'common/productVersionEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };
const flexGap = { gap: '5px' };

interface IProductVersionsListProps {
  serviceContainerProductVersions: IServiceContainerState<ProductVersionPage>;
  componentId: string;
}

/**
 * Component displaying list of Product Versions.
 *
 * @param serviceContainerProductVersions - Service Container for Product Versions
 * @param componentId - Component ID
 */
export const ProductVersionsList = ({ serviceContainerProductVersions, componentId }: IProductVersionsListProps) => {
  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: productVersionEntityAttributes }), [])}
            componentId={componentId}
          />{' '}
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductVersions} title={PageTitles.productVersions}>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th width={10}>{productVersionEntityAttributes.version.title}</Th>
                <Th>{productVersionEntityAttributes.productMilestones.title}</Th>
                <Th>{productVersionEntityAttributes.productReleases.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductVersions.data?.content?.map((productVersion, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to={`versions/${productVersion.id}`}>{productVersion.version}</Link>
                  </Td>
                  <Td>
                    <Flex spaceItems={spaceItemsNone} style={flexGap}>
                      {Object.values(productVersion.productMilestones || {}).map(
                        (productMilestoneRef: ProductMilestoneRef, index: number) => (
                          <FlexItem key={index}>
                            <ProductMilestoneReleaseLabel
                              link={`versions/${productVersion.id}/milestones/${productMilestoneRef.id}`}
                              productMilestoneRelease={productMilestoneRef}
                              isCurrent={productMilestoneRef.id === productVersion.currentProductMilestone?.id}
                            />
                          </FlexItem>
                        )
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex spaceItems={spaceItemsNone} style={flexGap}>
                      {Object.values(productVersion.productReleases || {}).map(
                        (productReleaseRef: ProductReleaseRef, index: number) => (
                          <FlexItem key={index}>
                            <ProductMilestoneReleaseLabel productMilestoneRelease={productReleaseRef} isCurrent={false} />
                          </FlexItem>
                        )
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProductVersions.data?.totalHits} />
    </>
  );
};
