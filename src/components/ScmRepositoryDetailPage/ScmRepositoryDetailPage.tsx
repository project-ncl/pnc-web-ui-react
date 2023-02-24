import { Button, ClipboardCopy, Split, SplitItem, Text, TextContent, TextVariants, Tooltip } from '@patternfly/react-core';
import { ExternalLinkAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

export const ScmRepositoryDetailPage = () => {
  const { scmRepositoryId } = useParams();

  const serviceContainerScmRepository = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerScmRepositoryRunner = serviceContainerScmRepository.run;

  useEffect(() => {
    serviceContainerScmRepositoryRunner({ serviceData: { id: scmRepositoryId } });
  }, [serviceContainerScmRepositoryRunner, scmRepositoryId]);

  useTitle(
    serviceContainerScmRepository.data?.id
      ? `${serviceContainerScmRepository.data.id} | ${PageTitles.repositories}`
      : `Error loading ${PageTitles.projectDetail}`
  );

  const internalScmRepositoryLink = (internalUrl: string) => {
    /**
     * Parses internal repo url to Gerrit gitweb link of the project
     */
    const parseInternalRepoLink = (url: string) => {
      let protocol = url.split('://')[0];
      let base = url.split('://')[1].split('/')[0];
      let project = url.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
      return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
    };
    return (
      <div>
        <Split hasGutter>
          <SplitItem isFilled>
            <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" maxWidth="200px">
              {internalUrl}
            </ClipboardCopy>
          </SplitItem>
          <SplitItem>
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
          </SplitItem>
        </Split>
      </div>
    );
  };

  const parseScmRepositoryTitle = (internalUrl: string) => (internalUrl ? internalUrl.split('/').splice(3).join('/') : '');

  const attributes = [
    {
      name: (
        <span>
          Internal SCM URL{' '}
          <Tooltip removeFindDomNode content={<div>URL of the internal SCM from Gerrit</div>}>
            <InfoCircleIcon />
          </Tooltip>
        </span>
      ),
      value: serviceContainerScmRepository.data?.internalUrl
        ? internalScmRepositoryLink(serviceContainerScmRepository.data?.internalUrl)
        : undefined,
    },
    {
      name: (
        <span>
          External SCM URL{' '}
          <Tooltip removeFindDomNode content="URL of the external SCM">
            <InfoCircleIcon />
          </Tooltip>
        </span>
      ),
      value: serviceContainerScmRepository.data?.externalUrl ? (
        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
          {serviceContainerScmRepository.data?.externalUrl}
        </ClipboardCopy>
      ) : undefined,
    },
    {
      name: (
        <span>
          Pre-build Sync{' '}
          <Tooltip
            removeFindDomNode
            content={<div>Whether the internal repository will be automatically updated just before each build</div>}
          >
            <InfoCircleIcon />
          </Tooltip>
        </span>
      ),
      value: serviceContainerScmRepository.data?.preBuildSyncEnabled ? 'enabled' : 'disabled',
    },
  ];

  return (
    <ServiceContainerLoading {...serviceContainerScmRepository} title="SCM Repository details">
      <PageLayout
        title={parseScmRepositoryTitle(serviceContainerScmRepository.data?.internalUrl)}
        description={serviceContainerScmRepository.data?.description}
        actions={<ActionButton link="#">Edit SCM Repository</ActionButton>}
      >
        <ContentBox padding marginBottom>
          <AttributesItems attributes={attributes} />
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
