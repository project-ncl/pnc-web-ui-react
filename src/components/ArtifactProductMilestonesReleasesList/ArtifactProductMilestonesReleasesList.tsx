import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { MilestoneInfo } from 'pnc-api-types-ts';

import { artifactProductMilestoneReleaseEntityAttributes } from 'common/artifactProductMilestoneReleaseEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterAttributes, getSortOptions } from 'common/entityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { createDateTime } from 'utils/utils';

interface IArtifactProductMilestonesReleasesListProps {
  serviceContainerArtifactProductMilestonesReleases: IServiceContainer;
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
            filterOptions={getFilterAttributes(artifactProductMilestoneReleaseEntityAttributes)}
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
              {serviceContainerArtifactProductMilestonesReleases.data?.content.map(
                (artifactProductMilestoneRelease: MilestoneInfo, rowIndex: number) => (
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
                      {artifactProductMilestoneRelease.milestoneEndDate &&
                        createDateTime({ date: artifactProductMilestoneRelease.milestoneEndDate }).custom}
                    </Td>
                    <Td>{artifactProductMilestoneRelease.releaseVersion}</Td>
                    <Td>
                      {artifactProductMilestoneRelease.releaseReleaseDate &&
                        createDateTime({ date: artifactProductMilestoneRelease.releaseReleaseDate }).custom}
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
