import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { MilestoneInfoPage } from 'pnc-api-types-ts';

import { artifactProductMilestoneReleaseEntityAttributes } from 'common/artifactProductMilestoneReleaseEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
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
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: artifactProductMilestoneReleaseEntityAttributes,
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () => getFilterOptions({ entityAttributes: artifactProductMilestoneReleaseEntityAttributes }),
              []
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerArtifactProductMilestonesReleases} title={PageTitles.productMilestones}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{artifactProductMilestoneReleaseEntityAttributes.productName.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.productVersionVersion.title}</Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.milestoneVersion.title}</Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.milestoneEndDate.id)}>
                  {artifactProductMilestoneReleaseEntityAttributes.milestoneEndDate.title}
                </Th>
                <Th width={15}>{artifactProductMilestoneReleaseEntityAttributes.releaseVersion.title}</Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes.releaseReleaseDate.id)}>
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
