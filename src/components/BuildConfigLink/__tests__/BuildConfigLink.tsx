import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';

describe('display BuildConfigLink component', () => {
  test('renders BuildConfigLink', () => {
    render(
      <MemoryRouter>
        <BuildConfigLink id="555" />
      </MemoryRouter>
    );
  });
});
