import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { generatePageTitle } from 'utils/titleHelper';

interface IScmRepositoryDetailPageProps {
  componentId?: string;
}

export const ScmRepositoryDetailPage = ({ componentId = 's2' }: IScmRepositoryDetailPageProps) => {
  const { scmRepositoryId } = useParams();

  const serviceContainerScmRepository = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerScmRepositoryRunner = serviceContainerScmRepository.run;

  const serviceContainerBuildConfigs = useServiceContainer(scmRepositoryApi.getBuildConfigsWithLatestBuild);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useEffect(() => {
    serviceContainerScmRepositoryRunner({ serviceData: { id: scmRepositoryId } });
  }, [serviceContainerScmRepositoryRunner, scmRepositoryId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildConfigsRunner({ serviceData: { scmRepositoryId }, requestConfig }),
    { componentId }
  );
  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerScmRepository,
      entityName: generateScmRepositoryName({ scmRepository: serviceContainerScmRepository.data }),
      firstLevelEntity: 'SCM Repository',
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerScmRepository} title="SCM Repository details">
      <PageLayout
        title={generateScmRepositoryName({ scmRepository: serviceContainerScmRepository.data })}
        actions={<ActionButton link="edit">Edit SCM Repository</ActionButton>}
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem
              title={scmRepositoryEntityAttributes.internalUrl.title}
              tooltip={scmRepositoryEntityAttributes.internalUrl.tooltip}
            >
              {serviceContainerScmRepository.data?.internalUrl && (
                <ScmRepositoryUrl internalScmRepository={serviceContainerScmRepository.data} />
              )}
            </AttributesItem>
            <AttributesItem
              title={scmRepositoryEntityAttributes.externalUrl.title}
              tooltip={scmRepositoryEntityAttributes.externalUrl.tooltip}
            >
              {serviceContainerScmRepository.data?.externalUrl && (
                <ScmRepositoryUrl externalScmRepository={serviceContainerScmRepository.data} />
              )}
            </AttributesItem>
            <AttributesItem
              title={scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
              tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip}
            >
              {serviceContainerScmRepository.data?.preBuildSyncEnabled !== undefined &&
                (serviceContainerScmRepository.data.preBuildSyncEnabled ? 'enabled' : 'disabled')}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar borderBottom>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Usages</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>

        <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};
