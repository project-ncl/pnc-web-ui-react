class ProjectServiceMock {
  /**
   * Gets all Projects.
   *
   * @returns Projects
   */
  public getProjects() {
    return new Promise((resolve) => {
      import('./projects-mock.json').then((mockProjectsRequest) => {
        resolve({ data: mockProjectsRequest });
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
    throw new Error('getProject: Not implemented yet');
  }

  /**
   * Gets all builds associated with a specific project.
   *
   * @param id - ID of the Project
   * @returns Builds.
   */
  public getProjectBuilds(id: string) {
    throw new Error('getProjectBuilds: Not implemented yet');
  }
}

/**
 * Instance of ProjectService providing group of Project related API operations.
 */
export const projectService = new ProjectServiceMock();
