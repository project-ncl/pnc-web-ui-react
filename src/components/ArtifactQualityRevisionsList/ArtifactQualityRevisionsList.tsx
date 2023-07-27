import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ArtifactRevision } from 'pnc-api-types-ts';

import { artifactQualityRevisionEntityAttributes } from 'common/artifactQualityRevisionEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { ArtifactQualityLabelMapper } from 'components/LabelMapper/ArtifactQualityLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { createDateTime } from 'utils/utils';

const sortAttributes: ISortAttributes = {
  modificationTime: {
    id: 'modificationTime',
    title: 'Modification Date',
    tableColumnIndex: 0,
  },
};

interface IArtifactQualityRevisionsListProps {
  serviceContainerQualityRevisions: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Artifact Quality Revisions.
 *
 * @param serviceContainerQualityRevisions - Service Container for Artifact Quality Revisions
 * @param componentId - Component ID
 */
export const ArtifactQualityRevisionsList = ({
  serviceContainerQualityRevisions,
  componentId,
}: IArtifactQualityRevisionsListProps) => {
  const { getSortParams } = useSorting(sortAttributes, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(artifactQualityRevisionEntityAttributes)} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerQualityRevisions} title={PageTitles.artifactQualityRevisions}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th sort={getSortParams(sortAttributes['modificationTime'].id)} width={20}>
                  {artifactQualityRevisionEntityAttributes.modificationTime.title}
                </Th>
                <Th width={20}>{artifactQualityRevisionEntityAttributes['modificationUser.username'].title}</Th>
                <Th width={20}>{artifactQualityRevisionEntityAttributes.artifactQuality.title}</Th>
                <Th width={40}>{artifactQualityRevisionEntityAttributes.qualityLevelReason.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerQualityRevisions.data?.content.map((artifactRevision: ArtifactRevision, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    {artifactRevision.modificationTime && createDateTime({ date: artifactRevision.modificationTime }).custom}
                  </Td>
                  <Td>{artifactRevision.modificationUser?.username}</Td>
                  <Td>
                    {artifactRevision.artifactQuality && (
                      <ArtifactQualityLabelMapper quality={artifactRevision.artifactQuality} />
                    )}
                  </Td>
                  <Td>{artifactRevision.qualityLevelReason}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerQualityRevisions.data?.totalHits} />
    </>
  );
};
