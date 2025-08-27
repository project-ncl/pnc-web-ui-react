import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  FlexProps,
  Label,
  Switch,
} from '@patternfly/react-core';
import { BuildIcon } from '@patternfly/react-icons';
import { ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { Artifact, ArtifactPage } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';
import { StorageKeys, useStorage } from 'hooks/useStorage';

import { ArtifactBuild } from 'components/ArtifactBuild/ArtifactBuild';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DownloadLink } from 'components/DownloadLink/DownloadLink';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { Filtering, TFilterAttribute } from 'components/Filtering/Filtering';
import { ArtifactQualityLabelMapper } from 'components/LabelMapper/ArtifactQualityLabelMapper';
import { ArtifactRepositoryTypeLabelMapper } from 'components/LabelMapper/ArtifactRepositoryTypeLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ParsedArtifactIdentifier } from 'components/ParsedArtifactIdentifier/ParsedArtifactIdentifier';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarGroup } from 'components/Toolbar/ToolbarGroup';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isArtifactWithProductMilestone } from 'utils/entityRecognition';

const spaceItemsLg: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IArtifactsListProps {
  serviceContainerArtifacts: IServiceContainerState<ArtifactPage>;
  columns?: string[];
  componentId: string;
  customFiltering?: ReactNode;
}

const defaultColumns = [
  artifactEntityAttributes.id.id,
  artifactEntityAttributes.identifier.id,
  artifactEntityAttributes['targetRepository.repositoryType'].id,
  artifactEntityAttributes.buildCategory.id,
  artifactEntityAttributes.filename.id,
  artifactEntityAttributes.artifactQuality.id,
  artifactEntityAttributes.md5.id,
  artifactEntityAttributes.sha1.id,
  artifactEntityAttributes.sha256.id,
  artifactEntityAttributes.build.id,
];

/**
 * Component displaying list of Artifacts.
 *
 * @param serviceContainerArtifacts - Service Container for Artifacts
 * @param componentId - Component ID
 */
export const ArtifactsList = ({
  serviceContainerArtifacts,
  columns = defaultColumns,
  componentId,
  customFiltering,
}: IArtifactsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: artifactEntityAttributes,
        defaultSorting: {
          attribute: artifactEntityAttributes.identifier.id,
          direction: 'asc',
        },
        customColumns: columns,
      }),
    [columns]
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  const { storageValue: isArtifactIdentifierParsed, storeToStorage: storeIsArtifactIdentifierParsed } = useStorage<boolean>({
    storageKey: StorageKeys.isArtifactIdentifierParsed,
    initialValue: false,
  });

  const [expandedArtifacts, setExpandedArtifacts] = useState<string[]>([]);
  const [areBuildArtifactsExpanded, setAreBuildArtifactsExpanded] = useState<boolean>(false);
  const [areAllArtifactsExpanded, setAreAllArtifactsExpanded] = useState<boolean | undefined>(undefined);
  const setArtifactExpanded = (artifact: Artifact, isExpanding = true) =>
    setExpandedArtifacts((prevExpanded) => {
      const otherExpandedArtifactIdentifiers = prevExpanded.filter((r) => r !== artifact.identifier);
      return isExpanding ? [...otherExpandedArtifactIdentifiers, artifact.identifier] : otherExpandedArtifactIdentifiers;
    });
  const isArtifactExpanded = (artifact: Artifact) => expandedArtifacts.includes(artifact.identifier);

  useEffect(() => {
    if (areBuildArtifactsExpanded) {
      setExpandedArtifacts(
        serviceContainerArtifacts.data?.content
          ?.filter((artifact: Artifact) => artifact.build)
          .map((artifact: Artifact) => artifact.identifier) || []
      );
    }
  }, [areBuildArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  useEffect(() => {
    if (areAllArtifactsExpanded === true) {
      setExpandedArtifacts(serviceContainerArtifacts.data?.content?.map((artifact: Artifact) => artifact.identifier) || []);
    } else if (areAllArtifactsExpanded === false) {
      setExpandedArtifacts([]);
    }
  }, [areAllArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  return (
    <>
      <Toolbar column>
        {customFiltering && (
          <ToolbarGroup>
            <ToolbarItem>{customFiltering}</ToolbarItem>
          </ToolbarGroup>
        )}
        <ToolbarGroup>
          <ToolbarItem>
            <Filtering
              filterOptions={useMemo(
                () =>
                  getFilterOptions({
                    entityAttributes: artifactEntityAttributes,
                    defaultFiltering: { attribute: artifactEntityAttributes.identifier.id },
                    customColumns: columns,
                  }),
                [columns]
              )}
              componentId={componentId}
              onFilter={(filterAttribute: TFilterAttribute, _) => {
                if (
                  [artifactEntityAttributes.md5.id, artifactEntityAttributes.sha1.id, artifactEntityAttributes.sha256.id].some(
                    (hash) => hash === filterAttribute.id
                  )
                ) {
                  setAreBuildArtifactsExpanded(false);
                  setAreAllArtifactsExpanded(true);
                }
              }}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Switch
              id="toggle-artifact-name-parsed"
              label="Parse Artifact identifier"
              isChecked={isArtifactIdentifierParsed}
              onChange={(_, checked) => {
                storeIsArtifactIdentifierParsed(checked);
              }}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              id="toggle-expand-build-associated"
              label="Expand Build associated Artifacts"
              isChecked={areBuildArtifactsExpanded}
              onChange={() => {
                setAreBuildArtifactsExpanded(!areBuildArtifactsExpanded);
                setAreAllArtifactsExpanded(areBuildArtifactsExpanded ? false : undefined);
              }}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>

      <ContentBox>
        <ServiceContainerLoading {...serviceContainerArtifacts} title={PageTitles.artifacts}>
          <Table isExpandable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th
                  expand={{
                    // probably a Patternfly bug, must be negated
                    areAllExpanded: !areAllArtifactsExpanded,
                    onToggle: () => {
                      setAreBuildArtifactsExpanded(false);
                      setAreAllArtifactsExpanded(areAllArtifactsExpanded !== undefined ? !areAllArtifactsExpanded : true);
                    },
                    collapseAllAriaLabel: '',
                  }}
                  aria-label="Expand all"
                />
                {columns.includes(artifactEntityAttributes.build.id) && <Th width={10} aria-label="Build Icon" />}
                {columns.includes(artifactEntityAttributes.identifier.id) && (
                  <Th width={30} sort={getSortParams(sortOptions.sortAttributes['identifier'].id)}>
                    {artifactEntityAttributes.identifier.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['targetRepository.repositoryType'].id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['targetRepository.repositoryType'].id)}>
                    {artifactEntityAttributes['targetRepository.repositoryType'].title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.buildCategory.id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['buildCategory'].id)}>
                    {artifactEntityAttributes.buildCategory.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.filename.id) && (
                  <Th width={25} sort={getSortParams(sortOptions.sortAttributes['filename'].id)}>
                    {artifactEntityAttributes.filename.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.artifactQuality.id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['artifactQuality'].id)}>
                    {artifactEntityAttributes.artifactQuality.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['product.name'].id) && (
                  <Th width={30} sort={getSortParams(sortOptions.sortAttributes['product.name'].id)}>
                    {artifactEntityAttributes['product.name'].title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['productMilestone.version'].id) && (
                  <Th width={30} sort={getSortParams(sortOptions.sortAttributes['productMilestone.version'].id)}>
                    {artifactEntityAttributes['productMilestone.version'].title}
                  </Th>
                )}
              </Tr>
            </Thead>
            {/* TODO: Change type from any, NCL-7766 */}
            {serviceContainerArtifacts.data?.content?.map((artifact, rowIndex) => (
              <Tbody key={rowIndex}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex,
                      isExpanded: isArtifactExpanded(artifact),
                      onToggle: () => {
                        setArtifactExpanded(artifact, !isArtifactExpanded(artifact));
                        setAreBuildArtifactsExpanded(false);
                        setAreAllArtifactsExpanded(undefined);
                      },
                    }}
                  />
                  {columns.includes(artifactEntityAttributes.build.id) && (
                    <Td>
                      {artifact.build && (
                        <TooltipWrapper tooltip="Artifact is associated with Build. Expand table row to see Build details.">
                          <BuildIcon />
                        </TooltipWrapper>
                      )}
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes.identifier.id) && (
                    <Td>
                      <Flex spaceItems={spaceItemsLg}>
                        <FlexItem>
                          {isArtifactIdentifierParsed ? (
                            <ParsedArtifactIdentifier artifact={artifact} />
                          ) : (
                            <Link to={`/artifacts/${artifact.id}`}>{artifact.identifier}</Link>
                          )}
                        </FlexItem>
                      </Flex>
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes['targetRepository.repositoryType'].id) && (
                    <Td>
                      {artifact.targetRepository?.repositoryType && (
                        <ArtifactRepositoryTypeLabelMapper repositoryType={artifact.targetRepository?.repositoryType} />
                      )}
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes.buildCategory.id) && (
                    <Td>
                      <Label color="grey">{artifact.buildCategory}</Label>
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes.filename.id) && (
                    <Td>
                      {artifact.publicUrl && artifact.filename && (
                        <DownloadLink url={artifact.publicUrl} title={artifact.filename} />
                      )}
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes.artifactQuality.id) && (
                    <Td>
                      <ArtifactQualityLabelMapper quality={artifact.artifactQuality} />
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes['product.name'].id) && (
                    <Td>
                      {isArtifactWithProductMilestone(artifact) && (
                        <Link to={`/products/${artifact.product.id}`}>{artifact.product.name}</Link>
                      )}
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes['productMilestone.version'].id) && (
                    <Td>
                      {isArtifactWithProductMilestone(artifact) && (
                        <Link
                          to={`/products/${artifact.product.id}/versions/${artifact.productVersion.id}/milestones/${artifact.productMilestone.id}`}
                        >
                          {artifact.productMilestone?.version}
                        </Link>
                      )}
                    </Td>
                  )}
                </Tr>
                <Tr isExpanded={isArtifactExpanded(artifact)}>
                  <Td />
                  <Td colSpan={7}>
                    <ExpandableRowContent>
                      <DescriptionList className="gap-5" isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>{artifactEntityAttributes.md5.title}</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.md5}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>{artifactEntityAttributes.sha1.title}</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.sha1}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>{artifactEntityAttributes.sha256.title}</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.sha256}</DescriptionListDescription>
                        </DescriptionListGroup>
                        {columns.includes(artifactEntityAttributes.build.id) && (
                          <DescriptionListGroup className="m-t-10">
                            <DescriptionListTerm>{artifactEntityAttributes.build.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {artifact.build ? (
                                <ArtifactBuild build={artifact.build} />
                              ) : (
                                <>
                                  <TooltipWrapper tooltip="This Artifact was not produced by any PNC Build." />{' '}
                                  <EmptyStateSymbol />
                                </>
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        )}
                      </DescriptionList>
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            ))}
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerArtifacts.data?.totalHits} />
    </>
  );
};
