import { render } from '@testing-library/react';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';

const TEST_CONTENT = 'http://testUrl.com';

test('renders CopyToClipboard', () => {
  render(<CopyToClipboard>{TEST_CONTENT}</CopyToClipboard>);
});

test('compare snapshot with previous record', () => {
  const tree = render(<CopyToClipboard>{TEST_CONTENT}</CopyToClipboard>);
  expect(tree.container).toMatchSnapshot();
});
