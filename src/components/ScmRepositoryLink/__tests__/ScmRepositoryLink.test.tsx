import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';

describe('display ScmRepositoryLink component', () => {
  test('renders ScmRepositoryLink', () => {
    render(
      <MemoryRouter>
        <ScmRepositoryLink
          scmRepository={{
            id: '101',
            internalUrl: 'git+ssh://test.env.com/testRepo/empty1.git',
            externalUrl: 'https://github.com/testRepo/empty1.git',
            preBuildSyncEnabled: true,
          }}
        />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ScmRepositoryLink
          scmRepository={{
            id: '101',
            internalUrl: 'git+ssh://test.env.com/testRepo/empty1.git',
            externalUrl: 'https://github.com/testRepo/empty1.git',
            preBuildSyncEnabled: true,
          }}
        />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
