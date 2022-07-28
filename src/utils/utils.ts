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

/**
 * Copies a object, sets all keys to same value and returns it.
 *
 * @param originalObj - Object to copy.
 * @param value - Value to set all keys of a copy to.
 * @returns copied object with keys set to same value
 */
export const copyAndSetValues = (originalObj: any, value: any) => {
  const copiedObj = { ...originalObj };
  Object.keys(copiedObj).forEach((key) => {
    copiedObj[key] = value;
  });

  return copiedObj;
};
