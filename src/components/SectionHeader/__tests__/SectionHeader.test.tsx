import { render } from '@testing-library/react';
import { SectionHeader } from '../SectionHeader';

test('renders SectionHeader', () => {
  render(<SectionHeader actionType={'create'}>test</SectionHeader>);
});
