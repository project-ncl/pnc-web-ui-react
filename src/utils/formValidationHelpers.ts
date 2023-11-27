// all validation functions should return boolean and accept empty string as valid
import { buildTypeData } from 'common/buildTypeData';

import { IFieldValues } from 'hooks/useForm';

const whitespacesRegex = /\s*/;

// url regex taken from:
// https://uibakery.io/regex-library/url
const rootUrlRegex =
  // eslint-disable-next-line
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
const urlRegex = new RegExp(`^${rootUrlRegex.source}$`);

const rootUrlsRegex = new RegExp(`(${whitespacesRegex.source}${rootUrlRegex.source}${whitespacesRegex.source})+`);
const urlsRegex = new RegExp(`^${rootUrlsRegex.source}$`);

// eslint-disable-next-line
const scmUrlRegex =
  /^(git|ssh|http|https|git\+ssh|git@):\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

/**
 * URL validation function.
 *
 * Just checks valid URL format. Accepts empty URL.
 *
 * @param url - URL string
 * @returns true if valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  return !url || urlRegex.test(url);
};

export const urlValidator = { validator: validateUrl, errorMessage: 'Invalid URL format.' };

/**
 * SCM URL validation function.
 *
 * Checks valid SCM URL format. Accepts empty URL.
 *
 * @param url - URL string
 * @returns true if valid, false otherwise
 */
export const validateScmUrl = (url: string): boolean => {
  return !url || scmUrlRegex.test(url);
};

/**
 * String of URLs validation function.
 *
 * Checks validity of format of string of URLs (separated by whitespace). Accepts empty string.
 *
 * @param urls - string of URLs
 * @returns true if valid, false otherwise
 */
export const validateUrls = (urls: string): boolean => {
  return !urls || urlsRegex.test(urls);
};

/**
 * Creator of a min length validation function.
 *
 * Returned function accepts empty string.
 *
 * @param min - Minimal length of a string returned function will validate
 * @returns function validating minimal length
 */
export const minLength = (min: number) => {
  return (string: string): boolean => {
    return !string || string.length >= min;
  };
};

/**
 * Creator of a max length validation function.
 *
 * Returned function accepts empty string.
 *
 * @param max - Maximal length of a string returned function will validate
 * @returns function validating maximal length
 */
export const maxLength = (max: number) => {
  return (string: string): boolean => {
    return !string || string.length <= max;
  };
};

export const maxLengthValidator255 = { validator: maxLength(255), errorMessage: 'Maximal input length is 255 characters.' };

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Date format validation function.
 * Accepted date format: YYYY-MM-DD
 *
 * Accepts empty date.
 *
 * @param date - Date string
 * @returns true if valid, false otherwise
 */
export const validateDate = (date: string): boolean => {
  const dateObject = new Date(date);
  return !date || (dateRegex.test(date) && !isNaN(dateObject.getTime()));
};

const productVersionNameRegex = /^\d+\.\d+$/;

/**
 * Product Version name validation function.
 *
 * Accepts empty version.
 *
 * @param version - Version string
 * @returns true if valid, false otherwise
 */
export const validateProductVersionName = (version: string): boolean => {
  return !version || productVersionNameRegex.test(version);
};

const productReleaseNameRegex = /^\d+\.[a-zA-Z0-9]+$/;

/**
 * Product Release name validation function.
 *
 * Accepts empty version.
 *
 * @param version - Version string
 * @returns true if valid, false otherwise
 */
export const validateProductReleaseName = (version: string): boolean => {
  return !version || productReleaseNameRegex.test(version);
};

const buildScriptChecker = (buildScript: string) => {
  const MAVEN = 'mvn';
  const MANDATORY_ARGS = ['deploy'];

  const lines = buildScript.toLowerCase().split('\n');

  return lines.every((line) => !line.includes(MAVEN) || MANDATORY_ARGS.every((arg) => line.includes(arg)));
};

/**
 * Build script validation function.
 *
 * Accepts empty Build script.
 *
 * @param version - Build script string
 * @returns true if valid, false otherwise
 */
export const validateBuildScript = (fieldValues: IFieldValues): boolean => {
  return (
    !fieldValues.buildScript || fieldValues.buildType !== buildTypeData.MVN.id || buildScriptChecker(fieldValues.buildScript)
  );
};
