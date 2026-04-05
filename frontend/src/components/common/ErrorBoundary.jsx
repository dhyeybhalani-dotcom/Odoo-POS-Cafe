import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '400px', width: '100%', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)', borderRadius: '12px'
        }}>
          <AlertTriangle size={64} color="var(--danger)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
            {this.state.error?.message || "An unexpected rendering error occurred in this module."}
          </p>
          <Button variant="outline" onClick={this.handleRetry} startIcon={<RefreshCw size={16} />}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
