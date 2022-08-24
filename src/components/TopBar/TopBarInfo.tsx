import { InfoCircleIcon } from '@patternfly/react-icons';

import { TopBar } from './TopBar';

interface ITopInfoProps {}

export const TopBarInfo = ({ children }: React.PropsWithChildren<ITopInfoProps>) => (
  <TopBar topBarClass="top-bar-info" icon={<InfoCircleIcon />}>
    {children}
  </TopBar>
);
