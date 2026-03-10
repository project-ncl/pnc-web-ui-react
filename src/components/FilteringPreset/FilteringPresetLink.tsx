import { PropsWithChildren, useMemo } from 'react';
import { Link } from 'react-router';

import { TFilterPreset } from 'components/FilteringPreset/FilteringPreset';
import { produceQParam } from 'components/FilteringPreset/common';

import { convertComponentQueryParamsObjectToString } from 'utils/queryParamsHelper';

interface IFilteringPresetLinkProps extends PropsWithChildren {
  filterPreset: TFilterPreset;
  componentId: string;
  basePath: string;
}

export const FilteringPresetLink = ({ filterPreset, componentId, basePath, children }: IFilteringPresetLinkProps) => {
  const queryString = useMemo(() => {
    const qParam = produceQParam(filterPreset);
    return convertComponentQueryParamsObjectToString({ q: qParam, pageIndex: 1 }, componentId);
  }, [filterPreset]);

  return (
    <Link to={`${basePath}?${queryString}`} className="text-decoration-none">
      {children}
    </Link>
  );
};
