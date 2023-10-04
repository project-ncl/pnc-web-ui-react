import { useCallback, useState } from 'react';

import { EntityWithId } from 'utils/patchHelper';

export interface IOperation<T extends EntityWithId> {
  data: T;
  operator: 'add' | 'remove';
}

/**
 * Hook managing set of PATCH operations to be done on an array of entities.
 * Namely, the add and remove operation on array data are registered.
 * Created operations can also be cancelled.
 *
 * Entities of the array are distinguished by their 'id' property.
 *
 * @returns object containing:
 *  - operations          - Set of add and/or remove PATCH operations
 *  - removedData         - Set of entities with remove PATCH operation
 *  - addedData           - Set of entities with add PATCH operation
 *  - insertOperation     - Function to insert a PATCH operation with
 *  - cancelOperation     - Function to cancel a PATCH operation with
 *  - cancelAllOperations - Function to cancel all PATCH operations with
 */
export const usePatchOperation = <T extends EntityWithId>() => {
  const [operations, setOperations] = useState<IOperation<T>[]>([]);

  const removedData = operations.filter((operation) => operation.operator === 'remove').map((operation) => operation.data);

  const addedData = operations.filter((operation) => operation.operator === 'add').map((operation) => operation.data);

  const insertOperation = (data: T, operator: IOperation<T>['operator']) =>
    setOperations((operations) => {
      const otherOperations = operations.filter((operation) => operation.data.id !== data.id);

      return [...otherOperations, { data, operator }];
    });

  const cancelOperation = (data: T) =>
    setOperations((operations) => {
      return operations.filter((operation) => operation.data.id !== data.id);
    });

  const cancelAllOperations = () => setOperations([]);

  return {
    operations,
    removedData,
    addedData,
    insertOperation: useCallback(insertOperation, []),
    cancelOperation: useCallback(cancelOperation, []),
    cancelAllOperations: useCallback(cancelAllOperations, []),
  };
};
