import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught:', error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '80px auto',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h1>
                    <p style={{ color: '#86868B', marginBottom: '24px' }}>
                        Please refresh the page. If the problem persists, contact us at stay@littleloutra.com.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            background: '#0077BE',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
