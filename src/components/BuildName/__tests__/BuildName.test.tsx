import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BuildName } from '../BuildName';

test('renders BuildName', () => {
  render(<BuildName identifier="test" />);
  render(
    <BrowserRouter basename="/pnc-web">
      <BuildName identifier="test" link="/test.com" />
    </BrowserRouter>
  );
  render(<BuildName identifier="test" additionalIdentifier="test2" />);
  render(
    <BrowserRouter basename="/pnc-web">
      <BuildName identifier="test" additionalIdentifier="test2" link="/test.com" additionalLink="/test2.com" />
    </BrowserRouter>
  );
});
