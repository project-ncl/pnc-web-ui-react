import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { GroupConfiguration } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';
import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { GroupConfigLink } from 'components/GroupConfigLink/GroupConfigLink';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const sortAttributes: ISortAttributes = {
  name: {
    id: 'name',
    title: 'Name',
    tableColumnIndex: 0,
  },
};

interface IGroupConfigsList {
  serviceContainerGroupConfigs: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Group Configs.
 *
 * @param serviceContainerGroupConfigs - Service Container for Group Configs
 * @param componentId - Component ID
 */
export const GroupConfigsList = ({ serviceContainerGroupConfigs, componentId }: IGroupConfigsList) => {
  const { getSortParams } = useSorting(sortAttributes, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(groupConfigEntityAttributes)} componentId={componentId} />{' '}
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
                <Th width={30} sort={getSortParams(sortAttributes['name'].id)}>
                  {groupConfigEntityAttributes.name.title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerGroupConfigs.data?.content.map((groupConfig: GroupConfiguration, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{<GroupConfigLink id={groupConfig.id}>{groupConfig.name}</GroupConfigLink>}</Td>
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
