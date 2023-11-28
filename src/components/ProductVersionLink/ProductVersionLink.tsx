import { Link } from 'react-router-dom';

import { Product, ProductVersion } from 'pnc-api-types-ts';

interface IProductVersionLinkProps {
  productVersion: ProductVersion;
  product?: Product;
}

/**
 * Represents a link to a detail page of a specific Product Version.
 *
 * @param productVersion - Product Version object
 */
export const ProductVersionLink = ({ productVersion, product = productVersion.product }: IProductVersionLinkProps) => {
  if (!product) {
    throw new Error('product has to be defined in ProductVersionLink component');
  }

  return (
    <Link to={`/products/${product.id}/versions/${productVersion.id}`}>
      {product.name} - {productVersion.version}
    </Link>
  );
};
