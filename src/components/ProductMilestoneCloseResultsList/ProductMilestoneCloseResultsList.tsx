import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneCloseStatusLabel } from 'components/ProductMilestoneCloseStatusLabel/ProductMilestoneCloseStatusLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const filterOptions: IFilterOptions = {
  filterAttributes: {
    status: {
      id: 'status',
      title: 'Status',
      filterValues: ['IN_PROGRESS', 'FAILED', 'SUCCEEDED', 'CANCELED', 'SYSTEM_ERROR'],
      operator: '==',
    },
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
  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerCloseResults} title="Close Results">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={60}>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerCloseResults.data?.content.map((closeResult: ProductMilestoneCloseResult, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to="">{createDateTime({ date: closeResult.endDate || closeResult.startingDate })}</Link>
                  </Td>
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
