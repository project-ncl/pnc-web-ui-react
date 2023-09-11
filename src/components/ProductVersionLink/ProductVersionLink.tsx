import { Link } from 'react-router-dom';

import { ProductVersion } from 'pnc-api-types-ts';

interface IProductVersionLinkProps {
  productVersion: ProductVersion;
}

/**
 * Represents a link to a detail page of a specific Product Version.
 *
 * @param productVersion - Product Version object
 */
export const ProductVersionLink = ({ productVersion }: IProductVersionLinkProps) => (
  <Link to={`/products/${productVersion.product?.id}/versions/${productVersion.id}`}>
    {productVersion.product?.name} - {productVersion.version}
  </Link>
);
