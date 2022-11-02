import { Card, CardBody } from '@patternfly/react-core';

const listToolbarStyle = { marginBottom: '15px' };

interface IListToolbarProps {}

export const ListToolbar = ({ children }: React.PropsWithChildren<IListToolbarProps>) => (
  <Card style={listToolbarStyle}>
    <CardBody>{children}</CardBody>
  </Card>
);
