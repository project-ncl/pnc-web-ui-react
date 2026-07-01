import { buildCategoryColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IBuildCategoryLabelMapper {
  // #pncTypes buildCategory
  buildCategory: 'STANDARD' | 'LEGACY_REDHAT' | 'SERVICE' | 'LIGHTWELL' | 'LIGHTWELL_UPSTREAM';
  displayTooltip?: boolean;
}

export const BuildCategoryLabelMapper = ({ buildCategory, displayTooltip = false }: IBuildCategoryLabelMapper) => {
  if (!buildCategory) {
    return null;
  }

  const config = buildCategoryColorMap[buildCategory] ?? { text: buildCategory };

  return (
    <>
      <LabelMapper mapperItem={config} tooltip={displayTooltip ? 'Parameters: BUILD_CATEGORY' : undefined} />
    </>
  );
};
