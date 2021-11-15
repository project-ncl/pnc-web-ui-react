import { ProjectsList } from '../ProjectsList';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

describe('display ProjectList component', () => {
  let mockProjectsRequest: any;
  let mockProjects: any;

  async function loadMocks() {
    mockProjectsRequest = await import('./data/mock-projects-request.json');
    mockProjects = mockProjectsRequest.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ProjectList to have the right data', () => {
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
