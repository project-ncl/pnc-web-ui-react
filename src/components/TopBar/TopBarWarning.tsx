import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import { TopBar } from './TopBar';

interface ITopWarningProps {}

export const TopBarWarning = ({ children }: React.PropsWithChildren<ITopWarningProps>) => (
  <TopBar topBarClass="top-bar-warning" icon={<ExclamationTriangleIcon />}>
    {children}
  </TopBar>
);
