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

export const createDateTime = ({ date, includeDate = true, includeTime = true }: ICreateDateTimeObject): string =>
  new Intl.DateTimeFormat('en-US', {
    ...(includeDate && { dateStyle: 'medium' }),
    ...(includeTime && { timeStyle: 'medium' }),
  }).format(typeof date === 'string' ? new Date(date) : date);
