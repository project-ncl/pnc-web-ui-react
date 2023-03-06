import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { TooltipText } from 'components/TooltipText/TooltipText';

test('renders TooltipText', () => {
  render(<TooltipText tooltip="test tooltip">test tooltip title</TooltipText>);
});

test('compare snapshot with previous record', () => {
  const tree = render(<TooltipText tooltip="test tooltip">test tooltip title</TooltipText>);
  expect(tree).toMatchSnapshot();
});
