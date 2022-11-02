import { Card, CardBody } from '@patternfly/react-core';

const toolbarStyle = { marginBottom: '15px' };

interface IToolbarProps {}

export const Toolbar = ({ children }: React.PropsWithChildren<IToolbarProps>) => (
  <Card style={toolbarStyle}>
    <CardBody>{children}</CardBody>
  </Card>
);
