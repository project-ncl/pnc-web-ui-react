import { render } from '@testing-library/react';
import { BuildStatusIcon } from '../BuildStatusIcon';

test('renders BuildStatusIcon', () => {
  for (let buildStatusTypeValue = 0; buildStatusTypeValue < 15; buildStatusTypeValue++) {
    render(<BuildStatusIcon buildStatus={buildStatusTypeValue} />);
  }
});
