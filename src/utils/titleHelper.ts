import { PageTitles } from 'common/constants';

import { ServiceContainerData } from 'hooks/useServiceContainer';

export const createDetailPageTitle = (serviceContainer: ServiceContainerData, entity: string, entityName: string) => {
  if (serviceContainer.loading) return `Loading ${entity}`;

  if (serviceContainer.error) return `Error loading ${entity}`;

  return `${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${entity + 's'}`;
};

export const createCreateEditPageTitle = (
  serviceContainer: ServiceContainerData,
  isEditPage: boolean,
  entity: string,
  entityName: string
) => {
  if (!isEditPage) return `Create ${entity}`;

  if (serviceContainer.loading) return `Loading edit ${entity}`;

  if (serviceContainer.error) return `Error loading edit ${entity}`;

  return `Edit ${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${entity + 's'}`;
};
