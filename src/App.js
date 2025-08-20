import React, { useState, useEffect } from 'react';
import MLTradingDashboard from './components/MLTradingDashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app and fetch data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Quantum Trade AI...');
        
        // Simulate loading
        setTimeout(() => {
          setIsLoading(false);
          console.log('✅ App initialized successfully');
        }, 2000);
        
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0f172a',
        color: 'white'
      }}>
        <div>
          <h2>🚀 Initializing Quantum Trade AI...</h2>
          <p>Loading your advanced trading system...</p>
        </div>
      </div>
    );
  }

  return <MLTradingDashboard />;
}

export default App;
