class ProjectServiceMock {
  public getProjects() {
    return new Promise((resolve) => {
      import('./projects-mock.json').then((mockProjectsRequest) => {
        resolve({ data: mockProjectsRequest });
      });
    });
  }

  public getProject(id: string) {
    return new Promise((resolve) => {
      import('./project-mock.json').then((mockProjectRequest) => {
        resolve({ data: mockProjectRequest });
      });
    });
  }

  public getProjectBuilds(id: string) {
    throw new Error('getProjectBuilds: Not implemented yet');
  }
}

export const projectService = new ProjectServiceMock();
