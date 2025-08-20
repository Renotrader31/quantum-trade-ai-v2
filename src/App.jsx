import React, { useState, useEffect } from 'react';
import useTradingStore from './stores/tradingStore';
import apiService from './services/apiService';
import mlService from './services/mlService';
import Dashboard from './components/Dashboard';
import AIStrategyGenerator from './components/AIStrategyGenerator';
import TradeRecorder from './components/TradeRecorder';
import LiveDataFeed from './components/LiveDataFeed';
import OptionsFlow from './components/OptionsFlow';
import TechnicalAnalysis from './components/TechnicalAnalysis';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    
    const {
        marketData,
        updateMarketData,
        setAIRecommendations,
        getPerformanceMetrics
    } = useTradingStore();

    // Initialize app and fetch data
    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log('🚀 Initializing Quantum Trade AI...');
                
                // Fetch initial market data
                const overview = await apiService.getMarketOverview();
                updateMarketData(overview.stocks);
                
                // Generate AI recommendations (enhanced with flow data)
                try {
                    // Try to get options flow data
                    let optionsFlowData = null;
                    try {
                        const { default: realDataService } = await import('./services/realDataService');
                        optionsFlowData = await realDataService.getOptionsFlowData();
                        console.log('📊 Options flow data fetched for AI analysis');
                    } catch (flowError) {
                        console.warn('⚠️ Options flow data not available:', flowError.message);
                    }
                    
                    const recommendations = await mlService.generateRecommendations(overview.stocks, optionsFlowData);
                    setAIRecommendations(recommendations);
                } catch (error) {
                    console.error('❌ Failed to generate AI recommendations:', error);
                    // Fallback to basic recommendations
                    const recommendations = await mlService.generateRecommendations(overview.stocks);
                    setAIRecommendations(recommendations);
                }
                
                setIsLoading(false);
                console.log('✅ App initialized successfully');
                
                // Set up periodic updates
                const interval = setInterval(async () => {
                    const freshData = await apiService.getMarketOverview();
                    updateMarketData(freshData.stocks);
                    
                    // Update recommendations with latest data
                    try {
                        let optionsFlowData = null;
                        try {
                            const { default: realDataService } = await import('./services/realDataService');
                            optionsFlowData = await realDataService.getOptionsFlowData();
                        } catch (flowError) {
                            console.warn('⚠️ Options flow data not available for update');
                        }
                        
                        const newRecommendations = await mlService.generateRecommendations(freshData.stocks, optionsFlowData);
                        setAIRecommendations(newRecommendations);
                    } catch (error) {
                        console.error('❌ Failed to update AI recommendations:', error);
                        const newRecommendations = await mlService.generateRecommendations(freshData.stocks);
                        setAIRecommendations(newRecommendations);
                    }
                }, 60000); // Update every minute
                
                return () => clearInterval(interval);
            } catch (error) {
                console.error('❌ Failed to initialize app:', error);
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'ai-strategy', name: 'AI Strategy', icon: '🤖' },
        { id: 'live-data', name: 'Live Data', icon: '📈' },
        { id: 'options-flow', name: 'Options Flow', icon: '🐋' },
        { id: 'technical-analysis', name: 'Technical Analysis', icon: '🔍' },
        { id: 'trade-recorder', name: 'Record Trade', icon: '📝' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <div className="text-2xl font-bold mb-2">Quantum Trade AI</div>
                    <div className="text-gray-400">Initializing neural networks...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🚀</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                    Quantum Trade AI v2 - VERCEL TEST
                                </span>
                            </div>
                            <div className="ml-6 text-sm text-gray-400">
                                Self-Learning Trading System
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <span className="text-gray-400">Data Sources:</span>
                                <div className="ml-2 flex items-center gap-2">
                                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">Polygon</span>
                                    <span className="text-xs bg-green-600 px-2 py-1 rounded">FMP</span>
                                    <span className="text-xs bg-purple-600 px-2 py-1 rounded">12Data</span>
                                    <span className="text-xs bg-orange-600 px-2 py-1 rounded">UW</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'ai-strategy' && <AIStrategyGenerator />}
                {activeTab === 'live-data' && <LiveDataFeed />}
                {activeTab === 'options-flow' && <OptionsFlow />}
                {activeTab === 'technical-analysis' && <TechnicalAnalysis />}
                {activeTab === 'trade-recorder' && <TradeRecorder />}
            </main>
        </div>
    );
}

export default App;
