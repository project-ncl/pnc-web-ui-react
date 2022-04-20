import { render } from '@testing-library/react';
import { KeyValueTable } from '../KeyValueTable';

test('renders KeyValueTable', () => {
  render(<KeyValueTable keyValueObject={{ testkey: 'testvalue' }} />);
});
