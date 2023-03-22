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

interface IParseInternalRepositoryUrl {
  internalUrl: string;
}

/**
 * Parses internal repository url to Gerrit gitweb link of the SCM Repository.
 *
 * @param internalUrl - The internalUrl to be parsed
 * @returns SCM Repository URL
 */
export const parseInternalRepositoryUrl = ({ internalUrl }: IParseInternalRepositoryUrl) => {
  const protocol = internalUrl.split('://')[0];
  const base = internalUrl.split('://')[1].split('/')[0];
  const project = internalUrl.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
  return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
};

interface IParseExternalRepositoryUrl {
  externalUrl: string;
}

interface IParseExternalRepositoryUrlResult {
  url: string | undefined;
  base: string | undefined;
}

/**
 * Parses external SCM Url to gitweb link of the SCM Repository.
 *
 * @param externalUrl - The externalUrl to be parsed
 * @returns  Object contains url and the base of the external url
 */
export const parseExternalRepositoryUrl = ({ externalUrl }: IParseExternalRepositoryUrl): IParseExternalRepositoryUrlResult => {
  if (externalUrl.includes('/gerrit/')) {
    return { url: parseInternalRepositoryUrl({ internalUrl: externalUrl }), base: 'Gerrit' };
  }
  if (['http', 'https', '@'].some((element) => externalUrl.includes(element))) {
    const url = externalUrl.includes('@') ? 'https://' + externalUrl.split('@')[1].replace(':', '/') : externalUrl;
    const base = url.split('://')[1].split('/')[0];
    return { url, base };
  }
  if (externalUrl.includes('.git')) {
    const url = externalUrl;
    const base = url.split('/')[0];
    return { url, base };
  }
  return { url: undefined, base: undefined };
};
