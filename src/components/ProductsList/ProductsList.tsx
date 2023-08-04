import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Product } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes, getSortOptions } from 'common/entityAttributes';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

interface IProductsListProps {
  serviceContainerProducts: IServiceContainer;
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
          <Filtering filterOptions={getFilterAttributes(productEntityAttributes)} componentId={componentId} />{' '}
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProducts} title={PageTitles.products}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={60} sort={getSortParams(sortOptions.sortAttributes['name'].id)}>
                  {productEntityAttributes.name.title}
                </Th>
                <Th sort={getSortParams(sortOptions.sortAttributes['abbreviation'].id)}>
                  {productEntityAttributes.abbreviation.title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProducts.data?.content.map((product: Product, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to={product.id}>{product.name}</Link>
                  </Td>
                  <Td>{product.abbreviation}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProducts.data?.totalHits} />
    </>
  );
};
