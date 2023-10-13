import { CodeBlock, CodeBlockCode, Grid, GridItem, Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { PropsWithChildren, useEffect } from 'react';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { BuildStatuses, buildStatusData } from 'common/buildStatusData';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Username } from 'components/Username/Username';

import * as buildConfigApi from 'services/buildConfigApi';
import * as webConfigService from 'services/webConfigService';

import { areDatesEqual, calculateDuration, createDateTime } from 'utils/utils';

interface INotAvailableBasedOnProps {
  buildStatus: BuildStatuses;
}

/**
 * Displays Something Went Wrong message. When Build failed, displays also warning with tooltip.
 */
const NotAvailableBasedOn = ({ buildStatus }: INotAvailableBasedOnProps) => {
  return (
    <>
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
    </>
  );
};

interface IOnceBuildStartedProps {
  buildStatus: BuildStatuses;
}

/**
 * When Build started, display child content, otherwise not started yet content will be displayed.
 */
const OnceBuildStarted = ({ children, buildStatus }: PropsWithChildren<IOnceBuildStartedProps>) => {
  return buildStatusData[buildStatus].progress === 'PENDING' ? (
    <EmptyStateSymbol text="Build has not started yet" />
  ) : (
    <>{children}</>
  );
};

interface IOnceBuildIsFinishedProps {
  buildStatus: BuildStatuses;
}

/**
 * When Build is finished, display child content, otherwise not ready yet content will be displayed.
 */
const OnceBuildIsFinished = ({ children, buildStatus }: PropsWithChildren<IOnceBuildIsFinishedProps>) => {
  return buildStatusData[buildStatus].progress === 'FINISHED' ? (
    <>{children}</>
  ) : (
    <EmptyStateSymbol text="Build is not finished yet" />
  );
};

export const BuildDetailPage = () => {
  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerBuildConfigRev = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerBuildConfigRevRunner = serviceContainerBuildConfigRev.run;

  useEffect(() => {
    if (serviceContainerBuild.data.buildConfigRevision.id && serviceContainerBuild.data.buildConfigRevision.rev) {
      serviceContainerBuildConfigRevRunner({
        serviceData: {
          buildConfigId: serviceContainerBuild.data.buildConfigRevision.id,
          buildConfigRev: serviceContainerBuild.data.buildConfigRevision.rev,
        },
      });
    }
  }, [serviceContainerBuildConfigRevRunner, serviceContainerBuild.data.buildConfigRevision]);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        {/* Build properties */}
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.status.title}>
              <BuildStatusIcon build={serviceContainerBuild.data} long />
            </AttributesItem>

            <AttributesItem title="Plain Text Log">
              <OnceBuildIsFinished buildStatus={serviceContainerBuild.data.status}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${webConfigService.getPncUrl()}/builds/${serviceContainerBuild.data.id}/logs/build`}
                >
                  view
                </a>
              </OnceBuildIsFinished>
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.id.title} tooltip={buildEntityAttributes.id.tooltip}>
              {serviceContainerBuild.data.id}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['user.username'].title}>
              <Username text={serviceContainerBuild.data.user.username} length={40} />
            </AttributesItem>

            {/* Build times */}
            <AttributesItem title={buildEntityAttributes.submitTime.title}>
              {serviceContainerBuild.data.submitTime && createDateTime({ date: serviceContainerBuild.data.submitTime }).custom}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.startTime.title}>
              {(buildStatusData[serviceContainerBuild.data.status as BuildStatuses].progress !== 'FINISHED' ||
                serviceContainerBuild.data.startTime) && (
                <OnceBuildStarted buildStatus={serviceContainerBuild.data.status}>
                  {serviceContainerBuild.data.startTime &&
                    createDateTime({
                      date: serviceContainerBuild.data.startTime,
                      includeDateInCustom:
                        !serviceContainerBuild.data.submitTime ||
                        !areDatesEqual(serviceContainerBuild.data.submitTime, serviceContainerBuild.data.startTime),
                    }).custom}
                </OnceBuildStarted>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.endTime.title}>
              <OnceBuildIsFinished buildStatus={serviceContainerBuild.data.status}>
                {serviceContainerBuild.data.endTime && (
                  <>
                    {
                      // end (date)time
                      createDateTime({
                        date: serviceContainerBuild.data.endTime,
                        includeDateInCustom:
                          (!!serviceContainerBuild.data.startTime &&
                            !areDatesEqual(serviceContainerBuild.data.startTime, serviceContainerBuild.data.endTime)) ||
                          (!!serviceContainerBuild.data.submitTime &&
                            !areDatesEqual(serviceContainerBuild.data.submitTime, serviceContainerBuild.data.endTime)),
                      }).custom +
                        // duration
                        (serviceContainerBuild.data.startTime
                          ? ` (took ${calculateDuration(
                              serviceContainerBuild.data.startTime,
                              serviceContainerBuild.data.endTime
                            )})`
                          : '')
                    }
                  </>
                )}
              </OnceBuildIsFinished>
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* Build attributes */}
        {serviceContainerBuild.data?.attributes && !!Object.keys(serviceContainerBuild.data.attributes).length && (
          <ContentBox marginTop padding isResponsive>
            <Attributes>
              {Object.keys(serviceContainerBuild.data.attributes).map((attributeKey, index) => (
                <AttributesItem key={index} title={attributeKey}>
                  {serviceContainerBuild.data.attributes[attributeKey]}
                </AttributesItem>
              ))}
            </Attributes>
          </ContentBox>
        )}

        {/* SCM properties */}
        <ContentBox marginTop padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.scmUrl.title}>
              {serviceContainerBuild.data.scmUrl ? (
                /* scmRepository is not available, creating abstract internal repository */
                <ScmRepositoryUrl internalScmRepository={{ id: '0', internalUrl: serviceContainerBuild.data.scmUrl }} />
              ) : (
                <>
                  <NotAvailableBasedOn buildStatus={serviceContainerBuild.data.status} />
                  <ScmRepositoryUrl internalScmRepository={serviceContainerBuild.data.scmRepository} />
                </>
              )}
            </AttributesItem>

            <AttributesItem
              title={buildEntityAttributes['buildConfigRevision.scmRevision'].title}
              tooltip={buildEntityAttributes['buildConfigRevision.scmRevision'].tooltip}
            >
              {serviceContainerBuild.data.buildConfigRevision.scmRevision && (
                <CopyToClipboard isInline>{serviceContainerBuild.data.buildConfigRevision.scmRevision}</CopyToClipboard>
              )}
            </AttributesItem>
            <AttributesItem
              title={buildEntityAttributes.scmBuildConfigRevision.title}
              tooltip={buildEntityAttributes.scmBuildConfigRevision.tooltip}
            >
              {serviceContainerBuild.data.scmBuildConfigRevision && (
                <CopyToClipboard isInline>{serviceContainerBuild.data.scmBuildConfigRevision}</CopyToClipboard>
              )}
            </AttributesItem>
            <AttributesItem title={buildEntityAttributes.scmTag.title} tooltip={buildEntityAttributes.scmTag.tooltip}>
              {serviceContainerBuild.data.scmTag && (
                <CopyToClipboard isInline>{serviceContainerBuild.data.scmTag}</CopyToClipboard>
              )}
            </AttributesItem>
            <AttributesItem title={buildEntityAttributes.scmRevision.title} tooltip={buildEntityAttributes.scmRevision.tooltip}>
              {serviceContainerBuild.data.scmRevision ? (
                <>
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
                </>
              ) : (
                serviceContainerBuild.data.buildConfigRevision.scmRevision && (
                  <>
                    <NotAvailableBasedOn buildStatus={serviceContainerBuild.data.status} />
                    {serviceContainerBuild.data.buildConfigRevision.scmRevision}
                  </>
                )
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* Build Config properties */}
        <ContentBox marginBottom marginTop padding isResponsive>
          <Attributes>
            <AttributesItem title={buildEntityAttributes.buildConfigName.title}>
              <BuildConfigLink
                id={serviceContainerBuild.data.buildConfigRevision.id}
                rev={serviceContainerBuild.data.buildConfigRevision.rev}
              >
                {serviceContainerBuild.data.buildConfigRevision.name}
              </BuildConfigLink>
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes.buildType.title}>
              <BuildConfigBuildTypeLabelMapper buildType={serviceContainerBuild.data.buildConfigRevision.buildType} />
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['environment.description'].title}>
              {serviceContainerBuild.data.environment.description}
            </AttributesItem>
            <AttributesItem title={buildEntityAttributes['buildConfigRevision.buildScript'].title}>
              {serviceContainerBuild.data.buildConfigRevision.buildScript && (
                <CodeBlock>
                  <CodeBlockCode>{serviceContainerBuild.data.buildConfigRevision.buildScript}</CodeBlockCode>
                </CodeBlock>
              )}
            </AttributesItem>

            <AttributesItem title={buildEntityAttributes['buildConfigRevision.brewPullActive'].title}>
              {serviceContainerBuild.data.buildConfigRevision.brewPullActive ? 'enabled' : 'disabled'}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* Build Config parameters */}
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
                {Object.keys(serviceContainerBuildConfigRev.data.parameters).map((parameterKey, index) => (
                  <AttributesItem key={index} title={parameterKey}>
                    <CodeBlock>
                      <CodeBlockCode>{serviceContainerBuildConfigRev.data.parameters[parameterKey]}</CodeBlockCode>
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
    </Grid>
  );
};
