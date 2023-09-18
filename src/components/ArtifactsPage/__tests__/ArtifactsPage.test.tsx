import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

import { ArtifactsPage } from 'components/ArtifactsPage/ArtifactsPage';

global.ResizeObserver = ResizeObserver;

jest.mock('services/artifactApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');
jest.mock('services/webConfigService');

describe('display ArtifactsPage component', () => {
  let artifactsMock: any;

  async function loadMocks() {
    const artifactsRequestMock = await import('services/__mocks__/artifacts-mock.json');
    artifactsMock = artifactsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ArtifactsPage', () => {
    render(
      <MemoryRouter>
        <ArtifactsPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <ArtifactsPage />
        </MemoryRouter>
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
