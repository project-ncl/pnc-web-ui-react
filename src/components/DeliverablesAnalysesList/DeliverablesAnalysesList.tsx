import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import { deliverablesAnalysisEntityAttributes } from 'common/deliverablesAnalysisEntityAttributes';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { Username } from 'components/Username/Username';

interface IDeliverablesAnalysesListProps {
  serviceContainerDeliverablesAnalyses: IServiceContainerState<DeliverableAnalyzerOperationPage>;
  componentId: string;
}

/**
 * Component displaying list of Deliverables Analyses.
 *
 * @param serviceContainerDeliverablesAnalyses - Service Container for Deliverables Analyses
 * @param componentId - Component ID
 */
export const DeliverablesAnalysesList = ({
  serviceContainerDeliverablesAnalyses,
  componentId,
}: IDeliverablesAnalysesListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: deliverablesAnalysisEntityAttributes,
        defaultSorting: {
          attribute: deliverablesAnalysisEntityAttributes.submitTime.id,
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
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: deliverablesAnalysisEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerDeliverablesAnalyses} title="Deliverables Analyses">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{deliverablesAnalysisEntityAttributes.id.title}</Th>
                <Th width={20}>{deliverablesAnalysisEntityAttributes.progressStatus.title}</Th>
                <Th width={20}>{deliverablesAnalysisEntityAttributes.result.title}</Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['submitTime'].id)}>
                  {deliverablesAnalysisEntityAttributes.submitTime.title}
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                  {deliverablesAnalysisEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerDeliverablesAnalyses.data?.content?.map((operation, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {/* TODO: Make link absolute once Product data are available */}
                    <Link to={operation.id}>{operation.id}</Link>
                  </Td>
                  <Td>
                    {operation.progressStatus && (
                      <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={operation.progressStatus} />
                    )}
                  </Td>
                  <Td>{operation.result && <DeliverablesAnalysisResultLabelMapper result={operation.result} />}</Td>
                  <Td>{operation.submitTime && <DateTime date={operation.submitTime} />}</Td>
                  <Td>{operation.user?.username && <Username text={operation.user.username} />}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerDeliverablesAnalyses.data?.totalHits} />
    </>
  );
};
