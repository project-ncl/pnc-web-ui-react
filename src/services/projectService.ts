import { pncClient } from './pncClient';

class ProjectService {
  path = '/projects';

  /**
   * Gets all Projects.
   *
   * @returns Projects
   */
  public getProjects() {
    return pncClient.getHttpClient().get(this.path);
  }

  /**
   * Gets a specific Project.
   *
   * @param id - ID of the Project
   * @returns Project
   */
  public getProject(id: string) {
    return pncClient.getHttpClient().get(`${this.path}/${id}`);
  }

  /**
   * Gets all builds associated with a specific project.
   *
   * @param id - ID of the Project
   * @returns Builds.
   */
  public getProjectBuilds(id: string) {
    return pncClient.getHttpClient().get(`${this.path}/${id}/builds`);
  }
}

/**
 * Instance of ProjectService providing group of Project related API operations.
 */
export const projectService = new ProjectService();
