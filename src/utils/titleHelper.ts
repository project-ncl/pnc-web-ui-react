import { PageTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { isArray } from 'utils/entityRecognition';

type EntityType =
  | 'Project'
  | 'Build Config'
  | 'Group Config'
  | 'Build'
  | 'Group Build'
  | 'Product'
  | 'Version'
  | 'Milestone'
  | 'Release'
  | 'Close Result'
  | 'Deliverables Analysis'
  | 'Artifact'
  | 'SCM Repository'
  | '';

interface IGeneratePageTitle {
  pageType?: 'Detail' | 'Edit' | 'Create';
  serviceContainer: IServiceContainerState<Object>;
  firstLevelEntity: EntityType;
  nestedEntity?: EntityType;
  entityName?: string | (string | undefined)[];
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
  entityName = serviceContainer.data && 'name' in serviceContainer.data ? (serviceContainer.data.name as string) : undefined,
}: IGeneratePageTitle) => {
  const entity = nestedEntity ? nestedEntity : firstLevelEntity;
  const fullEntityName = isArray(entityName)
    ? entityName.filter((entityName) => entityName).join(` ${PageTitles.delimiterSymbol} `)
    : entityName ?? '';
  const entityTitle =
    pageType === 'Detail'
      ? fullEntityName
      : `${pageType} ${entity} ${fullEntityName ? PageTitles.delimiterSymbol : ''} ${fullEntityName}`;

  if (serviceContainer.loading) return `Loading ${pageType !== 'Detail' ? pageType : ''} ${entity} page`;

  if (serviceContainer.error) return `Error loading ${pageType !== 'Detail' ? pageType : ''} ${entity} page`;

  const firstLevelEntityPluralized = firstLevelEntity.endsWith('y')
    ? `${firstLevelEntity.slice(0, -1)}ies`
    : `${firstLevelEntity}s`;
  return `${entityTitle} ${entityTitle ? PageTitles.delimiterSymbol : ''} ${firstLevelEntityPluralized}`;
};
