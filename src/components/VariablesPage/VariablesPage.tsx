import { CodeBlock, CodeBlockCode, Flex, FlexItem, ToolbarItem } from '@patternfly/react-core';

import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as webConfigService from 'services/webConfigService';

// ENVIRONMENTS
const ProcessEnv = () => <>{JSON.stringify(import.meta.env, null, 2)}</>;

//  WEB CONFIG
const WebConfig = () => {
  const webConfig = webConfigService.getWebConfig();
  return <>{JSON.stringify(webConfig, null, 2)}</>;
};

export const VariablesPage = () => {
  useTitle('Variables');
  return (
    <PageLayout title="Variables" description="Variables page intended for administrators and debugging purposes.">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="import.meta.env" />
            </ToolbarItem>
          </Toolbar>
          <ContentBox marginBottom>
            <CodeBlock>
              <CodeBlockCode id="import-meta-env">
                <ProcessEnv />
              </CodeBlockCode>
            </CodeBlock>
          </ContentBox>
        </FlexItem>

        <FlexItem>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Web Config" />
            </ToolbarItem>
          </Toolbar>
          <ContentBox>
            <CodeBlock>
              <CodeBlockCode id="web-config">
                <WebConfig />
              </CodeBlockCode>
            </CodeBlock>
          </ContentBox>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
