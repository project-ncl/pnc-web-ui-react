/**
 * Generic function for using unified date.
 *
 * Long version additionally also includes the time.
 *
 * @param date - Date (or string representing a date) to display
 * @param includeDate - Whether the date should be displayed, defaults to true
 * @param includeTime - Whether the time should be displayed, defaults to true
 */

interface ICreateDateTimeObject {
  date: Date | string;
  includeDate?: boolean;
  includeTime?: boolean;
}

export const createDateTime = ({ date, includeDate = true, includeTime = true }: ICreateDateTimeObject): string | null =>
  date
    ? new Intl.DateTimeFormat('en-US', {
        ...(includeDate && { dateStyle: 'medium' }),
        ...(includeTime && { timeStyle: 'medium' }),
      }).format(typeof date === 'string' ? new Date(date) : date)
    : null;

export const transformateDateFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const monthString = month < 10 ? `0${month}` : month;
  const dayString = day < 10 ? `0${day}` : day;
  const hourString = hour < 10 ? `0${hour}` : hour;
  const minuteString = minute < 10 ? `0${minute}` : minute;
  return `${year}-${monthString}-${dayString} ${hourString}:${minuteString}`;
};

interface IScmRepositoryInternal {
  internalUrl: string;
}
/**
 * Parses internal repository url to SCM Repository name.
 *
 * @param object - object containing internalUrl field
 * @returns  SCM Repository name
 */
export const parseScmRepositoryTitle = ({ internalUrl }: IScmRepositoryInternal) =>
  internalUrl ? internalUrl.split('/').splice(3).join('/') : '';

/**
 * Parses internal repository url to Gerrit gitweb link of the project.
 *
 * @param object - object containing internalUrl field
 * @returns  Gerrit gitweb link
 */
export const parseInternalRepositoryUrl = ({ internalUrl }: IScmRepositoryInternal) => {
  const protocol = internalUrl.split('://')[0];
  const base = internalUrl.split('://')[1].split('/')[0];
  const project = internalUrl.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
  return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
};
