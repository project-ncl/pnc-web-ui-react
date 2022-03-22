import { render } from '@testing-library/react';
import { ActionButton } from '../ActionButton';

test('renders all ActionButton', () => {
  render(<ActionButton actionType={'create'} />);
  render(<ActionButton actionType={'edit'} />);
  render(<ActionButton actionType={'delete'} />);
});
