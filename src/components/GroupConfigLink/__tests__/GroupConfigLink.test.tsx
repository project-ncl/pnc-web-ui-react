import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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
