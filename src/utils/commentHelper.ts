const COMMENT_REGEX = /#####.*?#####\s?/g;

export const getComment = (s: string): string => {
  if (!s) {
    return '';
  }

  const match = s.match(COMMENT_REGEX);
  return match ? match[0] : '';
};

export const removeComment = (s: string | undefined): string => {
  if (!s) {
    return '';
  }

  return s.replace(COMMENT_REGEX, '');
};
