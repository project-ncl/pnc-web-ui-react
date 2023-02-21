import { useEffect } from 'react';

import { PageTitles } from 'common/constants';

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title + ` ${PageTitles.delimiterSymbol} PNC`;
  }, [title]);
};
