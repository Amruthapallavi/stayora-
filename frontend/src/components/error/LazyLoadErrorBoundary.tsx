import  { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class LazyLoadErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to your error reporting service
    console.error('Lazy loading error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoBack = (): void => {
    window.history.back();
  };

render(): ReactNode {
  if (this.state.hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-yellow-600 px-4">
        <div className="text-center p-6 md:p-8 border border-white/10 rounded-xl shadow-2xl bg-white/5 backdrop-blur-lg max-w-md w-full">
          <div className="mb-5">
            <svg 
              className="mx-auto h-16 w-16 text-yellow-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Something Went Wrong</h2>
          <p className="text-sm text-black mb-6 ">
            We couldn’t load this page. It might be due to a network issue or internal error.
          </p>

          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleGoBack}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition"
            >
              Go Back
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left text-sm text-gray-400">
              <summary className="cursor-pointer">
                Error Details (Dev)
              </summary>
              <pre className="mt-2 text-xs bg-black/40 text-gray-300 p-3 rounded overflow-auto max-h-60">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return this.props.children;
}

}

export default LazyLoadErrorBoundary;