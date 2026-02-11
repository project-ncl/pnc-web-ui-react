import { Badge } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { WarningIcon } from 'components/Icons/WarningIcon';
import { ServiceContainerLabel } from 'components/ServiceContainerLabel/ServiceContainerLabel';

import { IQParamOperators, addQParamItem, parseQParamDeep } from 'utils/qParamHelper';
import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';

export type TFilterPreset = {
  id: string;
  operator: IQParamOperators;
  values: string[];
}[];

interface IFilteringPresetProps {
  title: string;
  description: string;
  filterPreset: TFilterPreset;
  componentId: string;
  serviceContainerEntitiesCount: IServiceContainerState<any>;
  serviceContainerEntitiesCountRunner: (qParam: string) => void;
  isWarning?: boolean;
}

/**
 * Button to apply preset of filters to a list.
 *
 * @param title - The title of the preset displayed inside the button.
 * @param description - Tooltip description for the preset.
 * @param filterPresets - Array of filter preset definitions, each with an id, values, and operator.
 * @param componentId - Identifier for the list component.
 * @param serviceContainerEntitiesCount - Service container state holding count of entities filtered by the preset.
 * @param serviceContainerEntitiesCountRunner - Function to fetch the count of entities filtered by the preset.
 * @param isWarning - Optional flag to indicate if a warning icon should be displayed.
 */
export const FilteringPreset = ({
  title,
  description,
  filterPreset,
  componentId,
  serviceContainerEntitiesCount,
  serviceContainerEntitiesCountRunner,
  isWarning = false,
}: IFilteringPresetProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isFilteredByPreset, setIsFilteredByPreset] = useState(false);

  const qParam = useMemo(
    () =>
      filterPreset.reduce((acc, filter) => {
        return filter.values.reduce(
          (groupAcc, value) => addQParamItem(filter.id, value, filter.operator, groupAcc, false) || '',
          acc
        );
      }, ''),
    [filterPreset]
  );

  useEffect(() => {
    serviceContainerEntitiesCountRunner(qParam);
  }, [serviceContainerEntitiesCountRunner, componentId, qParam]);

  useEffect(() => {
    const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
    const appliedFilters = parseQParamDeep(currentQParam);

    setIsFilteredByPreset(
      filterPreset.length === Object.keys(appliedFilters).length &&
        filterPreset.every((filter) => {
          const appliedFilter = appliedFilters[filter.id];
          const appliedFilterValues = appliedFilter?.values;

          return (
            !!appliedFilterValues &&
            appliedFilter.operator === filter.operator &&
            appliedFilterValues.length === filter.values.length &&
            filter.values.every((v) => appliedFilterValues.includes(v))
          );
        })
    );
  }, [location, componentId, filterPreset]);

  return (
    <ServiceContainerLabel
      title="Entities Count"
      tooltip={description}
      color={isFilteredByPreset ? 'blue' : 'grey'}
      variant={isFilteredByPreset ? 'filled' : 'outline'}
      onClick={
        !isFilteredByPreset
          ? () => updateQueryParamsInURL({ q: qParam, pageIndex: 1 }, componentId, location, navigate)
          : undefined
      }
      className={css(isFilteredByPreset && 'cursor-default')}
      loading={serviceContainerEntitiesCount.loading}
      error={serviceContainerEntitiesCount.error}
    >
      {title}{' '}
      <Badge>
        {serviceContainerEntitiesCount.data?.totalHits} {isWarning ? <WarningIcon /> : null}
      </Badge>
    </ServiceContainerLabel>
  );
};
