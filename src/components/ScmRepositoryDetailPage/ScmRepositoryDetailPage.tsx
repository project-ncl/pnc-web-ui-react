import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { parseScmRepositoryTitle } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

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

  const attributes = [
    {
      name: (
        <>
          Internal SCM URL
          <TooltipWrapper tooltip="URL to the internal SCM repository, which is the main repository used for the builds." />
        </>
      ),
      value: serviceContainerScmRepository.data?.internalUrl && (
        <ScmRepositoryUrl url={serviceContainerScmRepository.data.internalUrl} showClipboardCopy showGerritButton />
      ),
    },
    {
      name: (
        <>
          External SCM URL
          <TooltipWrapper tooltip="URL to the upstream SCM repository." />
        </>
      ),
      value: serviceContainerScmRepository.data?.externalUrl && (
        <ScmRepositoryUrl url={serviceContainerScmRepository.data.externalUrl} showClipboardCopy />
      ),
    },
    {
      name: (
        <>
          Pre-build Synchronization
          <TooltipWrapper tooltip="Option declaring whether the synchronization (for example adding new commits) from the external repository to the internal repository should happen before each build." />
        </>
      ),
      value:
        serviceContainerScmRepository.data?.preBuildSyncEnabled !== undefined &&
        (serviceContainerScmRepository.data.preBuildSyncEnabled ? 'enabled' : 'disabled'),
    },
  ];

  return (
    <ServiceContainerLoading {...serviceContainerScmRepository} title="SCM Repository details">
      <PageLayout
        title={parseScmRepositoryTitle({ internalUrl: serviceContainerScmRepository.data?.internalUrl })}
        actions={<ActionButton link="#">Edit SCM Repository</ActionButton>}
      >
        <ContentBox padding marginBottom>
          <div className="w-70">
            <AttributesItems attributes={attributes} />
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
