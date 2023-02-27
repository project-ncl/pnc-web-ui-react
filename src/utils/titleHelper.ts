import { PageTitles } from 'common/constants';

type EntityType =
  | 'Project'
  | 'Build Config'
  | 'Group Config'
  | 'Build'
  | 'Group Build'
  | 'Product'
  | 'Version'
  | 'Milestone'
  | 'Artifact'
  | 'SCM Repository'
  | '';

// TODO: Add appropriate type for serviceContainer
interface IGeneratePageTitle {
  pageType?: 'Detail' | 'Edit' | 'Create';
  serviceContainer: any;
  firstLevelEntity: EntityType;
  nestedEntity?: EntityType;
  entityName?: string;
}

export const generatePageTitle = ({
  pageType = 'Detail',
  serviceContainer,
  firstLevelEntity,
  nestedEntity = '',
  entityName = serviceContainer.data?.name,
}: IGeneratePageTitle) => {
  const entity = nestedEntity ? nestedEntity : firstLevelEntity;
  const entityPrefix = pageType === 'Detail' ? '' : pageType;

  if (pageType === 'Create') return `Create ${entity}`;

  if (serviceContainer.loading) return `Loading ${entityPrefix.toLowerCase()} ${entity}`;

  if (serviceContainer.error) return `Error loading ${entityPrefix.toLowerCase()} ${entity}`;

  const firstLevelEntityPluralized = firstLevelEntity.endsWith('y')
    ? `${firstLevelEntity.slice(0, -1)}ies`
    : `${firstLevelEntity}s`;
  return `${entityPrefix} ${entityName ? entityName : '<unknown>'} ${PageTitles.delimiterSymbol} ${firstLevelEntityPluralized}`;
};
