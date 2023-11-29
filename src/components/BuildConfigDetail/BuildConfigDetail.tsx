import { CodeBlock, CodeBlockCode, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { BuildConfiguration, BuildConfigurationRevision, ProductVersion } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { IServiceContainer, IServiceContainerState } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { ProductVersionLink } from 'components/ProductVersionLink/ProductVersionLink';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IBuildConfigDetailProps {
  serviceContainerBuildConfig?: IServiceContainerState<BuildConfiguration>;
  serviceContainerBuildConfigRevision?: IServiceContainerState<BuildConfigurationRevision>;
  serviceContainerProductVersion?: IServiceContainer<ProductVersion, productVersionApi.IProductVersionApiData>;
}

/**
 * Component used to display details of either a BuildConfig or a BuildConfigRevision.
 *
 * @param serviceContainerBuildConfig - The serviceContainer for the Build Config
 * @param serviceContainerBuildConfigRevision - The serviceContainer for the Build Config Revision
 * @param serviceContainerProductVersion - The serviceContainer for the Product Version, mandatory when serviceContainerBuildConfig is passed in
 */
export const BuildConfigDetail = ({
  serviceContainerBuildConfig,
  serviceContainerBuildConfigRevision,
  serviceContainerProductVersion,
}: IBuildConfigDetailProps) => {
  const tootipLinkStyle: CSSProperties = {
    color: '#55AAFF',
  };

  const serviceContainer = serviceContainerBuildConfig ?? serviceContainerBuildConfigRevision;
  if (!serviceContainer) {
    throw new Error(
      'Either serviceContainerBuildConfig or serviceContainerBuildConfigRevision has to be defined in BuildConfigDetail component'
    );
  }
  if (!!serviceContainerBuildConfig && !serviceContainerProductVersion) {
    throw new Error('Missing serviceContainerProductVersion when serviceContainerBuildConfig is passed in');
  }

  return (
    <>
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildConfigEntityAttributes['project.name'].title}>
              {serviceContainer.data?.project && (
                <ProjectLink id={serviceContainer.data.project.id}>{serviceContainer.data.project.name}</ProjectLink>
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.creationTime.title}>
              {serviceContainer.data?.creationTime && <DateTime date={serviceContainer.data.creationTime} />}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.creationUser.title}>
              {serviceContainer.data?.creationUser?.username}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.modificationTime.title}>
              {serviceContainer.data?.modificationTime && <DateTime date={serviceContainer.data.modificationTime} />}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.modificationUser.title}>
              {serviceContainer.data?.modificationUser?.username}
            </AttributesItem>
            {!!serviceContainerBuildConfig && (
              <AttributesItem title={buildConfigEntityAttributes.description.title}>
                {serviceContainerBuildConfig.data?.description}
              </AttributesItem>
            )}
            <AttributesItem title={buildConfigEntityAttributes.buildType.title}>
              {serviceContainer.data?.buildType && (
                <BuildConfigBuildTypeLabelMapper buildType={serviceContainer.data.buildType} />
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.environment.title}>
              {serviceContainer.data?.environment?.description}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.scmRepository.title}>
              {serviceContainer.data?.scmRepository && <ScmRepositoryLink scmRepository={serviceContainer.data.scmRepository} />}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.scmRevision.title}>
              {serviceContainer.data?.scmRevision}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.buildScript.title}>
              {serviceContainer.data?.buildScript && (
                <CodeBlock>
                  <CodeBlockCode>{serviceContainer.data.buildScript}</CodeBlockCode>
                </CodeBlock>
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.brewPullActive.title}>
              {serviceContainer.data?.brewPullActive + ''}
            </AttributesItem>
            {!!serviceContainerProductVersion && (
              <AttributesItem title={buildConfigEntityAttributes.productVersion.title}>
                <ServiceContainerLoading
                  {...serviceContainerProductVersion}
                  variant="inline"
                  title={buildConfigEntityAttributes.productVersion.title}
                >
                  <ProductVersionLink productVersion={serviceContainerProductVersion.data!} />
                </ServiceContainerLoading>
              </AttributesItem>
            )}
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>{buildConfigEntityAttributes.parameters.title}</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop padding isResponsive>
          {serviceContainer.data?.parameters && Object.keys(serviceContainer.data.parameters).length ? (
            <Attributes>
              {Object.entries(serviceContainer.data.parameters).map(([parameterKey, parameter], index) => (
                <AttributesItem
                  key={index}
                  title={parameterKey}
                  tooltip={
                    parameterKey === 'ALIGNMENT_PARAMETERS' ? (
                      <>
                        See{' '}
                        <Link
                          style={tootipLinkStyle}
                          to="http://release-engineering.github.io/pom-manipulation-ext/#feature-guide"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Feature Guide
                        </Link>
                      </>
                    ) : undefined
                  }
                >
                  <CodeBlock>
                    <CodeBlockCode>{parameter}</CodeBlockCode>
                  </CodeBlock>
                </AttributesItem>
              ))}
            </Attributes>
          ) : (
            <EmptyStateSymbol />
          )}
        </ContentBox>
      </GridItem>
    </>
  );
};
