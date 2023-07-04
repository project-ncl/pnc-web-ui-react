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
import { BuildIcon, DownloadIcon } from '@patternfly/react-icons';
import { ExpandableRowContent, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { BuildName } from 'components/BuildName/BuildName';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { Filtering, TFilterAttribute } from 'components/Filtering/Filtering';
import { ArtifactQualityLabelMapper } from 'components/LabelMapper/ArtifactQualityLabelMapper';
import { ArtifactRepositoryTypeLabelMapper } from 'components/LabelMapper/ArtifactRepositoryTypeLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ParsedArtifactIdentifier } from 'components/ParsedArtifactIdentifier/ParsedArtifactIdentifier';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

// TODO: filter based on columns property, NCL-7612
const sortAttributes: ISortAttributes = {
  identifier: {
    id: 'identifier',
    title: 'Identifier',
    tableColumnIndex: 0,
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

const defaultSorting: IDefaultSorting = {
  attribute: sortAttributes.identifier.id,
};

const spaceItemsSm: FlexProps['spaceItems'] = { default: 'spaceItemsSm' };
const spaceItemsLg: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IArtifactsListProps {
  serviceContainerArtifacts: IServiceContainer;
  columns?: string[];
  componentId: string;
}

const defaultColumns = [
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
export const ArtifactsList = ({ serviceContainerArtifacts, columns = defaultColumns, componentId }: IArtifactsListProps) => {
  const { getSortParams } = useSorting(sortAttributes, componentId, defaultSorting);

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
      <Toolbar borderTop>
        <ToolbarItem>
          <Filtering
            filterOptions={getFilterAttributes(artifactEntityAttributes, defaultColumns)}
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
      </Toolbar>

      <Toolbar disablePaddingTop>
        <ToolbarItem>
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
        <ServiceContainerLoading loadingDelayMilliseconds={0} {...serviceContainerArtifacts} title={PageTitles.artifacts}>
          <TableComposable isExpandable isStriped variant="compact">
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
                />
                {columns.includes(artifactEntityAttributes.build.id) && <Th width={10} />}
                {columns.includes(artifactEntityAttributes.identifier.id) && (
                  <Th width={30} sort={getSortParams(sortAttributes['identifier'].id)}>
                    {artifactEntityAttributes.identifier.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['targetRepository.repositoryType'].id) && (
                  <Th width={15} sort={getSortParams(sortAttributes['targetRepository.repositoryType'].id)}>
                    {artifactEntityAttributes['targetRepository.repositoryType'].title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.buildCategory.id) && (
                  <Th width={15} sort={getSortParams(sortAttributes['buildCategory'].id)}>
                    {artifactEntityAttributes.buildCategory.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.filename.id) && (
                  <Th width={25} sort={getSortParams(sortAttributes['filename'].id)}>
                    {artifactEntityAttributes.filename.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes.artifactQuality.id) && (
                  <Th width={15} sort={getSortParams(sortAttributes['artifactQuality'].id)}>
                    {artifactEntityAttributes.artifactQuality.title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['product.name'].id) && (
                  <Th width={30} sort={getSortParams(sortAttributes['product.name'].id)}>
                    {artifactEntityAttributes['product.name'].title}
                  </Th>
                )}
                {columns.includes(artifactEntityAttributes['productMilestone.version'].id) && (
                  <Th width={30} sort={getSortParams(sortAttributes['productMilestone.version'].id)}>
                    {artifactEntityAttributes['productMilestone.version'].title}
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
                  {columns.includes(artifactEntityAttributes.artifactQuality.id) && (
                    <Td>
                      <ArtifactQualityLabelMapper quality={artifact.artifactQuality} />
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes['product.name'].id) && (
                    <Td>
                      <Link to={`/products/${artifact.product?.id}`}>{artifact.product?.name}</Link>
                    </Td>
                  )}
                  {columns.includes(artifactEntityAttributes['productMilestone.version'].id) && (
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
                                <>
                                  <BuildName build={artifact.build} long includeBuildLink includeConfigLink /> (
                                  <Link to={`/builds/${artifact.build.id}`}>#{artifact.build.id}</Link>)
                                </>
                              ) : (
                                <>
                                  <TooltipWrapper tooltip="This Artifact was not produced by any PNC Build." />{' '}
                                  <EmptyStateSymbol variant="text" />
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
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerArtifacts.data?.totalHits} />
    </>
  );
};
