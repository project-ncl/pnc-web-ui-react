import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { TOPBAR_TYPE, TopBar } from './TopBar';

interface ITopErrorProps {}

export const TopBarError = ({ children }: React.PropsWithChildren<ITopErrorProps>) => (
  <TopBar type={TOPBAR_TYPE.Error} icon={<ExclamationCircleIcon />}>
    {children}
  </TopBar>
);
