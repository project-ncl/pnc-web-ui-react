import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ArtifactsPage } from 'components/ArtifactsPage/ArtifactsPage';

jest.mock('services/artifactApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

test('renders ArtifactsPage', () => {
  render(
    <MemoryRouter>
      <ArtifactsPage />
    </MemoryRouter>
  );
});
