import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AppLayout } from './AppLayout';
import { AppRoutes } from './AppRoutes';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router basename="/pnc-web">
        <AppLayout>
          <AppRoutes></AppRoutes>
        </AppLayout>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
