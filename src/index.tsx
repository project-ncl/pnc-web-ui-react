import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AppLayout } from './AppLayout';
import { AppRoutes } from './AppRoutes';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { keycloakService } from './services/keycloakService';

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

  if (isKeycloakInitiated) {
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

  if (isKeycloakInitFail) {
    return <div>Keycloak initialization failed</div>;
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
