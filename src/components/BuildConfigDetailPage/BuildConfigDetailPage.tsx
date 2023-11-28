import { CodeBlock, CodeBlockCode, Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { CSSProperties, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { useServiceContainerBuildConfig } from 'components/BuildConfigPages/BuildConfigPages';
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

export const BuildConfigDetailPage = () => {
  const { serviceContainerBuildConfig } = useServiceContainerBuildConfig();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const tootipLinkStyle: CSSProperties = {
    color: '#55AAFF',
  };

  useEffect(() => {
    if (serviceContainerBuildConfig.data?.productVersion) {
      serviceContainerProductVersionRunner({ serviceData: { id: serviceContainerBuildConfig.data.productVersion.id } });
    }
  }, [serviceContainerProductVersionRunner, serviceContainerBuildConfig]);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildConfigEntityAttributes['project.name'].title}>
              {serviceContainerBuildConfig.data?.project && (
                <ProjectLink id={serviceContainerBuildConfig.data.project.id}>
                  {serviceContainerBuildConfig.data.project.name}
                </ProjectLink>
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.creationTime.title}>
              {serviceContainerBuildConfig.data?.creationTime && (
                <DateTime date={serviceContainerBuildConfig.data.creationTime} />
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.creationUser.title}>
              {serviceContainerBuildConfig.data?.creationUser?.username}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.modificationTime.title}>
              {serviceContainerBuildConfig.data?.modificationTime && (
                <DateTime date={serviceContainerBuildConfig.data.modificationTime} />
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.modificationUser.title}>
              {serviceContainerBuildConfig.data?.modificationUser?.username}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.description.title}>
              {serviceContainerBuildConfig.data?.description}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.buildType.title}>
              {serviceContainerBuildConfig.data?.buildType && (
                <BuildConfigBuildTypeLabelMapper buildType={serviceContainerBuildConfig.data.buildType} />
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.environment.title}>
              {serviceContainerBuildConfig.data?.environment?.description}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.scmRepository.title}>
              {serviceContainerBuildConfig.data?.scmRepository && (
                <ScmRepositoryLink scmRepository={serviceContainerBuildConfig.data.scmRepository} />
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.scmRevision.title}>
              {serviceContainerBuildConfig.data?.scmRevision}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.buildScript.title}>
              {serviceContainerBuildConfig.data?.buildScript && (
                <CodeBlock>
                  <CodeBlockCode>{serviceContainerBuildConfig.data.buildScript}</CodeBlockCode>
                </CodeBlock>
              )}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.brewPullActive.title}>
              {serviceContainerBuildConfig.data?.brewPullActive + ''}
            </AttributesItem>
            <AttributesItem title={buildConfigEntityAttributes.productVersion.title}>
              <ServiceContainerLoading
                {...serviceContainerProductVersion}
                variant="inline"
                title={buildConfigEntityAttributes.productVersion.title}
              >
                <ProductVersionLink productVersion={serviceContainerProductVersion.data!} />
              </ServiceContainerLoading>
            </AttributesItem>
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
          {serviceContainerBuildConfig.data?.parameters && Object.keys(serviceContainerBuildConfig.data.parameters).length ? (
            <Attributes>
              {Object.entries(serviceContainerBuildConfig.data.parameters).map(([parameterKey, parameter], index) => (
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
    </Grid>
  );
};
