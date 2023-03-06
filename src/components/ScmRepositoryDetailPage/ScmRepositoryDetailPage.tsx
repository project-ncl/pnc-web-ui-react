import { Button, ClipboardCopy, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipText } from 'components/TooltipText/TooltipText';

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

  const InternalScmRepositoryLink = (internalUrl: string) => {
    /**
     * Parses internal repo url to Gerrit gitweb link of the project
     */
    const parseInternalRepoLink = (url: string) => {
      const protocol = url.split('://')[0];
      const base = url.split('://')[1].split('/')[0];
      const project = url.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
      return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
    };
    return (
      <CopyToClipboard
        suffixComponent={
          <Button
            component="a"
            href={parseInternalRepoLink(internalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            variant="tertiary"
            icon={<ExternalLinkAltIcon />}
          >
            Gerrit
          </Button>
        }
      >
        {parseInternalRepoLink(internalUrl)}
      </CopyToClipboard>
    );
  };

  const parseScmRepositoryTitle = (internalUrl: string) => (internalUrl ? internalUrl.split('/').splice(3).join('/') : '');

  const attributes = [
    {
      key: 'InternalScmUrl',
      name: (
        <TooltipText tooltip="URL to the internal SCM repository, which is the main repository used for the builds.">
          Internal SCM URL
        </TooltipText>
      ),
      value:
        serviceContainerScmRepository.data?.internalUrl &&
        InternalScmRepositoryLink(serviceContainerScmRepository.data?.internalUrl),
    },
    {
      key: 'ExternalScmUrl',
      name: <TooltipText tooltip="URL to the upstream SCM repository.">External SCM URL</TooltipText>,
      value: serviceContainerScmRepository.data?.externalUrl && (
        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
          {serviceContainerScmRepository.data?.externalUrl}
        </ClipboardCopy>
      ),
    },
    {
      key: 'PrebuildSync',
      name: (
        <TooltipText tooltip="Option declaring whether the synchronization (for example adding new commits) from the external repository to the internal repository should happen before each build.">
          Pre-build Synchronization
        </TooltipText>
      ),
      value: serviceContainerScmRepository.data?.preBuildSyncEnabled ? 'enabled' : 'disabled',
    },
  ];

  return (
    <ServiceContainerLoading {...serviceContainerScmRepository} title="SCM Repository details">
      <PageLayout
        title={parseScmRepositoryTitle(serviceContainerScmRepository.data?.internalUrl)}
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
