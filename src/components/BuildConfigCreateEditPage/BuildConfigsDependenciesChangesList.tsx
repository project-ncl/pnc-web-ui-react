import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { CubesIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { IOperation } from 'hooks/usePatchOperation';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { StateCard } from 'components/StateCard/StateCard';

interface IBuildConfigsDependenciesChangesListProps {
  buildConfigChanges: IOperation<BuildConfiguration>[];
  onCancel: (buildConfig: BuildConfiguration) => void;
}

/**
 * Component displaying list of Build/Group Configs to be added and/or removed.
 *
 * @param variant - Build or Group Build variant
 * @param configChanges - List of Build/Group Config add/remove operations
 * @param onCancel - Callback to cancel Build/Group Config add/remove operation with
 */
export const BuildConfigsDependenciesChangesList = ({
  buildConfigChanges,
  onCancel,
}: IBuildConfigsDependenciesChangesListProps) => {
  return (
    <>
      {buildConfigChanges.length ? (
        <ContentBox borderTop>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th />
                <Th width={60}>{buildConfigEntityAttributes.name.title}</Th>
                <Th width={40}>{buildConfigEntityAttributes['project.name'].title}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {buildConfigChanges.map((buildConfigChange, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {buildConfigChange.operator === 'add' ? (
                      <PlusCircleIcon title="Marked to be added as dependency." color="green" />
                    ) : (
                      <MinusCircleIcon title="Marked to be removed from dependencies." color="red" />
                    )}
                  </Td>
                  <Td>
                    <BuildConfigLink id={buildConfigChange.data.id}>{buildConfigChange.data.name}</BuildConfigLink>
                  </Td>
                  <Td>
                    {buildConfigChange.data.project && (
                      <ProjectLink id={buildConfigChange.data.project.id}>{buildConfigChange.data.project.name}</ProjectLink>
                    )}
                  </Td>
                  <Td isActionCell>
                    <Button
                      variant="plain"
                      icon={<TimesCircleIcon />}
                      onClick={() => {
                        onCancel(buildConfigChange.data);
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
          <StateCard icon={CubesIcon} title="No added dependencies yet" />
        </ContentBox>
      )}
    </>
  );
};
