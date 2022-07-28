// url regex taken from:
// https://uibakery.io/regex-library/url
const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

/**
 * URL validation function.
 *
 * Just checks valid URL format. Accepts empty URL.
 *
 * @param url - URL string
 * @returns empty string if valid, error message otherwise
 */
export const validateUrl = (url: string) => {
  if (url && !urlRegex.test(url)) return 'Invalid URL format';
  return '';
};
