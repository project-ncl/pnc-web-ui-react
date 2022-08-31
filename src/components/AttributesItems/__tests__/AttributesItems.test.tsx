import { render } from '@testing-library/react';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';

test('renders AttributesItems', () => {
  const attributes = [
    {
      name: 'Project URL',
      value: 'test',
    },
    {
      name: 'Issue Tracker URL',
      value: undefined,
    },
    { name: 'Engineering Team', value: 'testingvalue' },
    { name: 'Technical Leader', value: null },
  ];
  render(<AttributesItems attributes={attributes} />);
});
