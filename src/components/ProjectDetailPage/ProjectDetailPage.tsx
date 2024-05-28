import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';

import { breadcrumbData } from 'common/breadcrumbData';
import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { projectEntityAttributes } from 'common/projectEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as projectApi from 'services/projectApi';

import { generatePageTitle } from 'utils/titleHelper';

const buildConfigsListColumns = [
  buildConfigEntityAttributes.name.id,
  buildConfigEntityAttributes.buildType.id,
  buildConfigEntityAttributes.creationTime.id,
  buildConfigEntityAttributes.modificationTime.id,
  buildConfigEntityAttributes.buildStatus.id,
];

interface IProjectDetailPageProps {
  componentId?: string;
}

export const ProjectDetailPage = ({ componentId = 'c1' }: IProjectDetailPageProps) => {
  const { projectId } = useParamsRequired();

  const serviceContainerProject = useServiceContainer(projectApi.getProject);
  const serviceContainerProjectRunner = serviceContainerProject.run;

  const serviceContainerBuildConfigs = useServiceContainer(projectApi.getBuildConfigsWithLatestBuild);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useEffect(() => {
    serviceContainerProjectRunner({ serviceData: { id: projectId } });
  }, [serviceContainerProjectRunner, projectId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildConfigsRunner({ serviceData: { id: projectId }, requestConfig }),
    { componentId }
  );

  useTitle(generatePageTitle({ serviceContainer: serviceContainerProject, firstLevelEntity: 'Project' }));

  return (
    <PageLayout
      title={
        <ServiceContainerLoading {...serviceContainerProject} title="Project details" variant="icon">
          {serviceContainerProject.data?.name}
        </ServiceContainerLoading>
      }
      description={serviceContainerProject.data?.description}
      breadcrumbs={[{ entity: breadcrumbData.project.id, title: serviceContainerProject.data?.name }]}
      actions={
        <ProtectedComponent>
          <ActionButton link="edit">Edit Project</ActionButton>
        </ProtectedComponent>
      }
    >
      <ContentBox padding marginBottom>
        <ServiceContainerLoading {...serviceContainerProject} title="Project details">
          <Attributes>
            <AttributesItem title={projectEntityAttributes.projectUrl.title}>
              {serviceContainerProject.data?.projectUrl && (
                <a href={serviceContainerProject.data?.projectUrl} target="_blank" rel="noopener noreferrer">
                  {serviceContainerProject.data?.projectUrl}
                </a>
              )}
            </AttributesItem>
            <AttributesItem title={projectEntityAttributes.issueTrackerUrl.title}>
              {serviceContainerProject.data?.issueTrackerUrl && (
                <a href={serviceContainerProject.data?.issueTrackerUrl} target="_blank" rel="noopener noreferrer">
                  {serviceContainerProject.data?.issueTrackerUrl}
                </a>
              )}
            </AttributesItem>
            <AttributesItem title={projectEntityAttributes.engineeringTeam.title}>
              {serviceContainerProject.data?.engineeringTeam}
            </AttributesItem>
            <AttributesItem title={projectEntityAttributes.technicalLeader.title}>
              {serviceContainerProject.data?.technicalLeader}
            </AttributesItem>
          </Attributes>
        </ServiceContainerLoading>
      </ContentBox>

      <Toolbar borderBottom>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Build Configs</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton link="build-configs/create">Create Build Config</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId, columns: buildConfigsListColumns }} />
    </PageLayout>
  );
};
