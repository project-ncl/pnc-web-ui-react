import { render } from '@testing-library/react';

import { PageLayout } from 'components/PageLayout/PageLayout';

test('renders PageLayout', () => {
  render(<PageLayout title="Rendering Test" children={null} />);
});
