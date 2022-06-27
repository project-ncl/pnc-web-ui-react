class BuildServiceMock {
  public getBuildMetrics(buildIds?: Array<string>) {
    throw new Error('getBuildMetrics: Not implemented yet');
  }

  public getBuildCount() {
    return new Promise((resolve) => {
      import('./build-count-mock.json').then((mockProjectRequest) => {
        resolve({ data: mockProjectRequest });
      });
    });
  }
}

export const buildService = new BuildServiceMock();
