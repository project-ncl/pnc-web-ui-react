import { Card, CardBody, Flex, FlexProps } from '@patternfly/react-core';

const toolbarStyle = { marginBottom: '15px' };

const flexSpaceItems: FlexProps['spaceItems'] = { default: 'spaceItems2xl' };

interface IToolbarProps {}

export const Toolbar = ({ children }: React.PropsWithChildren<IToolbarProps>) => (
  <Card style={toolbarStyle}>
    <CardBody>
      <Flex spaceItems={flexSpaceItems}>{children}</Flex>
    </CardBody>
  </Card>
);
