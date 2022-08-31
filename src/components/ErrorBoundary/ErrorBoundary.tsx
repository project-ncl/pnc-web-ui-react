import React from 'react';

import { SystemErrorPage } from 'components/SystemErrorPage/SystemErrorPage';

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

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error Boundary - Uncaught error:', error, errorInfo);
    // @Todo: Implement the Error report to the backend, see NCL-6145
  }

  render() {
    if (this.state.hasError) {
      return <SystemErrorPage />;
    }

    return this.props.children;
  }
}
