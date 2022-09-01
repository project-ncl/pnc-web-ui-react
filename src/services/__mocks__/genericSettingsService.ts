class GenericSettingsServiceMock {
  public getAnnouncementBanner() {
    return new Promise((resolve) => {
      import('./announcement-mock.json').then((mockProjectsRequest) => {
        resolve({ data: mockProjectsRequest });
      });
    });
  }
}

export const genericSettingsService = new GenericSettingsServiceMock();
