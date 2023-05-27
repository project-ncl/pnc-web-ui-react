import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { generatePageTitle } from 'utils/titleHelper';

export const ScmRepositoryDetailPage = () => {
  const { scmRepositoryId } = useParams();

  const serviceContainerScmRepository = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerScmRepositoryRunner = serviceContainerScmRepository.run;

  useEffect(() => {
    serviceContainerScmRepositoryRunner({ serviceData: { id: scmRepositoryId } });
  }, [serviceContainerScmRepositoryRunner, scmRepositoryId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerScmRepository,
      entityName: serviceContainerScmRepository.data?.id,
      firstLevelEntity: 'SCM Repository',
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerScmRepository} title="SCM Repository details">
      <PageLayout
        title={generateScmRepositoryName({ scmRepository: serviceContainerScmRepository.data })}
        actions={<ActionButton link="#">Edit SCM Repository</ActionButton>}
      >
        <ContentBox padding marginBottom>
          <div className="w-70">
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
          </div>
        </ContentBox>

        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Usages</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop>
          <div style={{ width: '100%', height: '30vh', textAlign: 'center', paddingTop: '30px' }}>
            TODO: Add Usages table here and remove the placeholder
          </div>
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
