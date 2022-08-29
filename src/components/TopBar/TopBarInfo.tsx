import { InfoCircleIcon } from '@patternfly/react-icons';

import { TOPBAR_TYPE, TopBar } from './TopBar';

interface ITopInfoProps {}

export const TopBarInfo = ({ children }: React.PropsWithChildren<ITopInfoProps>) => (
  <TopBar type={TOPBAR_TYPE.Info} icon={<InfoCircleIcon />}>
    {children}
  </TopBar>
);
