import { CodeBlock, CodeBlockCode, Grid, GridItem } from '@patternfly/react-core';
import { useState } from 'react';
import { Link } from 'react-router';

import { BuildConfiguration, BuildConfigurationRevision, ProductVersion } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';

import { DataValues, IServiceContainerState } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigRestoreModal } from 'components/BuildConfigRestoreModal/BuildConfigRestoreModal';
import { BuildConfigRestoreModalButton } from 'components/BuildConfigRestoreModal/BuildConfigRestoreModalButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { ProductVersionLink } from 'components/ProductVersionLink/ProductVersionLink';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { UpgradeEnvironmentModal } from 'components/UpgradeEnvironmentModal/UpgradeEnvironmentModal';
import { UpgradeEnvironmentModalButton } from 'components/UpgradeEnvironmentModal/UpgradeEnvironmentModalButton';
import { WarningLabel } from 'components/WarningLabel/WarningLabel';

interface IBuildConfigDetailProps {
  serviceContainerBuildConfig: IServiceContainerState<BuildConfiguration | BuildConfigurationRevision>;
  serviceContainerProductVersion?: IServiceContainerState<ProductVersion>;
  isRevisionVariant?: boolean;
  isCurrentRevision?: boolean;
}

export const BuildConfigDetail = ({
  serviceContainerBuildConfig,
  serviceContainerProductVersion,
  isRevisionVariant = false,
  isCurrentRevision = true,
}: IBuildConfigDetailProps) => {
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);
  const toggleRestoreModal = () => setIsRestoreModalOpen((isRestoreModalOpen) => !isRestoreModalOpen);

  const [isUpgradeEnvironmentModalOpen, setIsUpgradeEnvironmentModalOpen] = useState<boolean>(false);

  const disabledButtonReason = isCurrentRevision ? 'The last Build Config revision cannot be restored' : undefined;

  const toggleUpgradeEnvironmentModal = () =>
    setIsUpgradeEnvironmentModalOpen((isUpgradeEnvironmentModalOpen) => !isUpgradeEnvironmentModalOpen);

  return (
    <ServiceContainerLoading {...serviceContainerBuildConfig} title="Build Config">
      <Grid hasGutter>
        <GridItem span={12}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Details" />
            </ToolbarItem>
            {isRevisionVariant && (
              <ToolbarItem alignRight>
                <BuildConfigRestoreModalButton toggleModal={toggleRestoreModal} disabledButtonReason={disabledButtonReason} />
              </ToolbarItem>
            )}
          </Toolbar>
          <ContentBox padding isResponsive>
            <Attributes>
              {isRevisionVariant && (
                <AttributesItem title={buildConfigEntityAttributes.name.title}>
                  {serviceContainerBuildConfig.data?.name}
                </AttributesItem>
              )}
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
                {(serviceContainerBuildConfig.data as BuildConfiguration)?.description}
              </AttributesItem>
              <AttributesItem title={buildConfigEntityAttributes.buildType.title}>
                {serviceContainerBuildConfig.data?.buildType && (
                  <BuildConfigBuildTypeLabelMapper buildType={serviceContainerBuildConfig.data.buildType} />
                )}
              </AttributesItem>
              <AttributesItem title={buildConfigEntityAttributes.environment.title}>
                <div className="display-flex flex-wrap align-items-center gap-10">
                  {serviceContainerBuildConfig.data?.environment?.description}
                  {serviceContainerBuildConfig.data?.environment?.deprecated && (
                    <>
                      <WarningLabel hasIcon>Deprecated</WarningLabel>
                      {!isRevisionVariant && (
                        <UpgradeEnvironmentModalButton
                          toggleModal={toggleUpgradeEnvironmentModal}
                          buildConfig={serviceContainerBuildConfig.data as BuildConfiguration}
                        />
                      )}
                    </>
                  )}
                </div>
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
              {serviceContainerProductVersion && (
                <AttributesItem title={buildConfigEntityAttributes.productVersion.title}>
                  {(serviceContainerProductVersion.loading || serviceContainerProductVersion.data !== DataValues.notYetData) && (
                    <ServiceContainerLoading
                      {...serviceContainerProductVersion}
                      variant="inline"
                      title={buildConfigEntityAttributes.productVersion.title}
                    >
                      <ProductVersionLink productVersion={serviceContainerProductVersion.data!} />
                    </ServiceContainerLoading>
                  )}
                </AttributesItem>
              )}
            </Attributes>

            {isRestoreModalOpen && (
              <BuildConfigRestoreModal
                isModalOpen={isRestoreModalOpen}
                toggleModal={toggleRestoreModal}
                buildConfigRevision={serviceContainerBuildConfig.data as BuildConfigurationRevision}
              />
            )}

            {isUpgradeEnvironmentModalOpen && (
              <UpgradeEnvironmentModal
                isModalOpen={isUpgradeEnvironmentModalOpen}
                toggleModal={toggleUpgradeEnvironmentModal}
                buildConfig={serviceContainerBuildConfig.data as BuildConfiguration}
              />
            )}
          </ContentBox>
        </GridItem>

        <GridItem span={12}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title={buildConfigEntityAttributes.parameters.title} />
            </ToolbarItem>
          </Toolbar>
          <ContentBox padding isResponsive>
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
    </ServiceContainerLoading>
  );
};
