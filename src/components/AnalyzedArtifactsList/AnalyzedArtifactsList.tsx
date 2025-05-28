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
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { AnalyzedArtifact, AnalyzedArtifactPage } from 'pnc-api-types-ts';

import { analyzedArtifactEntityAttributes } from 'common/analyzedArtifactEntityAttributes';
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

const spaceItemsLg: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IAnalyzedArtifactsListProps {
  serviceContainerArtifacts: IServiceContainerState<AnalyzedArtifactPage>;
  columns?: string[];
  componentId: string;
}

const defaultColumns = [
  analyzedArtifactEntityAttributes['artifact.id'].id,
  analyzedArtifactEntityAttributes['artifact.identifier'].id,
  analyzedArtifactEntityAttributes['artifact.targetRepository.repositoryType'].id,
  analyzedArtifactEntityAttributes['artifact.artifactQuality'].id,
  analyzedArtifactEntityAttributes['artifact.buildCategory'].id,
  analyzedArtifactEntityAttributes['artifact.filename'].id,
  analyzedArtifactEntityAttributes['artifact.build'].id,
  analyzedArtifactEntityAttributes.builtFromSource.id,
  analyzedArtifactEntityAttributes.brewId.id,
];

/**
 * Component displaying list of Analyzed Artifacts.
 *
 * @param serviceContainerArtifacts - Service Container for AnalyzedArtifacts
 * @param componentId - Component ID
 */
export const AnalyzedArtifactsList = ({
  serviceContainerArtifacts,
  columns = defaultColumns,
  componentId,
}: IAnalyzedArtifactsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: analyzedArtifactEntityAttributes,
        defaultSorting: {
          attribute: analyzedArtifactEntityAttributes['artifact.identifier'].id,
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

  const setArtifactExpanded = (analyzedArtifact: AnalyzedArtifact, isExpanding = true) =>
    setExpandedArtifacts((prev) => {
      const others = prev.filter((id) => id !== analyzedArtifact.artifact!.identifier);
      return isExpanding ? [...others, analyzedArtifact.artifact!.identifier] : others;
    });

  const isArtifactExpanded = (analyzedArtifact: AnalyzedArtifact) =>
    expandedArtifacts.includes(analyzedArtifact.artifact!.identifier);

  useEffect(() => {
    if (areBuildArtifactsExpanded) {
      setExpandedArtifacts(
        serviceContainerArtifacts.data?.content
          ?.filter((analyzedArtifact: AnalyzedArtifact) => analyzedArtifact.artifact?.build)
          .map((analyzedArtifact: AnalyzedArtifact) => analyzedArtifact.artifact!.identifier) || []
      );
    }
  }, [areBuildArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  useEffect(() => {
    if (areAllArtifactsExpanded === true) {
      setExpandedArtifacts(
        serviceContainerArtifacts.data?.content?.map(
          (analyzedArtifact: AnalyzedArtifact) => analyzedArtifact.artifact!.identifier
        ) || []
      );
    } else if (areAllArtifactsExpanded === false) {
      setExpandedArtifacts([]);
    }
  }, [areAllArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  return (
    <>
      <Toolbar borderTop column>
        <ToolbarGroup>
          <ToolbarItem>
            <Filtering
              filterOptions={useMemo(
                () =>
                  getFilterOptions({
                    entityAttributes: analyzedArtifactEntityAttributes,
                    defaultFiltering: {
                      attribute: analyzedArtifactEntityAttributes['artifact.identifier'].id,
                    },
                    customColumns: columns,
                  }),
                [columns]
              )}
              componentId={componentId}
              onFilter={(filterAttribute: TFilterAttribute, _) => {
                if (
                  [
                    analyzedArtifactEntityAttributes['artifact.md5'].id,
                    analyzedArtifactEntityAttributes['artifact.sha1'].id,
                    analyzedArtifactEntityAttributes['artifact.sha256'].id,
                  ].some((hash) => hash === filterAttribute.id)
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
              onChange={(_, checked) => storeIsArtifactIdentifierParsed(checked)}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              id="toggle-expand-build-associated"
              label="Expand Build associated Artifacts"
              isChecked={areBuildArtifactsExpanded}
              onChange={(_, checked) => {
                setAreBuildArtifactsExpanded(checked);
                setAreAllArtifactsExpanded(checked ? false : undefined);
              }}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerArtifacts} title={PageTitles.artifacts}>
          <Table isExpandable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th
                  expand={{
                    // probably a Patternfly bug, must be negated
                    areAllExpanded: areBuildArtifactsExpanded ? !areBuildArtifactsExpanded : !areAllArtifactsExpanded,
                    onToggle: () => {
                      if (areBuildArtifactsExpanded) {
                        setAreBuildArtifactsExpanded(false);
                      } else {
                        setAreAllArtifactsExpanded((prev) => (prev === undefined ? true : !prev));
                      }
                    },
                    collapseAllAriaLabel: '',
                  }}
                  aria-label="Expand all"
                />
                {columns.includes(analyzedArtifactEntityAttributes['artifact.build'].id) && (
                  <Th width={10} aria-label="Build Icon" />
                )}
                {columns.includes(analyzedArtifactEntityAttributes['artifact.identifier'].id) && (
                  <Th width={25} sort={getSortParams(sortOptions.sortAttributes['artifact.identifier'].id)}>
                    {analyzedArtifactEntityAttributes['artifact.identifier'].title}
                  </Th>
                )}
                {columns.includes(analyzedArtifactEntityAttributes['artifact.targetRepository.repositoryType'].id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['artifact.targetRepository.repositoryType'].id)}>
                    {analyzedArtifactEntityAttributes['artifact.targetRepository.repositoryType'].title}
                  </Th>
                )}
                {columns.includes(analyzedArtifactEntityAttributes['artifact.buildCategory'].id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['artifact.buildCategory'].id)}>
                    {analyzedArtifactEntityAttributes['artifact.buildCategory'].title}
                  </Th>
                )}
                {columns.includes(analyzedArtifactEntityAttributes['artifact.filename'].id) && (
                  <Th width={25} sort={getSortParams(sortOptions.sortAttributes['artifact.filename'].id)}>
                    {analyzedArtifactEntityAttributes['artifact.filename'].title}
                  </Th>
                )}
                {columns.includes(analyzedArtifactEntityAttributes['artifact.artifactQuality'].id) && (
                  <Th width={10} sort={getSortParams(sortOptions.sortAttributes['artifact.artifactQuality'].id)}>
                    {analyzedArtifactEntityAttributes['artifact.artifactQuality'].title}
                  </Th>
                )}
                {columns.includes(analyzedArtifactEntityAttributes.brewId.id) && <Th width={10}>Brew ID</Th>}
              </Tr>
            </Thead>
            {/* TODO: Change type from any, NCL-7766 */}
            {serviceContainerArtifacts.data?.content?.map((analyzedArtifact, rowIndex) => {
              const artifact = analyzedArtifact.artifact!;
              return (
                <Tbody key={rowIndex}>
                  <Tr>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: isArtifactExpanded(analyzedArtifact),
                        onToggle: () => setArtifactExpanded(analyzedArtifact, !isArtifactExpanded(analyzedArtifact)),
                      }}
                    />
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.build'].id) && (
                      <Td>
                        {artifact.build && (
                          <TooltipWrapper tooltip="Artifact is associated with Build. Expand table row to see Build details.">
                            <BuildIcon />
                          </TooltipWrapper>
                        )}
                      </Td>
                    )}
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.identifier'].id) && (
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
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.targetRepository.repositoryType'].id) && (
                      <Td>
                        {artifact.targetRepository?.repositoryType && (
                          <ArtifactRepositoryTypeLabelMapper repositoryType={artifact.targetRepository.repositoryType} />
                        )}
                      </Td>
                    )}
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.buildCategory'].id) && (
                      <Td>
                        <Label color="grey">{artifact.buildCategory}</Label>
                      </Td>
                    )}
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.filename'].id) && (
                      <Td>
                        {artifact.publicUrl && artifact.filename && (
                          <DownloadLink url={artifact.publicUrl} title={artifact.filename} />
                        )}
                      </Td>
                    )}
                    {columns.includes(analyzedArtifactEntityAttributes['artifact.artifactQuality'].id) && (
                      <Td>
                        <ArtifactQualityLabelMapper quality={artifact.artifactQuality} />
                      </Td>
                    )}
                    {columns.includes(analyzedArtifactEntityAttributes.brewId.id) && <Td>{analyzedArtifact.brewId}</Td>}
                  </Tr>
                  <Tr isExpanded={isArtifactExpanded(analyzedArtifact)}>
                    <Td />
                    <Td colSpan={columns.length + 1}>
                      <ExpandableRowContent>
                        <DescriptionList className="gap-5" isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{analyzedArtifactEntityAttributes['artifact.md5'].title}</DescriptionListTerm>
                            <DescriptionListDescription>{artifact.md5}</DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{analyzedArtifactEntityAttributes['artifact.sha1'].title}</DescriptionListTerm>
                            <DescriptionListDescription>{artifact.sha1}</DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{analyzedArtifactEntityAttributes['artifact.sha256'].title}</DescriptionListTerm>
                            <DescriptionListDescription>{artifact.sha256}</DescriptionListDescription>
                          </DescriptionListGroup>
                          {columns.includes(analyzedArtifactEntityAttributes['artifact.build'].id) && (
                            <DescriptionListGroup className="m-t-10">
                              <DescriptionListTerm>
                                {analyzedArtifactEntityAttributes['artifact.build'].title}
                              </DescriptionListTerm>
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
                          <DescriptionListGroup className="m-t-10">
                            <DescriptionListTerm>Licenses</DescriptionListTerm>
                            <DescriptionListDescription>
                              {analyzedArtifact.licenses && analyzedArtifact.licenses.length > 0 ? (
                                analyzedArtifact.licenses.map((license, index) => (
                                  <span key={index}>
                                    <a href={license.url} target="_blank" rel="noopener noreferrer">
                                      {license.spdxLicenseId}
                                    </a>
                                    {index < analyzedArtifact.licenses!.length - 1 && ', '}
                                  </span>
                                ))
                              ) : (
                                <>
                                  <TooltipWrapper tooltip="This artifact has no associated license." /> <EmptyStateSymbol />
                                </>
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup className="m-t-10">
                            <DescriptionListTerm>Distribution URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Link to={analyzedArtifact.distribution!.distributionUrl!}>
                                {analyzedArtifact.distribution!.distributionUrl}
                              </Link>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                </Tbody>
              );
            })}
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerArtifacts.data?.totalHits} />
    </>
  );
};
