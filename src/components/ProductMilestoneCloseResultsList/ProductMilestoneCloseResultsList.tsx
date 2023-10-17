import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ProductMilestoneCloseResultPage } from 'pnc-api-types-ts';

import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { productMilestoneCloseResultEntityAttributes } from 'common/productMilestoneCloseResultEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { ProductMilestoneCloseStatusLabelMapper } from 'components/LabelMapper/ProductMilestoneCloseStatusLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

interface IProductMilestoneCloseResultsListProps {
  serviceContainerCloseResults: IServiceContainerState<ProductMilestoneCloseResultPage>;
  componentId: string;
}

/**
 * Component displaying list of Close Results.
 *
 * @param serviceContainerProducts - Service Container for CLose Results
 * @param componentId - Component ID
 */
export const ProductMilestoneCloseResultsList = ({
  serviceContainerCloseResults,
  componentId,
}: IProductMilestoneCloseResultsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: productMilestoneCloseResultEntityAttributes,
        defaultSorting: {
          attribute: productMilestoneCloseResultEntityAttributes.endDate.id,
          direction: 'desc',
        },
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: productMilestoneCloseResultEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerCloseResults} title="Close Results">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{productMilestoneCloseResultEntityAttributes.id.title}</Th>
                <Th width={30} sort={getSortParams(sortOptions.sortAttributes['startingDate'].id)}>
                  {productMilestoneCloseResultEntityAttributes.startingDate.title}
                </Th>
                <Th width={30} sort={getSortParams(sortOptions.sortAttributes['endDate'].id)}>
                  {productMilestoneCloseResultEntityAttributes.endDate.title}
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['status'].id)}>
                  {productMilestoneCloseResultEntityAttributes.status.title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerCloseResults.data?.content?.map((closeResult, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {/* TODO: Make link absolute once Product data are available */}
                    <Link to={closeResult.id}>{closeResult.id}</Link>
                  </Td>
                  <Td>
                    <DateTime date={closeResult.startingDate} />
                  </Td>
                  <Td>{closeResult.endDate && <DateTime date={closeResult.endDate} />}</Td>
                  <Td>
                    <ProductMilestoneCloseStatusLabelMapper status={closeResult.status} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerCloseResults.data?.totalHits} />
    </>
  );
};
