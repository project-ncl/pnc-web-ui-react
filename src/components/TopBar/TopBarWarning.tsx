import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import { TOPBAR_TYPE, TopBar } from './TopBar';

interface ITopWarningProps {}

export const TopBarWarning = ({ children }: React.PropsWithChildren<ITopWarningProps>) => (
  <TopBar type={TOPBAR_TYPE.Warning} icon={<ExclamationTriangleIcon />}>
    {children}
  </TopBar>
);
