import { BuildPage, GroupBuildPage } from 'pnc-api-types-ts';

import { uiLogger } from 'services/uiLogger';

// currently supported types, matching condition needs to be verified when they are extended
type TPage = BuildPage | GroupBuildPage;
type TPageItem<T extends TPage> = NonNullable<T['content']>[number];

/**
 * Refresh Page to contain new Item instead of the original Item, match by ID.
 *
 * @param originalPage - Original Page
 * @param newItem - Item inside original Page will be replaced with new Item with the same ID
 * @returns Refreshed Page containing new Item instead of the original Item with the same ID, when newItem is invalid, then Original Page is returned
 */
export const refreshPage = <T extends TPage>(originalPage: T, newItem: TPageItem<T>): T => {
  if (newItem === undefined) {
    uiLogger.error('refreshPage: invalid newItem (undefined value)');
    return originalPage;
  }
  if (!newItem.id) {
    uiLogger.error('refreshPage: invalid newItem ("id" attribute is missing)', undefined, newItem);
    return originalPage;
  }
  const refreshedPage = JSON.parse(JSON.stringify(originalPage));

  refreshedPage.content = refreshedPage.content.map((originalItem: TPageItem<T>) =>
    originalItem.id === newItem.id ? newItem : originalItem
  );

  return refreshedPage;
};
