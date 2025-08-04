import { Grid, GridItem, Label } from '@patternfly/react-core';
import { useCallback } from 'react';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactBuild } from 'components/ArtifactBuild/ArtifactBuild';
import { useServiceContainerArtifact } from 'components/ArtifactPages/ArtifactPages';
import { ArtifactQualityRevisionsList } from 'components/ArtifactQualityRevisionsList/ArtifactQualityRevisionsList';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { DateTime } from 'components/DateTime/DateTime';
import { DownloadLink } from 'components/DownloadLink/DownloadLink';
import { ArtifactQualityLabelMapper } from 'components/LabelMapper/ArtifactQualityLabelMapper';
import { ArtifactRepositoryTypeLabelMapper } from 'components/LabelMapper/ArtifactRepositoryTypeLabelMapper';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as artifactApi from 'services/artifactApi';

import { calculateFileSize } from 'utils/utils';

interface IArtifactDetailPageProps {
  componentId?: string;
}

export const ArtifactDetailPage = ({ componentId = 'r1' }: IArtifactDetailPageProps) => {
  const { artifactId } = useParamsRequired();

  const { serviceContainerArtifact } = useServiceContainerArtifact();

  const serviceContainerQualityRevisions = useServiceContainer(artifactApi.getQualityRevisions);
  const serviceContainerQualityRevisionsRunner = serviceContainerQualityRevisions.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerQualityRevisionsRunner({ serviceData: { id: artifactId }, requestConfig }),
      [serviceContainerQualityRevisionsRunner, artifactId]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.pagination }
  );

  return (
    <Grid hasGutter>
      <GridItem xl={12} xl2={6}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Details" />
          </ToolbarItem>
        </Toolbar>

        <ContentBox borderTop padding isResponsive contentBoxHeight={`calc(100% - 78px)`}>
          <Attributes>
            <AttributesItem title={artifactEntityAttributes.filename.title}>
              {serviceContainerArtifact.data?.filename}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.purl.title}>
              {serviceContainerArtifact.data?.purl && (
                <CopyToClipboard isInline>{serviceContainerArtifact.data.purl}</CopyToClipboard>
              )}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.size.title}>
              {serviceContainerArtifact.data?.size && calculateFileSize(serviceContainerArtifact.data.size)}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.artifactQuality.title}>
              {serviceContainerArtifact.data?.artifactQuality && (
                <ArtifactQualityLabelMapper quality={serviceContainerArtifact.data.artifactQuality} />
              )}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.importDate.title}>
              {serviceContainerArtifact.data?.importDate && <DateTime date={serviceContainerArtifact.data.importDate} />}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem xl={12} xl2={6}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Checksums and Build" />
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop padding isResponsive contentBoxHeight={`calc(100% - 78px)`}>
          <Attributes>
            <AttributesItem title={artifactEntityAttributes.md5.title}>
              <CopyToClipboard isInline>{serviceContainerArtifact.data?.md5}</CopyToClipboard>
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.sha1.title}>
              <CopyToClipboard isInline>{serviceContainerArtifact.data?.sha1}</CopyToClipboard>
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.sha256.title}>
              <CopyToClipboard isInline>{serviceContainerArtifact.data?.sha256}</CopyToClipboard>
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.build.title}>
              {serviceContainerArtifact.data?.build && <ArtifactBuild build={serviceContainerArtifact.data.build} />}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes.buildCategory.title}>
              <Label color="grey">{serviceContainerArtifact.data?.buildCategory}</Label>
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Locations" />
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop padding isResponsive>
          <Attributes>
            <AttributesItem
              title={artifactEntityAttributes.publicUrl.title}
              tooltip={artifactEntityAttributes.publicUrl.tooltip}
              forceStringWrap
            >
              {serviceContainerArtifact.data?.publicUrl && (
                <DownloadLink url={serviceContainerArtifact.data.publicUrl} title={serviceContainerArtifact.data.publicUrl} />
              )}
            </AttributesItem>
            <AttributesItem
              title={artifactEntityAttributes.originUrl.title}
              tooltip={artifactEntityAttributes.originUrl.tooltip}
              forceStringWrap
            >
              {serviceContainerArtifact.data?.originUrl && (
                <DownloadLink url={serviceContainerArtifact.data.originUrl} title={serviceContainerArtifact.data.originUrl} />
              )}
            </AttributesItem>
            <AttributesItem
              title={artifactEntityAttributes.deployUrl.title}
              tooltip={artifactEntityAttributes.deployUrl.tooltip}
              forceStringWrap
            >
              {serviceContainerArtifact.data?.deployUrl && (
                <DownloadLink url={serviceContainerArtifact.data.deployUrl} title={serviceContainerArtifact.data.deployUrl} />
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Target Repository" />
          </ToolbarItem>
        </Toolbar>

        <ContentBox borderTop padding isResponsive>
          <Attributes>
            <AttributesItem title={artifactEntityAttributes['targetRepository.identifier'].title}>
              {serviceContainerArtifact.data?.targetRepository?.identifier}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes['targetRepository.repositoryType'].title}>
              {serviceContainerArtifact.data?.targetRepository?.repositoryType && (
                <ArtifactRepositoryTypeLabelMapper
                  repositoryType={serviceContainerArtifact.data.targetRepository.repositoryType}
                />
              )}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes['targetRepository.temporaryRepo'].title}>
              {serviceContainerArtifact.data?.targetRepository?.temporaryRepo ? 'true' : 'false'}
            </AttributesItem>
            <AttributesItem title={artifactEntityAttributes['targetRepository.repositoryPath'].title}>
              <CopyToClipboard isInline>{serviceContainerArtifact.data?.targetRepository?.repositoryPath}</CopyToClipboard>
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Quality Revisions" />
          </ToolbarItem>
        </Toolbar>

        <ArtifactQualityRevisionsList {...{ serviceContainerQualityRevisions, componentId }} />
      </GridItem>
    </Grid>
  );
};
