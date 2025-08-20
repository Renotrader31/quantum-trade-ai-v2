import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SimpleApp from './SimpleApp';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';

// Add console log to verify the app is starting
console.log('🚀 Quantum Trade AI - Starting application...');
console.log('🔧 Build timestamp:', new Date().toISOString());

// Try to load main app, fallback to simple app if issues
let AppComponent = App;

// Check if we should use simple app for debugging
const useSimpleApp = window.location.search.includes('simple=true');

if (useSimpleApp) {
  console.log('🔧 Using Simple App for debugging');
  AppComponent = SimpleApp;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppComponent />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Failed to render main app, using fallback:', error);
  root.render(
    <React.StrictMode>
      <SimpleApp />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
