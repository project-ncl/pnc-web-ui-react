import { useEffect } from 'react';

import { RepositoryUrls } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as versionApi from 'services/versionApi';

export const AboutPage = () => {
  const serviceContainerPncVersion = useServiceContainer(versionApi.getPncVersion);
  const serviceContainerPncVersionRunner = serviceContainerPncVersion.run;

  const serviceContainerKafkaVersion = useServiceContainer(versionApi.getKafkaVersion);
  const serviceContainerKafkaVersionRunner = serviceContainerKafkaVersion.run;

  const serviceContainerCausewayVersion = useServiceContainer(versionApi.getCausewayVersion);
  const serviceContainerCausewayVersionRunner = serviceContainerCausewayVersion.run;

  const serviceContainerUiLoggerVersion = useServiceContainer(versionApi.getUiLoggerVersion);
  const serviceContainerUiLoggerVersionRunner = serviceContainerUiLoggerVersion.run;

  const serviceContainerReqourVersion = useServiceContainer(versionApi.getReqourVersion);
  const serviceContainerReqourVersionRunner = serviceContainerReqourVersion.run;

  const serviceContainerBifrostVersion = useServiceContainer(versionApi.getBifrostVersion);
  const serviceContainerBifrostVersionRunner = serviceContainerBifrostVersion.run;

  const serviceContainerDependencyAnalyzerVersion = useServiceContainer(versionApi.getDependencyAnalyzerVersion);
  const serviceContainerDependencyAnalyzerVersionRunner = serviceContainerDependencyAnalyzerVersion.run;

  const serviceContainerBuildDriverVersion = useServiceContainer(versionApi.getBuildDriverVersion);
  const serviceContainerBuildDriverVersionRunner = serviceContainerBuildDriverVersion.run;

  const serviceContainerCleanerVersion = useServiceContainer(versionApi.getCleanerVersion);
  const serviceContainerCleanerVersionRunner = serviceContainerCleanerVersion.run;

  const serviceContainerDeliverableAnalyzerVersion = useServiceContainer(versionApi.getDeliverableAnalyzerVersion);
  const serviceContainerDeliverableAnalyzerVersionRunner = serviceContainerDeliverableAnalyzerVersion.run;

  const serviceContainerEnvironmentDriverVersion = useServiceContainer(versionApi.getEnvironmentDriverVersion);
  const serviceContainerEnvironmentDriverVersionRunner = serviceContainerEnvironmentDriverVersion.run;

  const serviceContainerLogEventDurationVersion = useServiceContainer(versionApi.getLogEventDurationVersion);
  const serviceContainerLogEventDurationVersionRunner = serviceContainerLogEventDurationVersion.run;

  const serviceContainerRepositoryDriverVersion = useServiceContainer(versionApi.getRepositoryDriverVersion);
  const serviceContainerRepositoryDriverVersionRunner = serviceContainerRepositoryDriverVersion.run;

  const serviceContainerRexVersion = useServiceContainer(versionApi.getRexVersion);
  const serviceContainerRexVersionRunner = serviceContainerRexVersion.run;

  const serviceContainerEttVersion = useServiceContainer(versionApi.getEttVersion);
  const serviceContainerEttVersionRunner = serviceContainerEttVersion.run;

  const serviceContainerDingroguVersion = useServiceContainer(versionApi.getDingroguVersion);
  const serviceContainerDingroguVersionRunner = serviceContainerDingroguVersion.run;

  useEffect(() => {
    serviceContainerPncVersionRunner();
    serviceContainerKafkaVersionRunner();
    serviceContainerCausewayVersionRunner();
    serviceContainerUiLoggerVersionRunner();
    serviceContainerReqourVersionRunner();
    serviceContainerBifrostVersionRunner();
    serviceContainerDependencyAnalyzerVersionRunner();
    serviceContainerBuildDriverVersionRunner();
    serviceContainerCleanerVersionRunner();
    serviceContainerDeliverableAnalyzerVersionRunner();
    serviceContainerEnvironmentDriverVersionRunner();
    serviceContainerLogEventDurationVersionRunner();
    serviceContainerRepositoryDriverVersionRunner();
    serviceContainerRexVersionRunner();
    serviceContainerEttVersionRunner();
    serviceContainerDingroguVersionRunner();
  }, [
    serviceContainerPncVersionRunner,
    serviceContainerKafkaVersionRunner,
    serviceContainerCausewayVersionRunner,
    serviceContainerUiLoggerVersionRunner,
    serviceContainerReqourVersionRunner,
    serviceContainerBifrostVersionRunner,
    serviceContainerDependencyAnalyzerVersionRunner,
    serviceContainerBuildDriverVersionRunner,
    serviceContainerCleanerVersionRunner,
    serviceContainerDeliverableAnalyzerVersionRunner,
    serviceContainerEnvironmentDriverVersionRunner,
    serviceContainerLogEventDurationVersionRunner,
    serviceContainerRepositoryDriverVersionRunner,
    serviceContainerRexVersionRunner,
    serviceContainerEttVersionRunner,
    serviceContainerDingroguVersionRunner,
  ]);

  useTitle('About');

  return (
    <PageLayout title="About PNC Build System" description="System for managing, executing and tracking builds">
      <ContentBox padding marginBottom isResponsive title="Version (revision)">
        <Attributes>
          <AttributesItem
            title={
              <a href={RepositoryUrls.pncRepository} target="_blank" rel="noopener noreferrer">
                PNC Build System
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerPncVersion} variant="inline" title="PNC version">
              <VersionText
                version={serviceContainerPncVersion.data?.version}
                revision={serviceContainerPncVersion.data?.commit}
                repositoryUrl={RepositoryUrls.pncRepository}
                builtOn={serviceContainerPncVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>
        </Attributes>
      </ContentBox>

      <ContentBox padding isResponsive title="Other PNC related services versions (revisions)">
        <Attributes>
          <AttributesItem
            title={
              <a href={RepositoryUrls.kafkaRepository} target="_blank" rel="noopener noreferrer">
                Kafka Store
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerKafkaVersion} variant="inline" title="Kafka version">
              <VersionText
                version={serviceContainerKafkaVersion.data?.version}
                revision={serviceContainerKafkaVersion.data?.commit}
                repositoryUrl={RepositoryUrls.kafkaRepository}
                builtOn={serviceContainerKafkaVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.causewayRepository} target="_blank" rel="noopener noreferrer">
                Causeway
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerCausewayVersion} variant="inline" title="Causeway version">
              <VersionText
                version={serviceContainerCausewayVersion.data?.version}
                revision={serviceContainerCausewayVersion.data?.commit}
                repositoryUrl={RepositoryUrls.causewayRepository}
                builtOn={serviceContainerCausewayVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.uiLoggerRepository} target="_blank" rel="noopener noreferrer">
                UI Logger
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerUiLoggerVersion} variant="inline" title="UI Logger version">
              <VersionText
                version={serviceContainerUiLoggerVersion.data?.version}
                revision={serviceContainerUiLoggerVersion.data?.commit}
                repositoryUrl={RepositoryUrls.uiLoggerRepository}
                builtOn={serviceContainerUiLoggerVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.reqourRepository} target="_blank" rel="noopener noreferrer">
                Reqour
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerReqourVersion} variant="inline" title="Reqour version">
              <VersionText
                version={serviceContainerReqourVersion.data?.version}
                revision={serviceContainerReqourVersion.data?.commit}
                repositoryUrl={RepositoryUrls.reqourRepository}
                builtOn={serviceContainerReqourVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.bifrostRepository} target="_blank" rel="noopener noreferrer">
                Bifrost
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerBifrostVersion} variant="inline" title="Bifrost version">
              <VersionText
                version={serviceContainerBifrostVersion.data?.version}
                revision={serviceContainerBifrostVersion.data?.commit}
                repositoryUrl={RepositoryUrls.bifrostRepository}
                builtOn={serviceContainerBifrostVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.dependencyAnalyzerRepository} target="_blank" rel="noopener noreferrer">
                Dependency Analyzer
              </a>
            }
          >
            <ServiceContainerLoading
              {...serviceContainerDependencyAnalyzerVersion}
              variant="inline"
              title="Dependency Analyzer version"
            >
              <VersionText
                version={serviceContainerDependencyAnalyzerVersion.data?.version}
                revision={serviceContainerDependencyAnalyzerVersion.data?.commit}
                repositoryUrl={RepositoryUrls.dependencyAnalyzerRepository}
                builtOn={serviceContainerDependencyAnalyzerVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.buildDriverRepository} target="_blank" rel="noopener noreferrer">
                Build Driver
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerBuildDriverVersion} variant="inline" title="Build Driver version">
              <VersionText
                version={serviceContainerBuildDriverVersion.data?.version}
                revision={serviceContainerBuildDriverVersion.data?.commit}
                repositoryUrl={RepositoryUrls.buildDriverRepository}
                builtOn={serviceContainerBuildDriverVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.cleanerRepository} target="_blank" rel="noopener noreferrer">
                Cleaner
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerCleanerVersion} variant="inline" title="Cleaner version">
              <VersionText
                version={serviceContainerCleanerVersion.data?.version}
                revision={serviceContainerCleanerVersion.data?.commit}
                repositoryUrl={RepositoryUrls.cleanerRepository}
                builtOn={serviceContainerCleanerVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.deliverableAnalyzerRepository} target="_blank" rel="noopener noreferrer">
                Deliverable Analyzer
              </a>
            }
          >
            <ServiceContainerLoading
              {...serviceContainerDeliverableAnalyzerVersion}
              variant="inline"
              title="Deliverable Analyzer version"
            >
              <VersionText
                version={serviceContainerDeliverableAnalyzerVersion.data?.version}
                revision={serviceContainerDeliverableAnalyzerVersion.data?.commit}
                repositoryUrl={RepositoryUrls.deliverableAnalyzerRepository}
                builtOn={serviceContainerDeliverableAnalyzerVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.environmentDriverRepository} target="_blank" rel="noopener noreferrer">
                Environment Driver
              </a>
            }
          >
            <ServiceContainerLoading
              {...serviceContainerEnvironmentDriverVersion}
              variant="inline"
              title="Environment Driver version"
            >
              <VersionText
                version={serviceContainerEnvironmentDriverVersion.data?.version}
                revision={serviceContainerEnvironmentDriverVersion.data?.commit}
                repositoryUrl={RepositoryUrls.environmentDriverRepository}
                builtOn={serviceContainerEnvironmentDriverVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.logEventDurationRepository} target="_blank" rel="noopener noreferrer">
                Log Event Duration
              </a>
            }
          >
            <ServiceContainerLoading
              {...serviceContainerLogEventDurationVersion}
              variant="inline"
              title="Log Event Duration version"
            >
              <VersionText
                version={serviceContainerLogEventDurationVersion.data?.version}
                revision={serviceContainerLogEventDurationVersion.data?.commit}
                repositoryUrl={RepositoryUrls.logEventDurationRepository}
                builtOn={serviceContainerLogEventDurationVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.repositoryDriverRepository} target="_blank" rel="noopener noreferrer">
                Repository Driver
              </a>
            }
          >
            <ServiceContainerLoading
              {...serviceContainerRepositoryDriverVersion}
              variant="inline"
              title="Repository Driver version"
            >
              <VersionText
                version={serviceContainerRepositoryDriverVersion.data?.version}
                revision={serviceContainerRepositoryDriverVersion.data?.commit}
                repositoryUrl={RepositoryUrls.repositoryDriverRepository}
                builtOn={serviceContainerRepositoryDriverVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.rexRepository} target="_blank" rel="noopener noreferrer">
                Rex
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerRexVersion} variant="inline" title="Rex version">
              <VersionText
                version={serviceContainerRexVersion.data?.version}
                revision={serviceContainerRexVersion.data?.commit}
                repositoryUrl={RepositoryUrls.rexRepository}
                builtOn={serviceContainerRexVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem title="ETT">
            <ServiceContainerLoading {...serviceContainerEttVersion} variant="inline" title="ETT version">
              <VersionText
                version={serviceContainerEttVersion.data?.version}
                revision={serviceContainerEttVersion.data?.commit}
                builtOn={serviceContainerEttVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>

          <AttributesItem
            title={
              <a href={RepositoryUrls.dingroguRepository} target="_blank" rel="noopener noreferrer">
                Dingrogu
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerDingroguVersion} variant="inline" title="Dingrogu version">
              <VersionText
                version={serviceContainerDingroguVersion.data?.version}
                revision={serviceContainerDingroguVersion.data?.commit}
                repositoryUrl={RepositoryUrls.dingroguRepository}
                builtOn={serviceContainerDingroguVersion.data?.builtOn}
              />
            </ServiceContainerLoading>
          </AttributesItem>
        </Attributes>
      </ContentBox>
    </PageLayout>
  );
};

interface IVersionText {
  version?: string;
  revision?: string;
  repositoryUrl?: string;
  builtOn?: string;
}

const VersionText = ({ version, revision, repositoryUrl, builtOn }: IVersionText) => (
  <>
    {version || <EmptyStateSymbol text={false} title="Version" />} (
    {(revision && repositoryUrl && (
      <a href={`${repositoryUrl}/tree/${revision}`} target="_blank" rel="noopener noreferrer">
        {revision}
      </a>
    )) ||
      revision || <EmptyStateSymbol text={false} title="Revision" />}
    )
    {builtOn && (
      <>
        , built on <DateTime date={builtOn} />
      </>
    )}
  </>
);
