import { Card, CardBody, CardTitle, CodeBlock, CodeBlockCode, Flex, FlexItem } from '@patternfly/react-core';

import { useTitle } from '../../containers/useTitle';

import * as WebConfigAPI from '../../services/WebConfigService';

import { PageLayout } from '../PageLayout/PageLayout';

// ENVIRONMENTS
const ProcessEnv = () => <>{JSON.stringify(process.env, null, 2)}</>;

//  WEB CONFIG
const WebConfig = () => {
  const webConfig = WebConfigAPI.getWebConfig();
  return <>{JSON.stringify(webConfig, null, 2)}</>;
};

export const VariablesPage = () => {
  useTitle('Variables');
  return (
    <PageLayout title="Variables" description="Variables page intended for administrators and debugging purposes.">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Card>
            <CardTitle>process.env</CardTitle>
            <CardBody>
              <CodeBlock>
                <CodeBlockCode id="process-env">
                  <ProcessEnv />
                </CodeBlockCode>
              </CodeBlock>
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>Web Config</CardTitle>
            <CardBody>
              <CodeBlock>
                <CodeBlockCode id="web-config">
                  <WebConfig />
                </CodeBlockCode>
              </CodeBlock>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
