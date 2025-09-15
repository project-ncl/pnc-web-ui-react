import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';

vi.mock('services/uiLogger');

describe('display ScmRepositoryUrl component', () => {
  test('renders ScmRepositoryLink', () => {
    render(
      <ScmRepositoryUrl
        internalScmRepository={{
          id: '103',
          internalUrl: 'git+ssh://test.env.com/testRepo/testUrlClipboardCopyGerrit.git',
          externalUrl: 'https://github.com/testRepo/empty.git',
          preBuildSyncEnabled: true,
        }}
      />
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <ScmRepositoryUrl
        internalScmRepository={{
          id: '103',
          internalUrl: 'git+ssh://test.env.com/testRepo/testUrlClipboardCopyGerrit.git',
          externalUrl: 'https://github.com/testRepo/empty.git',
          preBuildSyncEnabled: true,
        }}
      />
    );
    expect(tree.container).toMatchSnapshot();
  });
});
