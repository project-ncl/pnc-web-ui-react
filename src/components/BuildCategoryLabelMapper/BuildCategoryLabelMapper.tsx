import { buildCategoryColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IBuildCategoryLabelMapper {
  // #pncTypes buildCategory
  buildCategory: undefined | 'STANDARD' | 'LEGACY_REDHAT' | 'SERVICE' | 'LIGHTWELL';
  displayTooltip?: boolean;
}

const LIGHTWELL_GENERIC = 'LIGHTWELL';

export const BuildCategoryLabelMapper = ({ buildCategory, displayTooltip = false }: IBuildCategoryLabelMapper) => {
  if (!buildCategory) {
    return null;
  }

  const config = buildCategoryColorMap[buildCategory] ?? { text: buildCategory };

  // Use generic Lightwell colors unless specific colors are defined
  if (buildCategory.startsWith(LIGHTWELL_GENERIC)) {
    if (!config.color) {
      config.color = buildCategoryColorMap[LIGHTWELL_GENERIC].color;
    }
    if (!config.hexColor) {
      config.hexColor = buildCategoryColorMap[LIGHTWELL_GENERIC].hexColor;
    }
  }

  return (
    <>
      <LabelMapper mapperItem={config} tooltip={displayTooltip ? 'Parameters: BUILD_CATEGORY' : undefined} />
    </>
  );
};
