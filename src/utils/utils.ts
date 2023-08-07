import { uiLogger } from 'services/uiLogger';

interface ICreateDateTime {
  date: Date | string;
  includeDateInCustom?: boolean;
  includeTimeInCustom?: boolean;
}

interface IDateTimeObject {
  custom: string;
  date: string;
  time: string;
}

/**
 * Generic function for using unified date.
 *
 * Return object containing:
 *   - date -> returned regardless of includeDateInCustom and includeTimeInCustom
 *   - time -> returned regardless of includeDateInCustom and includeTimeInCustom
 *   - custom:
 *       -> defaultly date + time
 *       -> or can be just date or time (includeDateInCustom, includeTimeInCustom)
 *
 * @param date - Date (or string representing a date) to transform
 * @param includeDateInCustom - Whether the date should be included in 'custom' property of returned object, defaults to true
 * @param includeTimeInCustom - Whether the time should be included in 'custom' property of returned object, defaults to true
 * @returns Object containing date and time
 */
export const createDateTime = ({
  date,
  includeDateInCustom = true,
  includeTimeInCustom = true,
}: ICreateDateTime): IDateTimeObject => {
  if (!date) {
    return {
      custom: '',
      date: '',
      time: '',
    };
  }

  const timestamp = typeof date === 'string' ? new Date(date) : date;

  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();
  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();
  const monthString = month < 10 ? `0${month}` : month;
  const dayString = day < 10 ? `0${day}` : day;
  const hourString = hour < 10 ? `0${hour}` : hour;
  const minuteString = minute < 10 ? `0${minute}` : minute;

  const dateString = `${year}-${monthString}-${dayString}`;
  const timeString = `${hourString}:${minuteString}`;

  return {
    custom: `${includeDateInCustom ? dateString : ''}${includeDateInCustom && includeTimeInCustom ? ' ' : ''}${
      includeTimeInCustom ? timeString : ''
    }`,
    date: dateString,
    time: timeString,
  };
};

/**
 * Compares dates equality.
 *
 * @param date1 - Date 1 (or string representing a date) to be compared
 * @param date2 - Date 2 (or string representing a date) to be compared
 * @param includeTime - Include also time in comparison, defaults to false
 * @returns True if dates are equal, false otherwise
 */
export const areDatesEqual = (date1: Date | string, date2: Date | string, includeTime: boolean = false): boolean => {
  const timestamp1 = typeof date1 === 'string' ? new Date(date1) : new Date(date1.getTime());
  const timestamp2 = typeof date2 === 'string' ? new Date(date2) : new Date(date2.getTime());

  if (!includeTime) {
    timestamp1.setHours(0, 0, 0, 0);
    timestamp2.setHours(0, 0, 0, 0);
  }

  return timestamp1.getTime() === timestamp2.getTime();
};

/**
 * Calculates time interval duration.
 *
 * Returned string format is:
 *   - 5h 1m
 *   - 16s
 * -> seconds are included just when hours and minutes are zero
 *
 * @param startTime - Start of time interval
 * @param endTime - End of time interval
 * @returns String representing duration
 */
export const calculateDuration = (startTime: Date | string, endTime: Date | string): string | null => {
  if (!startTime || !endTime) {
    return null;
  }

  const startTimestamp = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const endTimestamp = typeof endTime === 'string' ? new Date(endTime) : endTime;

  const diffSeconds = Math.abs(startTimestamp.getTime() - endTimestamp.getTime()) / 1000;

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = Math.floor(diffSeconds % 60);

  const hoursString = hours !== 0 ? hours + 'h' : '';
  const minutesString = minutes !== 0 ? minutes + 'm' : '';
  const secondsString = hours === 0 && minutes === 0 ? seconds + 's' : '';

  return `${hoursString}${hoursString && minutesString ? ' ' : ''}${minutesString}${secondsString}`;
};

// Mathematical base to work in. Currently: Binary units (i.e. KiB etc). To use kB / MB etc switch to decimal (10).
const BASE = 2;
// Thershold at which to switch units.
const THRESHOLD = Math.pow(BASE, 10);
// Decimal places to display result in.
const DECIMAL_PLACES = 2;
// Separator character between quantity and unit for output.
const SEPARATOR = ' ';
// Units to display, ordered by order of magnitude.
const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

/**
 * Function to transform filesize in bytes to string format.
 * Appropriate unit size is used (small files - B, larger - MiB, etc.).
 *
 * source: https://github.com/project-ncl/pnc-web-ui-angularjs/blob/3a6b8d5d92065785e00b959d4503ed71934a55ba/ui/app/common/filters/fileSize.js
 *
 * @param sizeInBytes - number of bytes
 * @returns string format of filesize
 */
export const calculateFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes === 0) {
    return '0' + SEPARATOR + units[0];
  }

  const exp = Math.floor(Math.log(sizeInBytes) / Math.log(THRESHOLD));

  if (exp === 0) {
    return sizeInBytes + SEPARATOR + units[exp];
  }

  return (sizeInBytes / Math.pow(THRESHOLD, exp)).toFixed(DECIMAL_PLACES) + SEPARATOR + units[exp];
};

interface ICheckColumnsCombinations {
  columns: Array<string>;
  combinations: Array<Array<string>>;
}

/**
 * Function to check if the combination requirements has been satisfied.
 *
 * @param columns - columns to be checked
 * @param combinations - the combination requirements that need to be satisfied
 *
 * @returns boolean value indicates whether the check passed or not
 *
 */
export const checkColumnsCombinations = ({ columns, combinations }: ICheckColumnsCombinations): boolean => {
  return combinations.every((combination) => {
    if (combination.length >= 2 && combination.some((element) => !columns.includes(element))) {
      uiLogger.error(`Required combination unsatisfied: ${combination} should be used as a combination.`);
      return false;
    } else {
      return true;
    }
  });
};
