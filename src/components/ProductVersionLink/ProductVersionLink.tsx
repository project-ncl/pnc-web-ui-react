import { Link } from 'react-router-dom';

import { ProductVersion } from 'pnc-api-types-ts';

interface IProductVersionLinkProps {
  productVersion: ProductVersion;
}

/**
 * Represents a link to a ProductVersionDetailPage of a specific Product Version
 *
 * @param productVersion - the Product Version object
 */

export const ProductVersionLink = ({ productVersion }: IProductVersionLinkProps) => (
  <Link to={`/products/${productVersion.product?.id}/versions/${productVersion.id}`}>
    {productVersion.product?.name} - {productVersion.version}
  </Link>
);
