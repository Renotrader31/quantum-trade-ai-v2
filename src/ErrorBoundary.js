import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React Error Boundary Caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#ff6b6b' }}>🚨 Quantum Trade AI - Error Detected</h1>
          <h2>Something went wrong with the application</h2>
          
          <div style={{ 
            backgroundColor: '#333', 
            padding: '15px', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3>Error Details:</h3>
            <pre style={{ color: '#ff9999', fontSize: '12px', overflow: 'auto' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            
            <h3>Stack Trace:</h3>
            <pre style={{ color: '#ccc', fontSize: '10px', overflow: 'auto' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>🔧 Troubleshooting:</h3>
            <ul>
              <li>Check browser console for additional errors</li>
              <li>Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)</li>
              <li>Clear browser cache and cookies</li>
              <li>Try opening in incognito/private mode</li>
            </ul>
            
            <button 
              onClick={() => window.location.reload()} 
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              🔄 Reload Application
            </button>
          </div>

          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            backgroundColor: '#0a4d0a', 
            borderRadius: '8px' 
          }}>
            <h3>✅ Expected Features (When Working):</h3>
            <ul>
              <li>📊 Dashboard - Performance metrics</li>
              <li>🤖 AI Strategy - 6 ML trading algorithms</li>
              <li>📈 Live Data - Real-time market feeds</li>
              <li>🐋 Options Flow - Whale tracking</li>
              <li>🔍 Technical Analysis - 20+ indicators</li>
              <li>📝 Record Trade - Performance tracking</li>
            </ul>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;