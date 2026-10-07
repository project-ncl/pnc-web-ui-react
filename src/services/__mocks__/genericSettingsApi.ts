import announcementMock from './announcement-mock.json';
import pncStatusMock from './pnc-status-mock.json';

export const getAnnouncementBanner = () => {
  return Promise.resolve({ data: announcementMock });
};

export const getPncVersion = () => {
  return Promise.resolve({ data: 'test' });
};

export const getPncStatus = () => {
  return Promise.resolve({ data: pncStatusMock });
};
