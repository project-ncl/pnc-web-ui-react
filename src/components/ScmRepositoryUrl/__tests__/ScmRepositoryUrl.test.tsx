import { render } from '@testing-library/react';

import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';

describe('display ScmRepositoryUrl component', () => {
  test('renders ScmRepositoryLink', () => {
    render(<ScmRepositoryUrl url="https://test.url.com/project.git" />);
  });

  test('compare snapshot with previous record', () => {
    const tree = render(<ScmRepositoryUrl url="https://test.url.com/project.git" />);
    expect(tree).toMatchSnapshot();
  });
});
