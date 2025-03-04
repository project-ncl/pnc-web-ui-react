import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { DeliverableAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverableAnalysisProgressStatusLabelMapper';
import { DeliverableAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverableAnalysisResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { Username } from 'components/Username/Username';

interface IDeliverableAnalysesListProps {
  serviceContainerDeliverableAnalyses: IServiceContainerState<DeliverableAnalyzerOperationPage>;
  componentId: string;
}

/**
 * Component displaying list of Deliverable Analysis operations.
 *
 * @param serviceContainerProjects - Service Container for Deliverable Analysis operations
 * @param componentId - Component ID
 */
export const DeliverableAnalysesList = ({ serviceContainerDeliverableAnalyses, componentId }: IDeliverableAnalysesListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: deliverableAnalysisOperationEntityAttributes,
        defaultSorting: {
          attribute: deliverableAnalysisOperationEntityAttributes.endTime.id,
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
            filterOptions={useMemo(
              () => getFilterOptions({ entityAttributes: deliverableAnalysisOperationEntityAttributes }),
              []
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerDeliverableAnalyses} title={PageTitles.deliverableAnalyses}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{deliverableAnalysisOperationEntityAttributes.id.title}</Th>
                <Th width={15}>{deliverableAnalysisOperationEntityAttributes.progressStatus.title}</Th>
                <Th width={15}>{deliverableAnalysisOperationEntityAttributes.result.title}</Th>
                <Th width={10} sort={getSortParams(sortOptions.sortAttributes['submitTime'].id)}>
                  {deliverableAnalysisOperationEntityAttributes.submitTime.title}
                </Th>
                <Th width={10} sort={getSortParams(sortOptions.sortAttributes['endTime'].id)}>
                  {deliverableAnalysisOperationEntityAttributes.endTime.title}
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                  {deliverableAnalysisOperationEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerDeliverableAnalyses.data?.content?.map((deliverableAnalysis, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to={`/deliverable-analyses/${deliverableAnalysis.id}`}>{deliverableAnalysis.id}</Link>
                  </Td>
                  <Td>
                    {deliverableAnalysis.progressStatus && (
                      <DeliverableAnalysisProgressStatusLabelMapper progressStatus={deliverableAnalysis.progressStatus} />
                    )}
                  </Td>
                  <Td>
                    {deliverableAnalysis.result && <DeliverableAnalysisResultLabelMapper result={deliverableAnalysis.result} />}
                  </Td>
                  <Td>{deliverableAnalysis.submitTime && <DateTime date={deliverableAnalysis.submitTime} />}</Td>
                  <Td>{deliverableAnalysis.endTime && <DateTime date={deliverableAnalysis.endTime} />}</Td>
                  <Td>{deliverableAnalysis.user?.username && <Username text={deliverableAnalysis.user.username} />}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerDeliverableAnalyses.data?.totalHits} />
    </>
  );
};
