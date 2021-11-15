import { ProjectsList } from '../ProjectsList';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

describe('display project list page', () => {
  let mockProjectsRequest: any;
  let mockProjects: any;

  async function loadMocks() {
    mockProjectsRequest = await import('./data/mock-projects-request.json');
    mockProjects = mockProjectsRequest.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  afterEach(async () => {});

  test('renders ProjectList to have the right data and', () => {
    render(
      <MemoryRouter>
        <ProjectsList projects={mockProjects} />
      </MemoryRouter>
    );
    const firstProject = screen.getByText(mockProjects[0].name);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(mockProjects[6].description);
    expect(lastProject).toBeInTheDocument();
    const lastProjectCount = screen.getByText(17);
    expect(lastProjectCount).toBeInTheDocument();
  });
});
