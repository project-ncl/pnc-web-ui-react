import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router';

import { BuildPushResult, BuildPushResultRef } from 'pnc-api-types-ts';

import { buildPushResultEntityAttributes } from 'common/buildPushResultEntityAttributes';

import { BuildPushStatusLabelMapper } from 'components/BuildPushStatusLabelMapper/BuildPushStatusLabelMapper';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

interface IPushedBuildsListProps {
  pushedBuilds?: (BuildPushResult | BuildPushResultRef)[];
}

/**
 * Component displaying list of Builds pushed to Brew.
 *
 * Component does not accept service container because list of pushed Builds is only available as an array property
 * (there is no paginated endpoint for it).
 *
 * @param pushedBuilds - Builds pushed to Brew
 */
export const PushedBuildsList = ({ pushedBuilds }: IPushedBuildsListProps) => (
  <>
    {!!pushedBuilds?.length ? (
      <ContentBox>
        <Table isStriped variant="compact">
          <Thead>
            <Tr>
              <Th width={15}>{buildPushResultEntityAttributes.status.title}</Th>
              <Th width={15}>{buildPushResultEntityAttributes.buildId.title}</Th>
              <Th width={15}>{buildPushResultEntityAttributes.brewBuildId.title}</Th>
              <Th width={40}>{buildPushResultEntityAttributes.brewBuildUrl.title}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pushedBuilds.map((pushedBuild, rowIndex) => (
              <Tr key={rowIndex}>
                <Td>
                  <BuildPushStatusLabelMapper status={pushedBuild.status} />
                </Td>
                <Td>
                  <Link to={`/builds/${pushedBuild.buildId}`}>{`#${pushedBuild.buildId}`}</Link>
                </Td>
                <Td>{pushedBuild.brewBuildId}</Td>
                <Td>
                  {pushedBuild.brewBuildUrl && (
                    <a target="_blank" rel="noreferrer" href={pushedBuild.brewBuildUrl}>
                      {pushedBuild.brewBuildUrl}
                    </a>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ContentBox>
    ) : (
      <ContentBox padding>
        <EmptyStateCard title="Pushed Builds" />
      </ContentBox>
    )}
  </>
);
