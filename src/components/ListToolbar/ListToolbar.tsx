import { Card, CardBody } from '@patternfly/react-core';

const ListToolbarStyle = { marginBottom: '15px' };

interface IListToolbarProps {}

export const ListToolbar = ({ children }: React.PropsWithChildren<IListToolbarProps>) => (
  <Card style={ListToolbarStyle}>
    <CardBody>{children}</CardBody>
  </Card>
);
