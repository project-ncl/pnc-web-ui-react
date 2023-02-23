import { PageTitles } from 'common/constants';

// TODO: Add appropriate type for serviceContainer
export const createDetailPageTitle = (serviceContainer: any, entity: string, entityName: string) => {
  if (serviceContainer.loading) return `Loading ${entity}`;

  if (serviceContainer.error) return `Error loading ${entity}`;

  return `${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${entity + 's'}`;
};

// TODO: Add appropriate type for serviceContainer
export const createCreateEditPageTitle = (serviceContainer: any, isEditPage: boolean, entity: string, entityName: string) => {
  if (!isEditPage) return `Create ${entity}`;

  if (serviceContainer.loading) return `Loading edit ${entity}`;

  if (serviceContainer.error) return `Error loading edit ${entity}`;

  return `Edit ${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${entity + 's'}`;
};
