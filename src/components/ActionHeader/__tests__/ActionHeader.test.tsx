import { render } from '@testing-library/react';
import { ActionHeader } from '../ActionHeader';

test('renders ActionHeader', () => {
  render(<ActionHeader text={'test'} actionType={'create'} />);
});
