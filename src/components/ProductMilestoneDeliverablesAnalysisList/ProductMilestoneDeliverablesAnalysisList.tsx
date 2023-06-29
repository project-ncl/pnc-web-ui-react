import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { getFilterAttributes } from 'common/entityAttributes';
import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

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
          <Filtering
            filterOptions={getFilterAttributes(productMilestoneDeliverablesAnalysisEntityAttributes)}
            componentId={componentId}
          />
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
                        <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={operation.progressStatus} />
                      )}
                    </Td>
                    <Td>{operation.result && <DeliverablesAnalysisResultLabelMapper result={operation.result} />}</Td>
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
