import { TFilterPreset } from 'components/FilteringPreset/FilteringPreset';

import { addQParamItem } from 'utils/qParamHelper';

export const produceQParam = (filterPreset: TFilterPreset) =>
  filterPreset.reduce((acc, filter) => {
    return filter.values.reduce(
      (groupAcc, value) => addQParamItem(filter.id, value, filter.operator, groupAcc, false) || '',
      acc
    );
  }, '');
