import { Flex, FlexItem, FlexProps } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

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
        <ServiceContainerLoading {...serviceContainerProductVersions} title={`${PageTitles.productVersions}`}>
          <TableComposable variant="compact">
            <Thead>
              <Tr>
                <Th width={10}>Version</Th>
                <Th>Milestones</Th>
                <Th>Releases</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProductVersions.data?.content.map((version: ProductVersion, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{version.version}</Td>
                  <Td>
                    <Flex spaceItems={spaceItemsNone} style={flexGap}>
                      {Object.values(version.productMilestones || {}).map((milestoneRef: ProductMilestoneRef, index: number) => (
                        <FlexItem>
                          <ProductMilestoneReleaseLabel key={index} productMilestoneRelease={milestoneRef} isCurrent={false} />
                        </FlexItem>
                      ))}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex spaceItems={spaceItemsNone} style={flexGap}>
                      {Object.values(version.productReleases || {}).map((releaseRef: ProductReleaseRef, index: number) => (
                        <FlexItem>
                          <ProductMilestoneReleaseLabel key={index} productMilestoneRelease={releaseRef} isCurrent={false} />
                        </FlexItem>
                      ))}
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
