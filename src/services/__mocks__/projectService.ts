class ProjectServiceMock {
  public getProjects() {
    return new Promise((resolve) => {
      import('./projects-mock.json').then((mockProjectsRequest) => {
        resolve({ data: mockProjectsRequest });
      });
    });
  }

  public getProject(id: string) {
    throw new Error('getProject: Not implemented yet');
  }

  public getProjectBuilds(id: string) {
    throw new Error('getProjectBuilds: Not implemented yet');
  }
}

export const projectService = new ProjectServiceMock();
