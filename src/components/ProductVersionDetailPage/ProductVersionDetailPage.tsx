import { ProductMilestoneRef, ProductReleaseRef } from 'pnc-api-types-ts';

import { ProductVersionAttributes } from 'common/ProductVersionAttributes';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';

export const ProductVersionDetailPage = () => {
  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  const latestProductMilestone: ProductMilestoneRef =
    serviceContainerProductVersion.data?.productMilestones &&
    Object.values(serviceContainerProductVersion.data.productMilestones).at(-1);
  const latestProductRelease: ProductReleaseRef =
    serviceContainerProductVersion.data?.productReleases &&
    Object.values(serviceContainerProductVersion.data.productReleases).at(-1);

  return (
    <ContentBox padding>
      <Attributes>
        <AttributesItem title={ProductVersionAttributes.version.title}>
          {serviceContainerProductVersion.data?.version}
        </AttributesItem>
        <AttributesItem title={ProductVersionAttributes.productName.title}>
          {serviceContainerProductVersion.data?.product.name}
        </AttributesItem>
        <AttributesItem title={ProductVersionAttributes.productDescription.title}>
          {serviceContainerProductVersion.data?.product.description}
        </AttributesItem>
        <AttributesItem title={ProductVersionAttributes.breTagPrefix.title}>
          {serviceContainerProductVersion.data?.attributes.BREW_TAG_PREFIX}
        </AttributesItem>
        <AttributesItem title={ProductVersionAttributes.latestProductMilestone.title}>
          {latestProductMilestone && (
            <ProductMilestoneReleaseLabel
              link={`../milestones/${latestProductMilestone.id}`}
              productMilestoneRelease={latestProductMilestone}
              isCurrent={latestProductMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id}
            />
          )}
        </AttributesItem>
        <AttributesItem title={ProductVersionAttributes.latestProductRelease.title}>
          {latestProductRelease && (
            <ProductMilestoneReleaseLabel productMilestoneRelease={latestProductRelease} isCurrent={false} />
          )}
        </AttributesItem>
      </Attributes>
    </ContentBox>
  );
};
