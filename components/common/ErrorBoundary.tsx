'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border border-destructive bg-background p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-destructive">
                Algo salió mal
              </h2>
              <p className="text-sm text-muted-foreground">
                Ha ocurrido un error inesperado. Por favor, recarga la página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
