interface ICreateDateTimeProps {
  date: Date | string;
  includeDate?: boolean;
  includeTime?: boolean;
}

/**
 * Generic function for using unified date.
 *
 * Long version additionally also includes the time.
 *
 * @param date - Date (or string representing a date) to display
 * @param includeDate - Whether the date should be displayed, defaults to true
 * @param includeTime - Whether the time should be displayed, defaults to true
 */
export const createDateTime = ({ date, includeDate = true, includeTime = true }: ICreateDateTimeProps): string | null => {
  if (!date) {
    return null;
  }

  if (typeof date === 'string') {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const monthString = month < 10 ? `0${month}` : month;
  const dayString = day < 10 ? `0${day}` : day;
  const hourString = hour < 10 ? `0${hour}` : hour;
  const minuteString = minute < 10 ? `0${minute}` : minute;

  const dateString = `${year}-${monthString}-${dayString}`;
  const timeString = `${hourString}:${minuteString}`;

  return `${includeDate ? dateString : ''}${includeDate && includeTime ? ' ' : ''}${includeTime ? timeString : ''}`;
};

export const createDateTimeLong = ({ date, includeDate = true, includeTime = true }: ICreateDateTimeProps): string | null =>
  date
    ? new Intl.DateTimeFormat('en-US', {
        ...(includeDate && { dateStyle: 'medium' }),
        ...(includeTime && { timeStyle: 'medium' }),
      }).format(typeof date === 'string' ? new Date(date) : date)
    : null;

export const transformateDateFormat = (date: Date) => {
  if (!date) {
    return '';
  }

  return createDateTime({ date }) as string;
};

export const areDatesEqual = (date1: Date | string, date2: Date | string, includeTime: boolean = false) => {
  date1 = typeof date1 === 'string' ? new Date(date1) : date1;
  date2 = typeof date2 === 'string' ? new Date(date2) : date2;

  if (!includeTime) {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  }

  return date1.getTime() === date2.getTime();
};

export const calculateDuration = (startTime: Date | string, endTime: Date | string) => {
  if (!startTime || !endTime) {
    return null;
  }

  startTime = typeof startTime === 'string' ? new Date(startTime) : startTime;
  endTime = typeof endTime === 'string' ? new Date(endTime) : endTime;

  const diffSeconds = Math.abs(startTime.getTime() - endTime.getTime()) / 1000;

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = Math.floor(diffSeconds % 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

interface IParseInternalRepositoryUrl {
  internalUrl: string;
}

/**
 * Parses internal repository url to Gerrit gitweb link of the project.
 *
 * @param scmRepository - SCM Repository containing internalUrl field
 * @returns SCM Repository name
 */
export const parseInternalRepositoryUrl = ({ internalUrl }: IParseInternalRepositoryUrl) => {
  const protocol = internalUrl.split('://')[0];
  const base = internalUrl.split('://')[1].split('/')[0];
  const project = internalUrl.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
  return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
};
