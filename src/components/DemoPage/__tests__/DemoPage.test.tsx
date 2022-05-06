import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import { DemoPage } from '../DemoPage';

test('renders DemoPage', () => {
  /* Need to be implemented until the unit test for build Metrics finished so that to mock the kafka service[NCL-7024] */
  render(<MemoryRouter>{/* <DemoPage /> */}</MemoryRouter>);
});
