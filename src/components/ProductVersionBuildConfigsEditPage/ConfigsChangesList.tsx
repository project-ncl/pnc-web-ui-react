import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { CubesIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { StateCard } from 'components/StateCard/StateCard';

import { isBuildConfig } from 'utils/entityRecognition';

interface IConfigChange<T extends BuildConfiguration | GroupConfiguration> {
  data: T;
  operation: 'add' | 'remove';
}

export type TBuildConfigChange = IConfigChange<BuildConfiguration>;

export type TGroupConfigChange = IConfigChange<GroupConfiguration>;

interface IConfigsChangesListProps<T extends BuildConfiguration | GroupConfiguration> {
  variant: 'Build' | 'Group Build';
  configChanges: IConfigChange<T>[];
  onCancel: (config: T) => void;
}

/**
 * Component displaying list of Build/Group Configs to be added and/or removed.
 *
 * @param variant - Build or Group Build variant
 * @param configChanges - List of Build/Group Config add/remove operations
 * @param onCancel - Callback to cancel Build/Group Config add/remove operation with
 */
export const ConfigsChangesList = <T extends BuildConfiguration | GroupConfiguration>({
  variant,
  configChanges,
  onCancel,
}: IConfigsChangesListProps<T>) => {
  return (
    <>
      {configChanges.length ? (
        <ContentBox borderTop>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th />
                <Th width={60}>{buildConfigEntityAttributes.name.title}</Th>
                {variant === 'Build' && <Th width={40}>{buildConfigEntityAttributes['project.name'].title}</Th>}
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {configChanges.map((configChange: IConfigChange<T>, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    {configChange.operation === 'add' ? (
                      <PlusCircleIcon title="Marked to be added." color="green" />
                    ) : (
                      <MinusCircleIcon title="Marked to be removed." color="red" />
                    )}
                  </Td>
                  <Td>
                    <BuildConfigLink id={configChange.data.id}>{configChange.data.name}</BuildConfigLink>
                  </Td>
                  {isBuildConfig(configChange.data) && (
                    <Td>
                      {configChange.data.project && (
                        <ProjectLink id={configChange.data.project.id}>{configChange.data.project.name}</ProjectLink>
                      )}
                    </Td>
                  )}
                  <Td isActionCell>
                    <Button
                      variant="plain"
                      icon={<TimesCircleIcon />}
                      onClick={() => {
                        onCancel(configChange.data);
                      }}
                      isSmall
                      isInline
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ContentBox>
      ) : (
        <ContentBox borderTop>
          <StateCard icon={CubesIcon} title="No changes yet" />
        </ContentBox>
      )}
    </>
  );
};
