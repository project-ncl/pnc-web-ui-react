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
import { DownloadIcon } from '@patternfly/react-icons';
import { BuildIcon } from '@patternfly/react-icons';
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ArtifactQualityLabel } from 'components/ArtifactQualityLabel/ArtifactQualityLabel';
import { ArtifactRepositoryTypeLabel } from 'components/ArtifactRepositoryTypeLabel/ArtifactRepositoryTypeLabel';
import { BuildName } from 'components/BuildName/BuildName';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { Filtering, IFilterAttribute, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ParsedArtifactIdentifier } from 'components/ParsedArtifactIdentifier/ParsedArtifactIdentifier';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

// TODO: filter based on columns property, NCL-7612
const filterOptions: IFilterOptions = {
  filterAttributes: {
    identifier: {
      id: 'identifier',
      title: 'Identifier',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    artifactQuality: {
      id: 'artifactQuality',
      title: 'Artifact Quality',
      filterValues: ['NEW', 'VERIFIED', 'TESTED', 'DEPRECATED', 'BLACKLISTED', 'TEMPORARY', 'DELETED', 'IMPORTED'],
      operator: '==',
    },
    buildCategory: {
      id: 'buildCategory',
      title: 'Build Category',
      filterValues: ['STANDARD', 'SERVICE'],
      operator: '==',
    },
    filename: {
      id: 'filename',
      title: 'Filename',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    'targetRepository.repositoryType': {
      id: 'targetRepository.repositoryType',
      title: 'Repository Type',
      filterValues: ['MAVEN', 'GENERIC_PROXY', 'NPM', 'COCOA_POD', 'DISTRIBUTION_ARCHIVE'],
      operator: '==',
    },
    md5: {
      id: 'md5',
      title: 'md5',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    sha1: {
      id: 'sha1',
      title: 'sha1',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    sha256: {
      id: 'sha256',
      title: 'sha256',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    'product.name': {
      id: 'product.name',
      title: 'Product Name',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    'productMilestone.version': {
      id: 'productMilestone.version',
      title: 'Miletone Version',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
  },
};

// TODO: filter based on columns property, NCL-7612
const sortOptions: ISortOptions = {
  identifier: {
    id: 'identifier',
    title: 'Identifier',
    tableColumnIndex: 0,
    isDefault: true,
  },
  'targetRepository.repositoryType': {
    id: 'targetRepository.repositoryType',
    title: 'Repository Type',
    tableColumnIndex: 1,
  },
  buildCategory: {
    id: 'buildCategory',
    title: 'Build Category',
    tableColumnIndex: 2,
  },
  filename: {
    id: 'filename',
    title: 'File Name',
    tableColumnIndex: 3,
  },
  artifactQuality: {
    id: 'artifactQuality',
    title: 'Artifact Quality',
    tableColumnIndex: 4,
  },
  'product.name': {
    id: 'product.name',
    title: 'Product Name',
    tableColumnIndex: 5,
  },
  'productMilestone.version': {
    id: 'productMilestone.version',
    title: 'Miletone Version',
    tableColumnIndex: 6,
  },
};

const spaceItemsSm: FlexProps['spaceItems'] = { default: 'spaceItemsSm' };
const spaceItemsLg: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IArtifactsListProps {
  serviceContainerArtifacts: IServiceContainer;
  columns?: string[];
  componentId: string;
}

const defaultColumns = [
  'identifier',
  'targetRepository.repositoryType',
  'buildCategory',
  'filename',
  'artifactQuality',
  'md5',
  'sha1',
  'sha256',
  'build',
];

/**
 * Component displaying list of Artifacts.
 *
 * @param serviceContainerArtifacts - Service Container for Artifacts
 * @param componentId - Component ID
 */
export const ArtifactsList = ({ serviceContainerArtifacts, columns = defaultColumns, componentId }: IArtifactsListProps) => {
  const { getSortParams } = useSorting(sortOptions, componentId);

  const [isArtifactIdentifierParsed, setIsArtifactIdentifierParsed] = useState<boolean>(false);

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
    const shouldParse = window.localStorage.getItem('is-artifact-identifier-parsed') === 'true';
    setIsArtifactIdentifierParsed(shouldParse);
  }, []);

  useEffect(() => {
    if (areBuildArtifactsExpanded) {
      setExpandedArtifacts(
        serviceContainerArtifacts.data?.content
          .filter((artifact: Artifact) => artifact.build)
          .map((artifact: Artifact) => artifact.identifier)
      );
    }
  }, [areBuildArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  useEffect(() => {
    if (areAllArtifactsExpanded === true) {
      setExpandedArtifacts(serviceContainerArtifacts.data?.content.map((artifact: Artifact) => artifact.identifier));
    } else if (areAllArtifactsExpanded === false) {
      setExpandedArtifacts([]);
    }
  }, [areAllArtifactsExpanded, serviceContainerArtifacts.data?.content]);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={filterOptions}
            componentId={componentId}
            onFilter={(filterAttribute: IFilterAttribute, _) => {
              if (['md5', 'sha1', 'sha256'].includes(filterAttribute.id)) {
                setAreBuildArtifactsExpanded(false);
                setAreAllArtifactsExpanded(true);
              }
            }}
          />
        </ToolbarItem>
        <ToolbarItem marginLeft="20px">
          <Switch
            id="toggle-artifact-name-parsed"
            label="Parse Artifact identifier"
            labelOff="Parse Artifact identifier"
            isChecked={isArtifactIdentifierParsed}
            onChange={(checked) => {
              setIsArtifactIdentifierParsed(checked);
              window.localStorage.setItem('is-artifact-identifier-parsed', `${checked}`);
            }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Switch
            id="toggle-expand-build-associated"
            label="Expand Build associated Artifacts"
            labelOff="Expand Build associated Artifacts"
            isChecked={areBuildArtifactsExpanded}
            onChange={() => {
              setAreBuildArtifactsExpanded(!areBuildArtifactsExpanded);
              setAreAllArtifactsExpanded(areBuildArtifactsExpanded ? false : undefined);
            }}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerArtifacts} title={PageTitles.artifacts}>
          <TableComposable isExpandable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
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
                />
                {columns.includes('build') && <Th width={10} />}
                {columns.includes('identifier') && (
                  <Th width={30} sort={getSortParams(sortOptions['identifier'].id)}>
                    Identifier
                  </Th>
                )}
                {columns.includes('targetRepository.repositoryType') && (
                  <Th width={15} sort={getSortParams(sortOptions['targetRepository.repositoryType'].id)}>
                    Repository Type
                  </Th>
                )}
                {columns.includes('buildCategory') && (
                  <Th width={15} sort={getSortParams(sortOptions['buildCategory'].id)}>
                    Build Category
                  </Th>
                )}
                {columns.includes('filename') && (
                  <Th width={25} sort={getSortParams(sortOptions['filename'].id)}>
                    Filename
                  </Th>
                )}
                {columns.includes('artifactQuality') && (
                  <Th width={15} sort={getSortParams(sortOptions['artifactQuality'].id)}>
                    Artifact Quality
                  </Th>
                )}
                {columns.includes('product.name') && (
                  <Th width={30} sort={getSortParams(sortOptions['product.name'].id)}>
                    Source Product
                  </Th>
                )}
                {columns.includes('productMilestone.version') && (
                  <Th width={30} sort={getSortParams(sortOptions['productMilestone.version'].id)}>
                    Source Milestone
                  </Th>
                )}
              </Tr>
            </Thead>
            {/* TODO: Change type from any, NCL-7766 */}
            {serviceContainerArtifacts.data?.content.map((artifact: any, rowIndex: number) => (
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
                  {columns.includes('build') && (
                    <Td>
                      {artifact.build && (
                        <TooltipWrapper tooltip="Artifact is associated with Build. Expand table row to see Build details.">
                          <BuildIcon />
                        </TooltipWrapper>
                      )}
                    </Td>
                  )}
                  {columns.includes('identifier') && (
                    <Td>
                      <Flex spaceItems={spaceItemsLg}>
                        <FlexItem>
                          {isArtifactIdentifierParsed ? <ParsedArtifactIdentifier artifact={artifact} /> : artifact.identifier}
                        </FlexItem>
                      </Flex>
                    </Td>
                  )}
                  {columns.includes('targetRepository.repositoryType') && (
                    <Td>
                      {artifact.targetRepository?.repositoryType && (
                        <ArtifactRepositoryTypeLabel repositoryType={artifact.targetRepository?.repositoryType} />
                      )}
                    </Td>
                  )}
                  {columns.includes('buildCategory') && (
                    <Td>
                      <Label color="grey">{artifact.buildCategory}</Label>
                    </Td>
                  )}
                  {columns.includes('filename') && (
                    <Td>
                      <Flex spaceItems={spaceItemsSm}>
                        <FlexItem>
                          <a href={artifact.publicUrl} target="_self">
                            <DownloadIcon />
                          </a>
                        </FlexItem>
                        <FlexItem>
                          <a href={artifact.publicUrl} target="_self">
                            {artifact.filename}
                          </a>
                        </FlexItem>
                      </Flex>
                    </Td>
                  )}
                  {columns.includes('artifactQuality') && (
                    <Td>
                      <ArtifactQualityLabel quality={artifact.artifactQuality} />
                    </Td>
                  )}
                  {columns.includes('product.name') && (
                    <Td>
                      <Link to={`/products/${artifact.product?.id}`}>{artifact.product?.name}</Link>
                    </Td>
                  )}
                  {columns.includes('productMilestone.version') && (
                    <Td>
                      <Link
                        to={`/products/${artifact.product?.id}/versions/${artifact.productVersion?.id}/milestones/${artifact.productMilestone?.id}`}
                      >
                        {artifact.productMilestone?.version}
                      </Link>
                    </Td>
                  )}
                </Tr>
                <Tr isExpanded={isArtifactExpanded(artifact)}>
                  <Td />
                  <Td colSpan={6}>
                    <ExpandableRowContent>
                      <DescriptionList className="gap-5" isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>md5</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.md5}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>sha1</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.sha1}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>sha256</DescriptionListTerm>
                          <DescriptionListDescription>{artifact.sha256}</DescriptionListDescription>
                        </DescriptionListGroup>
                        {columns.includes('build') && (
                          <DescriptionListGroup className="m-t-10">
                            <DescriptionListTerm>Build</DescriptionListTerm>
                            <DescriptionListDescription>
                              {artifact.build ? (
                                <>
                                  <BuildName build={artifact.build} long /> (#{artifact.build.id})
                                </>
                              ) : (
                                <TooltipWrapper tooltip="This Artifact was not produced by any PNC Build.">
                                  <EmptyStateSymbol variant="text" />
                                </TooltipWrapper>
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
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerArtifacts.data?.totalHits} />
    </>
  );
};
