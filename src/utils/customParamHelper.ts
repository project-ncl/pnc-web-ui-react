import { TFilterAttribute } from 'components/Filtering/Filtering';

/**
 * Construct custom filter param, for example buildConfigName.
 *
 * @param attribute - Filter attribute containing for example operator
 * @param value - Original filter value
 * @returns Adjusted filter value based on filter attribute
 */
export const constructCustomFilterParam = (attribute: TFilterAttribute, value: string): string => {
  if (attribute.filter.operator === '=like=') {
    let isNegated = false;

    // when negated: convert !ab?c to ab?c
    if (value.startsWith('!')) {
      isNegated = true;
      value = value.substring(1);
    }

    // convert abc to %abc%
    value = '%' + value + '%';

    // when negated: convert %ab_c% to !%ab_c%
    if (isNegated) {
      value = '!' + value;
    }

    return value;
  }

  throw new Error(`${attribute.filter.operator} is not supported when creating custom filter param.`);
};
