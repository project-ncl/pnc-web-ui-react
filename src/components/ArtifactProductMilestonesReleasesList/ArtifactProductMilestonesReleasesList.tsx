import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { MilestoneInfoPage } from 'pnc-api-types-ts';

import { artifactProductMilestoneReleaseEntityAttributes } from 'common/artifactProductMilestoneReleaseEntityAttributes';
import { PageTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IArtifactProductMilestonesReleasesListProps {
  serviceContainerArtifactProductMilestonesReleases: IServiceContainerState<MilestoneInfoPage>;
  componentId: string;
}

/**
 * Component displaying list of Product Milestones that produced or consumed an Artifact.
 *
 * @param serviceContainerArtifactProductMilestonesReleases - Service Container for Product Milestone info
 * @param componentId - Component ID
 */
export const ArtifactProductMilestonesReleasesList = ({
  serviceContainerArtifactProductMilestonesReleases,
  componentId,
}: IArtifactProductMilestonesReleasesListProps) => {
  return (
    <>
      <ContentBox>
        <ServiceContainerLoading {...serviceContainerArtifactProductMilestonesReleases} title={PageTitles.productMilestones}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{artifactProductMilestoneReleaseEntityAttributes.productName.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.productVersionVersion.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.milestoneVersion.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.milestoneEndDate.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.releaseVersion.title}</Th>
                <Th width={15}>
                  {artifactProductMilestoneReleaseEntityAttributes.releaseReleaseDate.title}
                  <TooltipWrapper tooltip={artifactProductMilestoneReleaseEntityAttributes.releaseReleaseDate.tooltip} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerArtifactProductMilestonesReleases.data?.content?.map(
                (artifactProductMilestoneRelease, rowIndex) => (
                  <Tr key={rowIndex}>
                    <Td>
                      {artifactProductMilestoneRelease.productId && (
                        <Link to={`/products/${artifactProductMilestoneRelease.productId}`}>
                          {artifactProductMilestoneRelease.productName}
                        </Link>
                      )}
                    </Td>
                    <Td>
                      {artifactProductMilestoneRelease.productVersionId && (
                        <Link
                          to={`/products/${artifactProductMilestoneRelease.productId}/versions/${artifactProductMilestoneRelease.productVersionId}`}
                        >
                          {artifactProductMilestoneRelease.productVersionVersion}
                        </Link>
                      )}
                    </Td>
                    <Td>
                      {artifactProductMilestoneRelease.milestoneId && (
                        <Link
                          to={`/products/${artifactProductMilestoneRelease.productId}/versions/${artifactProductMilestoneRelease.productVersionId}/milestones/${artifactProductMilestoneRelease.milestoneId}`}
                        >
                          {artifactProductMilestoneRelease.milestoneVersion}
                        </Link>
                      )}
                    </Td>
                    <Td>
                      {artifactProductMilestoneRelease.milestoneEndDate && (
                        <DateTime date={artifactProductMilestoneRelease.milestoneEndDate} />
                      )}
                    </Td>
                    <Td>{artifactProductMilestoneRelease.releaseVersion}</Td>
                    <Td>
                      {artifactProductMilestoneRelease.releaseReleaseDate && (
                        <DateTime date={artifactProductMilestoneRelease.releaseReleaseDate} />
                      )}
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerArtifactProductMilestonesReleases.data?.totalHits} />
    </>
  );
};
