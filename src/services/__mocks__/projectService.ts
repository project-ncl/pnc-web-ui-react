import { rejects } from 'assert';

class ProjectService {
  path = '/projects';

  /**
   * Gets all Projects.
   *
   * @returns Projects
   */
  public getProjects() {
    return new Promise((resolve, rejects) => {
      import('../../services/__mocks__/projects-mock.json').then((mockProjectsRequest) => {
        let mockProjects = mockProjectsRequest.content;
        resolve(mockProjects);
      });
    });
  }

  /**
   * Gets a specific Project.
   *
   * @param id - ID of the Project
   * @returns Project
   */
  public getProject(id: string) {
    return new Promise((resolve, rejects) => {
      import('../../services/__mocks__/projects-mock.json').then((mockProjectsRequest) => {
        let mockProjects = mockProjectsRequest.content;
        resolve(mockProjects[0]);
      });
    });
  }

  /**
   * Gets all builds associated with a specific project.
   *
   * @param id - ID of the Project
   * @returns Builds.
   */
  public getProjectBuilds(id: string) {
    return null;
  }
}

/**
 * Instance of ProjectService providing group of Project related API operations.
 */
export const projectService = new ProjectService();
