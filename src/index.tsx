import '@patternfly/react-core/dist/styles/base.css';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { URL_BASE_PATH } from 'common/constants';

import { useLegacyUrlRedirector } from 'hooks/useLegacyUrlRedirector';

import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

import { keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

import { AppRoutes } from './AppRoutes';
import './index.css';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter(createRoutesFromElements(AppRoutes), { basename: URL_BASE_PATH });

const App = () => {
  const [isKeycloakInitiated, setIsKeycloakInitiated] = useState<boolean>(false);
  const [isKeycloakInitFail, setIsKeycloakInitFail] = useState<boolean>(false);
  const [isKeycloakInitInProcess, setIsKeycloakInitInProcess] = useState<boolean>(true);

  useLegacyUrlRedirector();

  useEffect(() => {
    keycloakService
      .isInitialized()
      .then(() => {
        setIsKeycloakInitiated(true);
      })
      .catch(() => {
        setIsKeycloakInitFail(true);
      })
      .finally(() => {
        setIsKeycloakInitInProcess(false);
      });
  }, []);

  // Prevent using incompatible environment and deployment
  const pncUrl = webConfigService.getPncUrl();
  if (
    // https://example.com
    !pncUrl.startsWith(window.location.origin) &&
    !(
      process.env.REACT_APP_WEB_UI_URL === window.location.origin ||
      process.env.REACT_APP_WEB_SECONDARY_UI_URL === window.location.origin
    ) &&
    // example.com
    window.location.hostname !== 'localhost'
  ) {
    console.error('Wrong Global Configuration is provided');
    return (
      <div>
        Wrong Global Configuration is provided, contact PNC administrators.
        <br />
        <br />
        Global Configuration is pointing to:
        <br />
        <code>{pncUrl}</code>
        <br />
        but currently used deployment is:
        <br />
        <code>{window.location.origin}</code>
      </div>
    );
  }

  // Prevent using production environment from localhost
  const pncUrlParsed = new URL(pncUrl);
  if (window.location.hostname === 'localhost' && pncUrlParsed.hostname.split('.')[0] === 'orch') {
    return (
      <div>
        You are trying to use <b>production</b> environment from <code>localhost</code>. Disable temporarily this check if it's
        intended.
        <br />
        <br />
        Global Configuration is pointing to:
        <br />
        <code>{pncUrl}</code>
        <br />
        but currently used deployment is:
        <br />
        <code>{window.location.origin}</code>
      </div>
    );
  }

  // see also https://github.com/remix-run/react-router/issues/8427#issuecomment-1056988913
  if (process.env.NODE_ENV === 'development' && !window.location.pathname.startsWith(URL_BASE_PATH)) {
    const message = `Redirection to ${URL_BASE_PATH}/...`;
    console.log(message);
    window.location.href = URL_BASE_PATH + window.location.pathname;

    return <div>{message}</div>;
  }

  if (isKeycloakInitiated || isKeycloakInitFail) {
    return (
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    );
  }

  if (isKeycloakInitInProcess) {
    return <div>keycloak initialization</div>;
  }

  throw new Error('Keycloak initialization state is invalid.');
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
