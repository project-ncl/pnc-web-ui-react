import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterAttributes } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneCloseStatusLabel } from 'components/ProductMilestoneCloseStatusLabel/ProductMilestoneCloseStatusLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const filterAttributes: IFilterAttributes = {
  filterAttributes: {
    status: {
      id: 'status',
      title: 'Status',
      filterValues: ['IN_PROGRESS', 'FAILED', 'SUCCEEDED', 'CANCELED', 'SYSTEM_ERROR'],
      operator: '==',
    },
  },
};

const sortOptions: ISortOptions = {
  startingDate: {
    id: 'startingDate',
    title: 'Start Date',
    tableColumnIndex: 1,
  },
  endDate: {
    id: 'endDate',
    title: 'End Date',
    tableColumnIndex: 2,
    isDefault: true,
    defaultSortOrder: 'desc',
  },
  status: {
    id: 'status',
    title: 'Status',
    tableColumnIndex: 3,
  },
};

interface IProductMilestoneCloseResultsListProps {
  serviceContainerCloseResults: IServiceContainer;
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
  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterAttributes={filterAttributes} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerCloseResults} title="Close Results">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>ID</Th>
                <Th width={30} sort={getSortParams(sortOptions['startingDate'].id)}>
                  Start Date
                </Th>
                <Th width={30} sort={getSortParams(sortOptions['endDate'].id)}>
                  End Date
                </Th>
                <Th width={20} sort={getSortParams(sortOptions['status'].id)}>
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerCloseResults.data?.content.map((closeResult: ProductMilestoneCloseResult, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to="">{closeResult.id}</Link>
                  </Td>
                  <Td>{createDateTime({ date: closeResult.startingDate }).custom}</Td>
                  <Td>{closeResult.endDate && createDateTime({ date: closeResult.endDate }).custom}</Td>
                  <Td>
                    <ProductMilestoneCloseStatusLabel status={closeResult.status} />
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
