import { ExclamationTriangleIcon, InfoCircleIcon } from '@patternfly/react-icons';

import { TopBar } from 'components/TopBar/TopBar';

import { removeComment } from 'utils/commentHelper';

interface ITopBarAnnouncementProps {
  id?: string;
  banner?: string;
  isMaintenanceMode?: boolean;
  eta?: string;
  hideCloseButton?: boolean;
}

export const TopBarAnnouncement = ({ id, banner, isMaintenanceMode, eta, hideCloseButton }: ITopBarAnnouncementProps) => {
  const newBanner = removeComment(banner);

  if (!newBanner && !isMaintenanceMode) {
    return null;
  }

  return (
    <TopBar
      id={id}
      type={isMaintenanceMode ? 'warning' : 'info'}
      icon={isMaintenanceMode ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
      hideCloseButton={hideCloseButton}
    >
      {isMaintenanceMode && (
        <>
          Maintenance Mode - PNC system is in the maintenance mode, no new build requests are accepted.{' '}
          {newBanner && <>Reason: {newBanner}.</>} ETA: {eta || 'N/A'}
        </>
      )}
      {!isMaintenanceMode && (
        <>
          Announcement: {newBanner}. {eta && <> ETA: {eta}</>}
        </>
      )}
    </TopBar>
  );
};
