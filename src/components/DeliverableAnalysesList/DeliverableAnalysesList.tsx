import { Switch } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';
import { StorageKeys, useStorage } from 'hooks/useStorage';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { DeliverableAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverableAnalysisProgressStatusLabelMapper';
import { DeliverableAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverableAnalysisResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { TimesList } from 'components/TimesList/TimesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarGroup } from 'components/Toolbar/ToolbarGroup';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';
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

  const { getSortParams, getSortGroupParams } = useSorting(sortOptions, componentId);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  const { storageValue: isCompactMode, storeToStorage: storeIsCompactMode } = useStorage<boolean>({
    storageKey: StorageKeys.isBuildsListCompactMode,
    initialValue: true,
  });

  return (
    <>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Filtering
              filterOptions={useMemo(
                () => getFilterOptions({ entityAttributes: deliverableAnalysisOperationEntityAttributes }),
                []
              )}
              componentId={componentId}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <TooltipWrapper tooltip="Show Analyses in compact format, where certain details are hidden.">
              <Switch
                id={StorageKeys.isBuildsListCompactMode}
                label="Compact Mode"
                isChecked={isCompactMode}
                onChange={(_, checked) => {
                  storeIsCompactMode(checked);
                }}
              />
            </TooltipWrapper>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerDeliverableAnalyses} title={PageTitles.deliverableAnalyses}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{deliverableAnalysisOperationEntityAttributes.id.title}</Th>
                <Th width={15}>{deliverableAnalysisOperationEntityAttributes.progressStatus.title}</Th>
                <Th width={15}>{deliverableAnalysisOperationEntityAttributes.result.title}</Th>
                <Th width={25} className="overflow-visible">
                  <SortGroup
                    title="Times"
                    sort={getSortGroupParams(sortOptions.sortAttributes['submitTime'].id!)}
                    isDropdownOpen={isSortDropdownOpen}
                    onDropdownToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  />
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
                  <Td>
                    <TimesList
                      {...deliverableAnalysis}
                      entityAttributes={deliverableAnalysisOperationEntityAttributes}
                      isCompactMode={isCompactMode}
                    />
                  </Td>
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
