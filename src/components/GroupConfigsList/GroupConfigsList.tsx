import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { GroupConfigPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { GroupConfigLink } from 'components/GroupConfigLink/GroupConfigLink';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

interface IGroupConfigsListProps {
  serviceContainerGroupConfigs: IServiceContainerState<GroupConfigPage>;
  componentId: string;
}

/**
 * Component displaying list of Group Configs.
 *
 * @param serviceContainerGroupConfigs - Service Container for Group Configs
 * @param componentId - Component ID
 */
export const GroupConfigsList = ({ serviceContainerGroupConfigs, componentId }: IGroupConfigsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: groupConfigEntityAttributes,
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: groupConfigEntityAttributes }), [])}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerGroupConfigs} title={PageTitles.groupConfigs}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th sort={getSortParams(sortOptions.sortAttributes['name'].id)}>{groupConfigEntityAttributes.name.title}</Th>
                <Th width={20}>{groupConfigEntityAttributes.buildConfigsCount.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerGroupConfigs.data?.content?.map((groupConfig, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>{<GroupConfigLink id={groupConfig.id}>{groupConfig.name}</GroupConfigLink>}</Td>
                  <Td>{Object.keys(groupConfig.buildConfigs || []).length}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerGroupConfigs.data?.totalHits} />
    </>
  );
};
