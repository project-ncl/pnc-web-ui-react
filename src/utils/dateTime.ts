/**
 * Generic function for using unified date.
 *
 * Long version additionally also includes the time.
 *
 * @param date - Date (or string representing a date) to display
 * @param long - Whether the time should also be displayed
 */
export const createDateTime = (date: Date | string, long?: boolean): string =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    ...(long && { timeStyle: 'medium' }),
  }).format(typeof date === 'string' ? new Date(date) : date);
