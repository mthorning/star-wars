import React, { ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactElement | React.ReactElement[];
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// This is a copy & paste from https://reactjs.org/docs/error-boundaries.html, as this is
// an example app I will just use an error boundary for error handling.
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
