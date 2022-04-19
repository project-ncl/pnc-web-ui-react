import { render } from '@testing-library/react';
import { ProjectLink } from '../ProjectLink';

test('renders ProjectLink', () => {
  render(<ProjectLink id={'555'} />);
});
