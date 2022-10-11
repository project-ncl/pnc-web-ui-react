import { ISortOptions } from '../components/Sorting/Sorting';

export const validateSortParam = (sortParam: string, sortOptions: ISortOptions) => {
  if (sortParam === 'none') {
    return true;
  }

  const sortParamSplitted = sortParam.split('=');
  if (sortParamSplitted.length !== 3) {
    console.error('Sorting: Invalid sorting param');
    return false;
  } else if (sortParamSplitted?.[1] !== 'asc' && sortParamSplitted?.[1] !== 'desc') {
    console.error('Sorting: Invalid sorting param: order should be either asc or desc');
    return false;
  } else if (!sortOptions[sortParamSplitted[2]]) {
    console.error('Sorting: Invalid sorting param: specified sort key is not included in the config');
    return false;
  } else {
    return true;
  }
};
