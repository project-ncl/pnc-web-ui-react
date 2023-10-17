import { CodeBlock, CodeBlockCode, Grid, GridItem, Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { PropsWithChildren, useEffect } from 'react';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { BuildStatus, buildStatusData } from 'common/buildStatusData';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { DateTime } from 'components/DateTime/DateTime';
import { DependencyTree } from 'components/DependencyTree/DependencyTree';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Username } from 'components/Username/Username';

import * as buildConfigApi from 'services/buildConfigApi';
import * as webConfigService from 'services/webConfigService';

import { calculateDuration } from 'utils/utils';

interface INotAvailableBasedOnProps {
  buildStatus: BuildStatus;
}

/**
 * Displays Something Went Wrong message. When Build failed, displays also warning with tooltip.
 */
const NotAvailableBasedOn = ({ buildStatus }: INotAvailableBasedOnProps) => (
  <span
    title={
      buildStatusData[buildStatus].failed
        ? 'Something went wrong, probably during alignment process, you should check alignment logs for more details.'
        : ''
    }
  >
    {buildStatusData[buildStatus].failed && (
      <>
        <ExclamationTriangleIcon />
        &nbsp;
      </>
    )}
    <EmptyStateSymbol text="Not available, based on:" />
  </span>
);

interface IOnceBuildStartedProps {
  buildStatus: BuildStatus;
}

/**
 * When Build started, display child content, otherwise not started yet content will be displayed.
 */
const OnceBuildStarted = ({ children, buildStatus }: PropsWithChildren<IOnceBuildStartedProps>) =>
  buildStatusData[buildStatus].progress === 'PENDING' ? <EmptyStateSymbol text="Build has not started yet" /> : <>{children}</>;

interface IOnceBuildIsFinishedProps {
  buildStatus: BuildStatus;
}

/**
 * When Build is finished, display child content, otherwise not ready yet content will be displayed.
 */
const OnceBuildIsFinished = ({ children, buildStatus }: PropsWithChildren<IOnceBuildIsFinishedProps>) =>
  buildStatusData[buildStatus].progress === 'FINISHED' ? <>{children}</> : <EmptyStateSymbol text="Build is not finished yet" />;

export const BuildDetailPage = () => {
  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerBuildConfigRev = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerBuildConfigRevRunner = serviceContainerBuildConfigRev.run;

  useEffect(() => {
    if (serviceContainerBuild.data?.buildConfigRevision?.id && serviceContainerBuild.data?.buildConfigRevision.rev) {
      serviceContainerBuildConfigRevRunner({
        serviceData: {
          buildConfigId: serviceContainerBuild.data.buildConfigRevision.id,
          buildConfigRev: serviceContainerBuild.data.buildConfigRevision.rev,
        },
      });
    }
  }, [serviceContainerBuildConfigRevRunner, serviceContainerBuild.data?.buildConfigRevision]);

  return (
    <Grid hasGutter>
      {/* Build properties */}
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.status.title}>
              <BuildStatusIcon build={serviceContainerBuild.data!} long />
            </AttributesItem>

            <AttributesItem title="Plain Text Log">
              {serviceContainerBuild.data?.status && (
                <OnceBuildIsFinished buildStatus={serviceContainerBuild.data.status}>
                  <BuildLogLink buildId={serviceContainerBuild.data.id} />
                </OnceBuildIsFinished>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.id.title} tooltip={buildEntityAttributes.id.tooltip}>
              {serviceContainerBuild.data?.id}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['user.username'].title}>
              {serviceContainerBuild.data?.user?.username && (
                <Username text={serviceContainerBuild.data.user.username} length={40} />
              )}
            </AttributesItem>

            {/* Build times */}
            <AttributesItem title={buildEntityAttributes.submitTime.title}>
              {serviceContainerBuild.data?.submitTime && <DateTime date={serviceContainerBuild.data.submitTime} />}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.startTime.title}>
              {(buildStatusData[serviceContainerBuild.data?.status as BuildStatus].progress !== 'FINISHED' ||
                serviceContainerBuild.data?.startTime) &&
                serviceContainerBuild.data?.status && (
                  <OnceBuildStarted buildStatus={serviceContainerBuild.data.status}>
                    {serviceContainerBuild.data?.startTime && <DateTime date={serviceContainerBuild.data.startTime} />}
                  </OnceBuildStarted>
                )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.endTime.title}>
              {serviceContainerBuild.data?.status && (
                <OnceBuildIsFinished buildStatus={serviceContainerBuild.data.status}>
                  {serviceContainerBuild.data.endTime && (
                    <>
                      {/* end (date)time */}
                      <DateTime date={serviceContainerBuild.data.endTime} />
                      {
                        // duration
                        serviceContainerBuild.data.startTime &&
                          ` (took ${calculateDuration(serviceContainerBuild.data.startTime, serviceContainerBuild.data.endTime)})`
                      }
                    </>
                  )}
                </OnceBuildIsFinished>
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      {/* Build attributes */}
      {serviceContainerBuild.data?.attributes && !!Object.keys(serviceContainerBuild.data.attributes).length && (
        <GridItem span={12}>
          <ContentBox padding isResponsive>
            <Attributes>
              {Object.entries(serviceContainerBuild.data.attributes).map(([attributeKey, attribute], index) => (
                <AttributesItem key={index} title={attributeKey}>
                  {attribute}
                </AttributesItem>
              ))}
            </Attributes>
          </ContentBox>
        </GridItem>
      )}

      {/* SCM properties */}
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.scmUrl.title}>
              {serviceContainerBuild.data?.scmUrl ? (
                /* scmRepository is not available, creating abstract internal repository */
                <ScmRepositoryUrl internalScmRepository={{ id: '0', internalUrl: serviceContainerBuild.data.scmUrl }} />
              ) : (
                <>
                  {serviceContainerBuild.data?.status && <NotAvailableBasedOn buildStatus={serviceContainerBuild.data.status} />}
                  {serviceContainerBuild.data?.scmRepository && (
                    <ScmRepositoryUrl internalScmRepository={serviceContainerBuild.data.scmRepository} />
                  )}
                </>
              )}
            </AttributesItem>

            <AttributesItem
              title={buildEntityAttributes['buildConfigRevision.scmRevision'].title}
              tooltip={buildEntityAttributes['buildConfigRevision.scmRevision'].tooltip}
            >
              {serviceContainerBuild.data?.buildConfigRevision?.scmRevision && (
                <CopyToClipboard isInline>{serviceContainerBuild.data.buildConfigRevision.scmRevision}</CopyToClipboard>
              )}
            </AttributesItem>

            <AttributesItem
              title={buildEntityAttributes.scmBuildConfigRevision.title}
              tooltip={buildEntityAttributes.scmBuildConfigRevision.tooltip}
            >
              {(serviceContainerBuild.data as any)?.scmBuildConfigRevision && (
                <CopyToClipboard isInline>{(serviceContainerBuild.data as any).scmBuildConfigRevision}</CopyToClipboard>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.scmTag.title} tooltip={buildEntityAttributes.scmTag.tooltip}>
              {serviceContainerBuild.data?.scmTag && (
                <CopyToClipboard isInline>{serviceContainerBuild.data.scmTag}</CopyToClipboard>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.scmRevision.title} tooltip={buildEntityAttributes.scmRevision.tooltip}>
              {serviceContainerBuild.data?.scmRevision ? (
                <CopyToClipboard
                  isInline
                  suffixComponent={
                    <>
                      [
                      <a href={`${webConfigService.getPncUrl()}/builds/${serviceContainerBuild.data.id}/scm-archive`}>
                        Download Source Code Tarball
                      </a>
                      ]
                    </>
                  }
                >
                  {serviceContainerBuild.data.scmRevision}
                </CopyToClipboard>
              ) : (
                serviceContainerBuild.data?.buildConfigRevision?.scmRevision && (
                  <>
                    {serviceContainerBuild.data?.status && (
                      <NotAvailableBasedOn buildStatus={serviceContainerBuild.data.status} />
                    )}
                    {serviceContainerBuild.data.buildConfigRevision.scmRevision}
                  </>
                )
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      {/* Build Config properties */}
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.buildConfigName.title}>
              {serviceContainerBuild.data?.buildConfigRevision && (
                <BuildConfigLink
                  id={serviceContainerBuild.data.buildConfigRevision.id}
                  rev={serviceContainerBuild.data.buildConfigRevision.rev}
                >
                  {serviceContainerBuild.data.buildConfigRevision.name}
                </BuildConfigLink>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['buildConfigRevision.buildType'].title}>
              {serviceContainerBuild.data?.buildConfigRevision?.buildType && (
                <BuildConfigBuildTypeLabelMapper buildType={serviceContainerBuild.data.buildConfigRevision.buildType} />
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['environment.description'].title}>
              {serviceContainerBuild.data?.environment?.description}
            </AttributesItem>
            <AttributesItem title={buildEntityAttributes['buildConfigRevision.buildScript'].title}>
              {serviceContainerBuild.data?.buildConfigRevision?.buildScript && (
                <CodeBlock>
                  <CodeBlockCode>{serviceContainerBuild.data.buildConfigRevision.buildScript}</CodeBlockCode>
                </CodeBlock>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['buildConfigRevision.brewPullActive'].title}>
              {serviceContainerBuild.data?.buildConfigRevision?.brewPullActive ? 'enabled' : 'disabled'}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      {/* Build Config parameters */}
      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>{buildEntityAttributes.parameters.title}</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop padding isResponsive>
          <ServiceContainerLoading {...serviceContainerBuildConfigRev} title="Build Config Revision parameters">
            {serviceContainerBuildConfigRev.data?.parameters &&
            Object.keys(serviceContainerBuildConfigRev.data.parameters).length ? (
              <Attributes>
                {Object.entries(serviceContainerBuildConfigRev.data.parameters).map(([parameterKey, parameter], index) => (
                  <AttributesItem key={index} title={parameterKey}>
                    <CodeBlock>
                      <CodeBlockCode>{parameter}</CodeBlockCode>
                    </CodeBlock>
                  </AttributesItem>
                ))}
              </Attributes>
            ) : (
              <EmptyStateSymbol />
            )}
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Dependency Tree</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop padding isResponsive>
          <DependencyTree build={serviceContainerBuild.data!} />
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
