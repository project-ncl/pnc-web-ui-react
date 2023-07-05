import { Operation, compare } from 'fast-json-patch';
import { merge } from 'lodash';

import { IFields } from 'hooks/useForm';

/**
 * Transforms form state object into object of just form input values.
 *
 * @param data - form state
 * @returns Object of non-empty form values
 */
export const transformFormToValues = (data: IFields): { [key: string]: string | boolean | null } => {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v.value ? v.value : typeof v.value === 'boolean' ? false : null])
  );
};

// original Angular implementation:
// https://github.com/project-ncl/pnc-web-ui-angularjs/blob/master/ui/app/common/pnc-client/resources/helpers/patchHelper.js#L85

/**
 * Compares changes between original and modified data and creates safe JSON patch.
 *
 * Properties not present on the modified object will not cause a delete operation to be included in the patch.
 * This is useful if, for example, you have a form that is only used to edit a subset of fields of on an entity.
 *
 * @param original - original data
 * @param modified - modified data
 * @returns Array of changes in JSON patch format
 */
export const createSafePatch = (original: Object | any[], modified: Object | any[]): Operation[] => {
  return compare(original, merge({}, original, modified));
};

/**
 * Compares changes between original and modified data and creates destructive JSON patch.
 *
 * Uses a standard JSON Patch comparison between original and modified objects, any fields that
 * are not present on the modified object that are present on the original will cause a delete operation to be
 * added to the patch. In most cases this is probably _NOT_ the method you're looking for.
 *
 * @param original - original data
 * @param modified - modified data
 * @returns Array of changes in JSON patch format
 */
export const createDestructivePatch = (original: Object | any[], modified: Object | any[]): Operation[] => {
  return compare(original, modified);
};
