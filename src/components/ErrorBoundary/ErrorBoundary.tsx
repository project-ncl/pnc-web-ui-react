import React, { Component, ErrorInfo, ReactNode } from 'react';
import SystemErrorPage from '../SystemErrorPage/SystemErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary - Uncaught error:', error, errorInfo);
    // @Todo: Implement the Error report to the backend, see NCL-6145
  }

  public render() {
    if (this.state.hasError) {
      return <SystemErrorPage></SystemErrorPage>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
