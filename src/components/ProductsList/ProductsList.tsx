import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { Product } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const filterOptions: IFilterOptions = {
  filterAttributes: {
    name: {
      id: 'name',
      title: 'Name',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    abbreviation: {
      id: 'abbreviation',
      title: 'Abbreviation',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
  },
};

const sortOptions: ISortOptions = {
  name: {
    id: 'name',
    title: 'Name',
    tableColumnIndex: 0,
  },
  abbreviation: {
    id: 'abbreviation',
    title: 'Abbreviation',
    tableColumnIndex: 1,
  },
};

interface IProductsListPage {
  serviceContainerProducts: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Products.
 *
 * @param serviceContainerProducts - Service Container for Products
 * @param componentId - Component ID
 */
export const ProductsList = ({ serviceContainerProducts, componentId }: IProductsListPage) => {
  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton action={() => console.log('Not implemented yet!')}>Create Product</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProducts} title={`${PageTitles.products}`}>
          <TableComposable variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={60} sort={getSortParams(sortOptions['name'].id)}>
                  Name
                </Th>
                <Th sort={getSortParams(sortOptions['abbreviation'].id)}>Abbreviation</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProducts.data?.content.map((product: Product, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{product.name}</Td>
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
