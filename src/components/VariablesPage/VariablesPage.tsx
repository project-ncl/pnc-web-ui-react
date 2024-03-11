import { CodeBlock, CodeBlockCode, Flex, FlexItem } from '@patternfly/react-core';

import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';

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
          <ContentBox padding title="import.meta.env">
            <CodeBlock>
              <CodeBlockCode id="import.meta.env">
                <ProcessEnv />
              </CodeBlockCode>
            </CodeBlock>
          </ContentBox>
        </FlexItem>

        <FlexItem>
          <ContentBox padding title="Web Config">
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
