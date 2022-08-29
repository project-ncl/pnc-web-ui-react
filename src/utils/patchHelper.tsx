import { Operation, compare } from 'fast-json-patch';
import { merge } from 'lodash';

import { IFieldValues, IFields } from '../containers/useForm';

/**
 * Transforms form state object into object of just form input values.
 * Also filters all empty form inputs (empty values).
 *
 * @param data - form state
 * @returns Object of non-empty form values
 */
export const createPatchData = (data: IFields): IFieldValues => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([k, v]) => v.value !== '')
      .map(([k, v]) => {
        return [k, v.value];
      })
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
