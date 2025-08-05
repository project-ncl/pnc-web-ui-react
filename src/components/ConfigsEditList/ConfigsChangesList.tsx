import { Icon } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { IOperation } from 'hooks/usePatchOperation';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { RemoveItemButton } from 'components/RemoveItemButton/RemoveItemButton';
import { StateCard } from 'components/StateCard/StateCard';

import { isBuildConfig } from 'utils/entityRecognition';

interface IConfigsChangesListProps<T extends BuildConfiguration | GroupConfiguration> {
  variant: 'Build' | 'Group Build';
  configChanges: IOperation<T>[];
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
        <ContentBox>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th aria-label="Added or removed icon" />
                <Th width={60}>{buildConfigEntityAttributes.name.title}</Th>
                {variant === 'Build' && <Th width={40}>{buildConfigEntityAttributes['project.name'].title}</Th>}
                <Th aria-label="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {configChanges.map((configChange, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {configChange.operator === 'add' ? (
                      <Icon status="success">
                        <PlusCircleIcon title="Marked to be added." />
                      </Icon>
                    ) : (
                      <Icon status="danger">
                        <MinusCircleIcon title="Marked to be removed." />
                      </Icon>
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
                    <RemoveItemButton
                      onRemove={() => {
                        onCancel(configChange.data);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ContentBox>
      ) : (
        <ContentBox>
          <StateCard icon={CubesIcon} title="No changes yet" />
        </ContentBox>
      )}
    </>
  );
};
