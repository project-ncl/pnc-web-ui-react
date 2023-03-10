import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoryName } from 'components/ScmRepositoryName/ScmRepositoryName';

describe('display ScmRepositoryName component', () => {
  test('renders ScmRepositoryName', () => {
    render(
      <MemoryRouter>
        <ScmRepositoryName scmRepositoryId="100" url="https://test.url.com/project.git" />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ScmRepositoryName scmRepositoryId="100" url="https://test.url.com/project.git" />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
