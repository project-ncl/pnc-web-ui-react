import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';

type EntityType =
  | 'Project'
  | 'Build Config'
  | 'Group Config'
  | 'Build'
  | 'Group Build'
  | 'Product'
  | 'Version'
  | 'Milestone'
  | 'Close Result'
  | 'Deliverables Analysis'
  | 'Artifact'
  | 'SCM Repository'
  | '';

interface IGeneratePageTitle {
  pageType?: 'Detail' | 'Edit' | 'Create';
  serviceContainer: IServiceContainer;
  firstLevelEntity: EntityType;
  nestedEntity?: EntityType;
  entityName?: string;
}

/**
 * example - no nested entity:
 *   loading: Loading <firstLevelEntity> · PNC
 *            Loading Project · PNC
 *   detail: <entityName> · <firstLevelEntityPluralized> · PNC
 *           RandomProject · Projects · PNC
 *
 * example - with nested entity:
 *   loading: Loading <nestedEntity> · PNC
 *            Loading Milestone · PNC
 *   detail: <entityName> · <firstLevelEntityPluralized> · PNC
 *           1.0.0.ER1 · RandomProduct · Products · PNC
 */
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
