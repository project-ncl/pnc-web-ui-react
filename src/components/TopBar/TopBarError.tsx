import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { TopBar } from './TopBar';

interface ITopErrorProps {}

export const TopBarError = ({ children }: React.PropsWithChildren<ITopErrorProps>) => (
  <TopBar topBarClass="top-bar-error" icon={<ExclamationCircleIcon />}>
    {children}
  </TopBar>
);
