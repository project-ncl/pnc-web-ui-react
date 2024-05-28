import { useCallback, useEffect, useState } from 'react';

import { EntityWithId } from 'utils/patchHelper';

interface IUseCheckboxProps<T extends EntityWithId> {
  items: T[];
}

/**
 * Hook managing checkboxes and their state.
 *
 * @param items - Array of selectable entities represented by checkboxes
 * @returns object containing:
 *  - checkedItems            - Array of items selected by their checkbox
 *  - isItemChecked           - Function returning whether the item is currently selected
 *  - toggleItemCheck         - Function toggling whether the item is currently selected
 *  - toggleItemCheckWithBulk - Function toggling whether the item is currently selected
 *                            - with shift+click bulk selection functionality
 *  - areAllItemsChecked      - Boolean true when the items array is not empty and all items are selected, false otherwise
 *  - checkAllItems           - Selects all items
 *  - uncheckAllItems         - Unselects all items
 */
export const useCheckbox = <T extends EntityWithId>({ items }: IUseCheckboxProps<T>) => {
  const [checkedItems, setCheckedItems] = useState<T[]>([]);

  const isItemChecked = useCallback((item: T) => checkedItems.some((checkedItem) => checkedItem.id === item.id), [checkedItems]);

  const toggleItemCheck = useCallback(
    (item: T, isChecking: boolean) =>
      setCheckedItems((checkedItems) => {
        const otherCheckedItems = checkedItems.filter((checkedItem) => checkedItem.id !== item.id);
        return isChecking ? [...otherCheckedItems, item] : otherCheckedItems;
      }),
    []
  );

  const areAllItemsChecked = !!checkedItems.length && !!items.length && items.every((item) => isItemChecked(item));

  const checkAllItems = () =>
    setCheckedItems((checkedItems) => [...checkedItems, ...items.filter((item) => !isItemChecked(item))]);

  const uncheckAllItems = () =>
    setCheckedItems((checkedItems) => [
      ...checkedItems.filter((checkedItem) => items.every((item) => item.id !== checkedItem.id)),
    ]);

  // shift bulk selection feature taken from: http://v4-archive.patternfly.org/v4/components/table#composable-selectable-with-checkbox

  const [shifting, setShifting] = useState(false);
  const [recentSelectedItemRow, setRecentSelectedItemRow] = useState<{ item: T; rowIndex: number } | null>(null);

  // shift + selecting the checkbox => all intermediate checkboxes are selected
  const toggleItemCheckWithBulk = (itemToCheck: T, isSelecting: boolean) => {
    const rowIndex = items.findIndex((item) => item.id === itemToCheck.id);

    if (
      shifting &&
      recentSelectedItemRow !== null &&
      items[recentSelectedItemRow.rowIndex]?.id === recentSelectedItemRow.item.id
    ) {
      const numberSelected = rowIndex - recentSelectedItemRow.rowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(new Array(numberSelected + 1), (_, i) => i + recentSelectedItemRow.rowIndex)
          : Array.from(new Array(Math.abs(numberSelected) + 1), (_, i) => i + rowIndex);
      intermediateIndexes.forEach((index) => toggleItemCheck(items[index], isSelecting));
    } else {
      toggleItemCheck(itemToCheck, isSelecting);
    }
    setRecentSelectedItemRow({ item: itemToCheck, rowIndex });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    };

    const onTabLeave = () => {
      if (document.hidden) {
        setShifting(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onTabLeave);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onTabLeave);
    };
  }, []);

  return {
    checkedItems,
    isItemChecked: isItemChecked,
    toggleItemCheck: toggleItemCheck,
    toggleItemCheckWithBulk: useCallback(toggleItemCheckWithBulk, [items, shifting, recentSelectedItemRow, toggleItemCheck]),
    areAllItemsChecked,
    checkAllItems: useCallback(checkAllItems, [items, isItemChecked]),
    uncheckAllItems: useCallback(uncheckAllItems, [items]),
  };
};
