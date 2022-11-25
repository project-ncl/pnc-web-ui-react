import React from 'react';

import { SystemErrorPage } from 'components/SystemErrorPage/SystemErrorPage';

import { uiLogger } from 'services/uiLogger';

export interface ErrorBoundaryProps {
  children: React.ReactChild;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    uiLogger.error('Error Boundary - Uncaught error', error);
  }

  render() {
    if (this.state.hasError) {
      return <SystemErrorPage />;
    }

    return this.props.children;
  }
}
