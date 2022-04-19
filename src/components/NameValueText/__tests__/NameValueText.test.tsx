import { render } from '@testing-library/react';
import { NameValueText } from '../NameValueText';

test('renders NameValueText', () => {
  render(<NameValueText name="key" value="value" />);
});
