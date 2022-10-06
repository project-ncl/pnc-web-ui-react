import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

import { keycloakService } from './services/keycloakService';

import { AppLayout } from './AppLayout';
import { AppRoutes } from './AppRoutes';
import './index.css';
import reportWebVitals from './reportWebVitals';

const App = () => {
  const [isKeycloakInitiated, setIsKeycloakInitiated] = useState<boolean>(false);
  const [isKeycloakInitFail, setIsKeycloakInitFail] = useState<boolean>(false);
  const [isKeycloakInitInProcess, setIsKeycloakInitInProcess] = useState<boolean>(true);

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

  // see also https://github.com/remix-run/react-router/issues/8427#issuecomment-1056988913
  const URL_BASE_PATH = '/pnc-web';
  if (process.env.NODE_ENV === 'development' && !window.location.pathname.startsWith(URL_BASE_PATH)) {
    const message = `Redirection to ${URL_BASE_PATH}/...`;
    console.log(message);
    window.location.href = URL_BASE_PATH + window.location.pathname;

    return <div>{message}</div>;
  }

  if (isKeycloakInitiated || isKeycloakInitFail) {
    return (
      <ErrorBoundary>
        <BrowserRouter basename="/pnc-web">
          <AppLayout>
            <AppRoutes></AppRoutes>
          </AppLayout>
        </BrowserRouter>
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
