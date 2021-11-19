import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BuildName } from '../BuildName';

test('renders BuildName', () => {
  render(<BuildName name="test" />);
  render(
    <BrowserRouter basename="/pnc-web">
      <BuildName name="test" link="/test.com" />
    </BrowserRouter>
  );
  render(<BuildName name="test" additionalIdentifier="test2" />);
  render(
    <BrowserRouter basename="/pnc-web">
      <BuildName name="test" additionalIdentifier="test2" link="/test.com" additionalLink="/test2.com" />
    </BrowserRouter>
  );
});
