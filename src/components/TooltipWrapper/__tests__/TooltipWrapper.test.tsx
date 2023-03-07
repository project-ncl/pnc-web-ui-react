import { render } from '@testing-library/react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

test('renders TooltipText', () => {
  render(<TooltipWrapper tooltip="test tooltip"></TooltipWrapper>);
});

test('compare snapshot with previous record', () => {
  const tree = render(<TooltipWrapper tooltip="test tooltip"></TooltipWrapper>);
  expect(tree).toMatchSnapshot();
});
