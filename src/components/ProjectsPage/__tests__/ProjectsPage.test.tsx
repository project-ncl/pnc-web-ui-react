import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { ProjectsPage } from 'components/ProjectsPage/ProjectsPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/projectApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

describe('display ProjectsPage component', () => {
  let projectsMock: any;

  async function loadMocks() {
    const projectsRequestMock = await import('services/__mocks__/projects-mock.json');
    projectsMock = projectsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ProjectsPage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );
    });
    const firstProject = screen.getByText(projectsMock[0].name);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(projectsMock[6].description);
    expect(lastProject).toBeInTheDocument();
    const lastProjectCount = screen.getByText(17);
    expect(lastProjectCount).toBeInTheDocument();
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );
    });
    expect(tree.container).toMatchSnapshot();
  });
});
