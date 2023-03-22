import { Flex, FlexItem, FlexProps } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { ProductMilestoneRef, ProductReleaseRef, ProductVersion } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const filterOptions: IFilterOptions = {
  filterAttributes: {
    version: {
      id: 'version',
      title: 'Version',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
  },
};

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };
const flexGap = { gap: '5px' };

interface IProductVersionsListProps {
  serviceContainerProductVersions: IServiceContainer;
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
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProductVersions} title={PageTitles.productVersions}>
          <TableComposable variant="compact">
            <Thead>
              <Tr>
                <Th width={10}>Version</Th>
                <Th>Milestones</Th>
                <Th>Releases</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductVersions.data?.content.map((productVersion: ProductVersion, rowIndex: number) => (
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
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProductVersions.data?.totalHits} />
    </>
  );
};
