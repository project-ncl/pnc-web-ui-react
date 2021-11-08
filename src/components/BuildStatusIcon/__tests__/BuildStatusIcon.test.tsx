import { render } from '@testing-library/react';
import { BuildStatusIcon, IconType } from '../BuildStatusIcon';

test('renders BuildStatusIcon', () => {
  for (let iconTypeValue = 0; iconTypeValue < 15; iconTypeValue++) {
    render(<BuildStatusIcon iconType={iconTypeValue} />);
  }
});
