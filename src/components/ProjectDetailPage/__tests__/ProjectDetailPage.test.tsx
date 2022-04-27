import { render } from '@testing-library/react';
import { ProjectDetailPage } from '../ProjectDetailPage';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../services/projectService');

describe('display ProjectDetailPage component', () => {
  test('renders ProjectDetail', () => {
    render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
