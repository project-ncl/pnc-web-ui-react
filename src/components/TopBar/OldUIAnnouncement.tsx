import { Alert, AlertActionCloseButton, AlertVariant } from '@patternfly/react-core';
import { ApplicationsIcon, ArrowIcon } from '@patternfly/react-icons';

import { useStorage } from 'hooks/useStorage';

const URL_TRIGGER = 'secondary';
const LOCAL_STORAGE_KEY = 'old-ui-announcement-closed';

export const OldUIAnnouncement = () => {
  const { storageValue: isClosed, storeToStorage: setIsClosed } = useStorage<boolean>({
    storageKey: LOCAL_STORAGE_KEY,
    initialValue: false,
  });

  const oldUIUrl = process.env.REACT_APP_PNC_OLD_UI_WEB;

  //Display announcement when oldUIUrl is configured and current host name does not contain keyword
  const shouldDisplay = !!oldUIUrl && !window.location.hostname.toLowerCase().includes(URL_TRIGGER);

  if (!shouldDisplay || isClosed) {
    return null;
  }

  const closeAnnouncement = () => {
    setIsClosed(true);
  };

  return (
    <Alert
      id="old-ui-announcement-bar"
      variant={AlertVariant.custom}
      actionClose={<AlertActionCloseButton onClose={closeAnnouncement} />}
      aria-label="Old UI Announcement"
      customIcon={<ApplicationsIcon />}
      title={
        <>
          Welcome to the new PNC Web UI. The{' '}
          <a href={oldUIUrl} target="_blank" rel="noopener noreferrer">
            Old UI Version <ArrowIcon />
          </a>{' '}
          is temporarily available, but it will soon be decommissioned.
        </>
      }
      isInline
    />
  );
};
