import { Operation, compare } from 'fast-json-patch';
import { merge } from 'lodash';

import { IFieldValues, IFields } from 'hooks/useForm';

/**
 * Transforms form state object into object of just form input values.
 *
 * @param data - form state
 * @returns Object of non-empty form values
 */
export const transformFormToValues = (data: IFields): IFieldValues => {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.value || v.value === false ? v.value : null]));
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
export const createSafePatch = (original: Object | Object[], modified: Object | Object[]): Operation[] => {
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
export const createDestructivePatch = (original: Object | Object[], modified: Object | Object[]): Operation[] => {
  return compare(original, modified);
};

export interface EntityWithId extends Object {
  id: string;
}

/**
 * Compares changes between original and modified array property of an object and creates destructive JSON patch.
 *
 * Uses a standard JSON Patch comparison between original and modified objects, any items that
 * are not present on the modified array that are present on the original will cause a delete operation to be
 * added to the patch.
 *
 * To be used when complete original data are available.
 *
 * @param originalArray - original array data
 * @param modifiedArray - modified array data
 * @param arrayName - name of the array property in the object
 * @returns Array of changes in JSON patch format
 */
export const createArrayPatch = (
  originalArray: EntityWithId[],
  modifiedArray: EntityWithId[],
  arrayName: string
): Operation[] => {
  const originalIds = { [arrayName]: Object.fromEntries(originalArray.map((i) => [i.id, { id: i.id }])) };
  const modifiedIds = { [arrayName]: Object.fromEntries(modifiedArray.map((i) => [i.id, { id: i.id }])) };

  return createDestructivePatch(originalIds, modifiedIds);
};

/**
 * Creates JSON patch of an array property of an object.
 *
 * Items from to-remove-array are transformed to deletion operations in the patch.
 * Items from to-add-array are transformed to addition operations in the patch.
 *
 * To be used when complete original data are NOT available.
 *
 * @param toRemoveArray - items to be removed from the original array
 * @param toAddArray - items to be added to the original array
 * @returns Array of changes in JSON patch format
 */
export const createArrayPatchSimple = (
  toRemoveArray: EntityWithId[],
  toAddArray: EntityWithId[],
  arrayName: string
): Operation[] => {
  const toRemove = toRemoveArray.map((entity) => ({ op: 'remove', path: `/${arrayName}/${entity.id}` }));
  const toAdd = toAddArray.map((entity) => ({ op: 'add', path: `/${arrayName}/${entity.id}`, value: { id: entity.id } }));

  return [...toRemove, ...toAdd] as Operation[];
};
