// all validation functions should return boolean and accept empty string as valid

// url regex taken from:
// https://uibakery.io/regex-library/url
// eslint-disable-next-line
const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

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
