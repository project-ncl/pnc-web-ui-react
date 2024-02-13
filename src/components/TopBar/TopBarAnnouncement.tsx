import { ExclamationTriangleIcon, InfoCircleIcon } from '@patternfly/react-icons';

import { TOPBAR_TYPE, TopBar } from 'components/TopBar/TopBar';

interface ITopBarAnnouncementProps {
  id?: string;
  banner?: string;
  isMaintenanceMode?: boolean;
  eta?: string;
  hideCloseButton?: boolean;
}

export const TopBarAnnouncement = ({ id, banner, isMaintenanceMode, eta, hideCloseButton }: ITopBarAnnouncementProps) => {
  if (!banner && !isMaintenanceMode) {
    return null;
  }

  return (
    <TopBar
      id={id}
      type={isMaintenanceMode ? TOPBAR_TYPE.Warning : TOPBAR_TYPE.Info}
      icon={isMaintenanceMode ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
      hideCloseButton={hideCloseButton}
    >
      {isMaintenanceMode && (
        <>
          Maintenance Mode - PNC system is in the maintenance mode, no new build requests are accepted.{' '}
          {banner && <>Reason: {banner}.</>} ETA: {eta || 'N/A'}
        </>
      )}
      {!isMaintenanceMode && (
        <>
          Announcement: {banner}. {eta && <> ETA: {eta}</>}
        </>
      )}
    </TopBar>
  );
};
