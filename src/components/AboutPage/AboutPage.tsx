import { useEffect } from 'react';

import { RepositoryUrls } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';

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

  const serviceContainerUiLoggerVersion = useServiceContainer(versionApi.getUiLoggerVersion);
  const serviceContainerUiLoggerVersionRunner = serviceContainerUiLoggerVersion.run;

  const serviceContainerRepourVersion = useServiceContainer(versionApi.getRepourVersion);
  const serviceContainerRepourVersionRunner = serviceContainerRepourVersion.run;

  const serviceContainerBifrostVersion = useServiceContainer(versionApi.getBifrostVersion);
  const serviceContainerBifrostVersionRunner = serviceContainerBifrostVersion.run;

  const serviceContainerDependencyAnalyzerVersion = useServiceContainer(versionApi.getDependencyAnalyzerVersion);
  const serviceContainerDependencyAnalyzerVersionRunner = serviceContainerDependencyAnalyzerVersion.run;

  useEffect(() => {
    serviceContainerPncVersionRunner();
    serviceContainerKafkaVersionRunner();
    serviceContainerUiLoggerVersionRunner();
    serviceContainerRepourVersionRunner();
    serviceContainerBifrostVersionRunner();
    serviceContainerDependencyAnalyzerVersionRunner();
  }, [
    serviceContainerPncVersionRunner,
    serviceContainerKafkaVersionRunner,
    serviceContainerUiLoggerVersionRunner,
    serviceContainerRepourVersionRunner,
    serviceContainerBifrostVersionRunner,
    serviceContainerDependencyAnalyzerVersionRunner,
  ]);

  return (
    <PageLayout title="About PNC Build System" description="System for managing, executing and tracking builds">
      <ContentBox padding marginBottom isResponsive title="Services Versions (Revisions)">
        <Attributes>
          <AttributesItem
            title={
              <a href={RepositoryUrls.pncRepository} target="_blank" rel="noopener noreferrer">
                PNC System
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

          <AttributesItem
            title={
              <a href={RepositoryUrls.pncWebUiRepository} target="_blank" rel="noopener noreferrer">
                PNC Web UI
              </a>
            }
          >
            <VersionText
              version={process.env.REACT_APP_VERSION}
              revision={process.env.REACT_APP_GIT_SHORT_SHA}
              repositoryUrl={RepositoryUrls.pncWebUiRepository}
            />
          </AttributesItem>

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
              <a href={RepositoryUrls.repourRepository} target="_blank" rel="noopener noreferrer">
                Repour
              </a>
            }
          >
            <ServiceContainerLoading {...serviceContainerRepourVersion} variant="inline" title="Repour version">
              <VersionText
                version={serviceContainerRepourVersion.data?.version}
                revision={serviceContainerRepourVersion.data?.commit}
                repositoryUrl={RepositoryUrls.repourRepository}
                builtOn={serviceContainerRepourVersion.data?.builtOn}
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
