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

interface IParsedScmRepositoryUrl {
  url: string;
}

export interface IParsedUrl {
  url: string;
  displayName: string;
}

/**
 * Parses internal SCM Repository URL to Gerrit gitweb link of the SCM Repository.
 *
 * @param internalUrl - The internalUrl to be parsed
 * @returns parsedUrl contains parsedUrl and displayName
 *  */
export const parseInternalScmRepositoryUrl = ({ url }: IParsedScmRepositoryUrl): IParsedUrl => {
  const protocol = url.split('://')[0];
  const base = url.split('://')[1].split('/')[0];
  const project = url.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
  return { url: 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary', displayName: 'Gerrit' };
};

/**
 * ParsesSCM Repository URL to gitweb link of the SCM Repository.
 *
 * @param externalUrl - The externalUrl to be parsed
 * @returns  Object contains url and the base of the external url
 */
export const parseExternalScmRepositoryUrl = ({ url }: IParsedScmRepositoryUrl): IParsedUrl | undefined => {
  if (url.includes('/gerrit/')) {
    return parseInternalScmRepositoryUrl({ url });
  }
  if (['http', 'https', '@'].some((element) => url.includes(element))) {
    const urlRes = url.includes('@') ? 'https://' + url.split('@')[1].replace(':', '/') : url;
    const base = urlRes.split('://')[1].split('/')[0];
    return { url: urlRes, displayName: base };
  }
  if (url.includes('.git')) {
    const urlRes = url;
    const base = urlRes.split('/')[0];
    return { url: urlRes, displayName: base };
  }
  return undefined;
};
