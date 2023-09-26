import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { CubesIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { IBuildConfigChange } from 'components/ProductVersionBuildConfigsEditPage/ProductVersionBuildConfigsEditPage';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { StateCard } from 'components/StateCard/StateCard';

interface IBuildConfigsChangesListProps {
  buildConfigChanges: IBuildConfigChange[];
  onCancel: (buildConfig: BuildConfiguration) => void;
}

/**
 * Component displaying list of Build Configs to be added and/or removed.
 *
 * @param buildConfigChanges - List of Build Config add/remove operations
 * @param onCancel - Callback to cancel Build Config add/remove operation with
 */
export const BuildConfigsChangesList = ({ buildConfigChanges, onCancel }: IBuildConfigsChangesListProps) => {
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
              {buildConfigChanges.map((buildConfigChange: any, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    {buildConfigChange.operation === 'add' ? (
                      <PlusCircleIcon title="Marked to be added." color="green" />
                    ) : (
                      <MinusCircleIcon title="Marked to be removed." color="red" />
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
          <StateCard icon={CubesIcon} title="No changes yet" />
        </ContentBox>
      )}
    </>
  );
};
