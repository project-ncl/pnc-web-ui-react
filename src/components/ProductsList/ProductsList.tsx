import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router';

import { ProductPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipLabel } from 'components/TooltipLabel/TooltipLabel';

interface IProductsListProps {
  serviceContainerProducts: IServiceContainerState<ProductPage>;
  componentId: string;
}

/**
 * Component displaying list of Products.
 *
 * @param serviceContainerProducts - Service Container for Products
 * @param componentId - Component ID
 */
export const ProductsList = ({ serviceContainerProducts, componentId }: IProductsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: productEntityAttributes,
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: productEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox>
        <ServiceContainerLoading {...serviceContainerProducts} title={PageTitles.products}>
          <Table isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={30} sort={getSortParams(sortOptions.sortAttributes['name'].id)}>
                  {productEntityAttributes.name.title}
                </Th>
                <Th sort={getSortParams(sortOptions.sortAttributes['abbreviation'].id)}>
                  {productEntityAttributes.abbreviation.title}
                </Th>
                <Th>{productEntityAttributes.description.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProducts.data?.content?.map((product, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to={product.id}>{product.name}</Link>
                    <TooltipLabel tooltip="Product Versions count">
                      {Object.keys(product.productVersions || []).length}
                    </TooltipLabel>
                  </Td>
                  <Td>{product.abbreviation}</Td>
                  <Td>{product.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProducts.data?.totalHits} />
    </>
  );
};
