import { render } from '@testing-library/react';
import { BuildName } from '../BuildName';

test('renders BuildName', () => {
  render(<BuildName identifier="test" />);
  render(<BuildName identifier="test" link="/test.com" />);
  render(<BuildName identifier="test" additionalIdentifier="test2" />);
  render(<BuildName identifier="test" additionalIdentifier="test2" link="/test.com" additionalLink="/test2.com" />);
});
