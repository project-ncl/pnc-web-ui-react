import { render } from '@testing-library/react';

import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';

describe('display ScmRepositoryUrl component', () => {
  test('renders ScmRepositoryLink', () => {
    render(
      <ScmRepositoryUrl
        isInternal
        scmRepository={{
          id: '103',
          internalUrl: 'git+ssh://code.test.env.com/testRepo/testUrlClipboardCopyGerrit.git',
          externalUrl: 'https://github.com/testRepo/empty.git',
          preBuildSyncEnabled: true,
        }}
      />
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <ScmRepositoryUrl
        isInternal
        scmRepository={{
          id: '103',
          internalUrl: 'git+ssh://code.test.env.com/testRepo/testUrlClipboardCopyGerrit.git',
          externalUrl: 'https://github.com/testRepo/empty.git',
          preBuildSyncEnabled: true,
        }}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
