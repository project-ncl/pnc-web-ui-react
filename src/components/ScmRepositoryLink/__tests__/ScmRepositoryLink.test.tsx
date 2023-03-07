import { render } from '@testing-library/react';

import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';

describe('display ScmRepositoryLink component', () => {
  test('renders ScmRepositoryLink', () => {
    render(<ScmRepositoryLink url="https://test.url.com/project.git" />);
  });

  test('compare snapshot with previous record', () => {
    const tree = render(<ScmRepositoryLink url="https://test.url.com/project.git" />);
    expect(tree).toMatchSnapshot();
  });
});
