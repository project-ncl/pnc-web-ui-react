import { PageTitles } from 'common/constants';

// TODO: Add appropriate type for serviceContainer
interface IGeneratePageTitle {
  pageType?: 'Detail' | 'Edit' | 'Create';
  serviceContainer: any;
  entity: 'Project' | 'Build Config' | 'Group Config' | 'Build' | 'Group Build' | 'Product' | 'Artifact' | 'SCM Repository';
  entityName?: string;
}

export const generatePageTitle = ({
  pageType = 'Detail',
  serviceContainer,
  entity,
  entityName = serviceContainer.data?.name,
}: IGeneratePageTitle) => {
  const entityPrefix = pageType === 'Detail' ? '' : pageType;

  if (pageType === 'Create') return `Create ${entity}`;

  if (serviceContainer.loading) return `Loading ${entityPrefix.toLowerCase()} ${entity}`;

  if (serviceContainer.error) return `Error loading ${entityPrefix.toLowerCase()} ${entity}`;

  const entityPluralized = entity.endsWith('y') ? `${entity.slice(0, -1)}ies` : `${entity}s`;
  return `${entityPrefix} ${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${entityPluralized}`;
};
