import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { GroupConfigLink } from 'components/GroupConfigLink/GroupConfigLink';

describe('display GroupConfigLink component', () => {
  test('renders GroupConfigLink', () => {
    render(
      <MemoryRouter>
        <GroupConfigLink id={'555'} />
      </MemoryRouter>
    );
  });
});
