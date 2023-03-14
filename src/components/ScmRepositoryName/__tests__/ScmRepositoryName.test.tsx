import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoryName } from 'components/ScmRepositoryName/ScmRepositoryName';

describe('display ScmRepositoryName component', () => {
  test('renders ScmRepositoryName', () => {
    render(
      <MemoryRouter>
        <ScmRepositoryName
          scmRepository={{
            id: '101',
            internalUrl: 'git+ssh://code.test.env.com/testRepo/empty1.git',
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
        <ScmRepositoryName
          scmRepository={{
            id: '101',
            internalUrl: 'git+ssh://code.test.env.com/testRepo/empty1.git',
            externalUrl: 'https://github.com/testRepo/empty1.git',
            preBuildSyncEnabled: true,
          }}
        />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
