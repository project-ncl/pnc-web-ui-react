import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DeliverablesAnalysisProgressStatusLabel } from 'components/DeliverablesAnalysisProgressStatusLabel/DeliverablesAnalysisProgressStatusLabel';
import { DeliverablesAnalysisResultLabel } from 'components/DeliverablesAnalysisResultLabel/DeliverablesAnalysisResultLabel';
import { Filtering, IFilterAttributes } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const filterAttributes: IFilterAttributes = {
  filterAttributes: {
    progressStatus: {
      id: 'progressStatus',
      title: 'Progress Status',
      filterValues: ['NEW', 'PENDING', 'IN_PROGRESS', 'FINISHED'],
      operator: '==',
    },
    result: {
      id: 'result',
      title: 'Result',
      filterValues: ['SUCCESSFUL', 'FAILED', 'REJECTED', 'CANCELLED', 'TIMEOUT', 'SYSTEM_ERROR'],
      operator: '==',
    },
    'user.username': {
      id: 'user.username',
      title: 'User',
      operator: '=like=',
    },
  },
};

const sortAttributes: ISortAttributes = {
  submitTime: {
    id: 'submitTime',
    title: 'Submit Time',
    tableColumnIndex: 3,
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    tableColumnIndex: 4,
  },
};

const defaultSorting: IDefaultSorting = {
  attribute: sortAttributes.submitTime.id,
  direction: 'desc',
};

interface IProductMilestoneDeliverablesAnalysisListProps {
  serviceContainerDeliverablesAnalysis: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Deliverables Analysis.
 *
 * @param serviceContainerDeliverablesAnalysis - Service Container for Deliverables Analysis
 * @param componentId - Component ID
 */
export const ProductMilestoneDeliverablesAnalysisList = ({
  serviceContainerDeliverablesAnalysis,
  componentId,
}: IProductMilestoneDeliverablesAnalysisListProps) => {
  const { getSortParams } = useSorting(sortAttributes, componentId, defaultSorting);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterAttributes={filterAttributes} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerDeliverablesAnalysis} title="Deliverables Analysis">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>Id</Th>
                <Th width={20}>Progress Status</Th>
                <Th width={20}>Result</Th>
                <Th width={20} sort={getSortParams(sortAttributes['submitTime'].id)}>
                  Submit Time
                </Th>
                <Th width={20} sort={getSortParams(sortAttributes['user.username'].id)}>
                  User
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerDeliverablesAnalysis.data?.content.map(
                (operation: DeliverableAnalyzerOperation, rowIndex: number) => (
                  <Tr key={rowIndex}>
                    <Td>
                      <Link to="">{operation.id}</Link>
                    </Td>
                    <Td>
                      {operation.progressStatus && (
                        <DeliverablesAnalysisProgressStatusLabel progressStatus={operation.progressStatus} />
                      )}
                    </Td>
                    <Td>{operation.result && <DeliverablesAnalysisResultLabel result={operation.result} />}</Td>
                    <Td>{operation.submitTime && createDateTime({ date: operation.submitTime }).custom}</Td>
                    <Td>{operation.user?.username}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerDeliverablesAnalysis.data?.totalHits} />
    </>
  );
};
