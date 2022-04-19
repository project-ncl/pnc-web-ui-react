import { render } from '@testing-library/react';
import { ActionHeader } from '../ActionHeader';

test('renders ActionHeader', () => {
  render(<ActionHeader actionType={'create'}>test</ActionHeader>);
});
