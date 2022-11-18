import { InfoCircleIcon } from '@patternfly/react-icons';

import { TOPBAR_TYPE, TopBar } from './TopBar';

interface ITopInfoProps {
  hideCloseButton?: boolean;
}

export const TopBarInfo = ({ children, hideCloseButton }: React.PropsWithChildren<ITopInfoProps>) => (
  <TopBar type={TOPBAR_TYPE.Info} icon={<InfoCircleIcon />} hideCloseButton={hideCloseButton}>
    {children}
  </TopBar>
);
