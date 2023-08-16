// all validation functions should return boolean and accept empty string as valid

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
export const minLength = (min: number): Function => {
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
export const maxLength = (max: number): Function => {
  return (string: string): boolean => {
    return !string || string.length <= max;
  };
};
