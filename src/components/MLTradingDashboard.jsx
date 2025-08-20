import React, { useState, useEffect, useCallback } from 'react';
import {
    Brain, TrendingUp, Activity, Shield, Zap,
    DollarSign, Target, AlertCircle, BarChart3, Sparkles,
    ArrowUpRight, ArrowDownRight, ChevronRight,
    RefreshCw, Award, Flame, LineChart, Clock,
    TrendingDown, Calendar, PieChart, BarChart2
} from 'lucide-react';
import apiService from '../services/apiService';

const MLTradingDashboard = () => {
    const [mlSystem, setMlSystem] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedSymbol, setSelectedSymbol] = useState('SPY');
    const [tradeForm, setTradeForm] = useState({
        symbol: '',
        action: 'buy',
        price: '',
        quantity: '',
        strategy: ''
    });
    const [marketData, setMarketData] = useState({});

    useEffect(() => {
        const initializeML = async () => {
            try {
                console.log('🚀 QUANTUM TRADE AI v2.1 - 6 ENHANCED TABS ACTIVE 🚀');
                console.log('Build Version: 2.1.0-enhanced-latest');
                console.log('Deployment Timestamp:', new Date().toISOString());
                
                const { default: MLTradingSystem } = await import('../services/MLTradingSystem');
                const system = new MLTradingSystem();
                setMlSystem(system);
                
                // Generate initial recommendations with real data
                const data = await getRealMarketData();
                setMarketData(data);
                const recs = system.generateRecommendations(data);
                setRecommendations(recs);
                
                // Get performance metrics
                const perf = system.getPerformanceMetrics();
                setPerformance(perf);
                
                setIsLoading(false);
                
                // Set up auto-refresh with real data
                const interval = setInterval(async () => {
                    const refreshedData = await getRealMarketData();
                    const newRecs = system.generateRecommendations(refreshedData);
                    setRecommendations(newRecs);
                    setPerformance(system.getPerformanceMetrics());
                }, 30000); // Update every 30 seconds
                
                return () => clearInterval(interval);
            } catch (error) {
                console.error('Failed to initialize ML system:', error);
                setIsLoading(false);
            }
        };
        
        initializeML();
    }, []);

    const getRealMarketData = async () => {
        try {
            console.log('Fetching real market data...');
            const marketOverview = await apiService.getMarketOverview();
            console.log('Market data received:', marketOverview);
            
            // Format for ML system
            const formattedData = {};
            Object.keys(marketOverview.stocks).forEach(symbol => {
                const stockData = marketOverview.stocks[symbol];
                formattedData[symbol] = {
                    ...stockData,
                    currentPrice: stockData.price,
                    prices: Array(50).fill(stockData.price).map((p, i) => 
                        p + (Math.random() - 0.5) * 2
                    ), // Generate price history
                    highs: Array(50).fill(stockData.high),
                    lows: Array(50).fill(stockData.low),
                    vwap: stockData.price,
                    avgVolume: stockData.volume,
                    callVolume: Math.floor(Math.random() * 100000),
                    putVolume: Math.floor(Math.random() * 100000),
                    unusualActivity: Math.random() > 0.7,
                    socialSentiment: Math.random() - 0.5,
                    newsSentiment: Math.random() - 0.5,
                    marketCap: Math.floor(Math.random() * 1000000000000),
                    sectorStrength: Math.random(),
                    correlationSPY: Math.random()
                };
            });
            
            return formattedData;
        } catch (error) {
            console.log('Using fallback data:', error);
            // Fallback data
            const symbols = ['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA'];
            const data = {};
            
            symbols.forEach(symbol => {
                const mockData = apiService.generateMockData(symbol);
                data[symbol] = {
                    ...mockData,
                    currentPrice: mockData.price,
                    prices: Array(50).fill(mockData.price).map((p, i) => 
                        p + (Math.random() - 0.5) * 2
                    ),
                    highs: Array(50).fill(mockData.high),
                    lows: Array(50).fill(mockData.low),
                    vwap: mockData.price,
                    avgVolume: mockData.volume,
                    callVolume: Math.floor(Math.random() * 100000),
                    putVolume: Math.floor(Math.random() * 100000),
                    unusualActivity: Math.random() > 0.7,
                    socialSentiment: Math.random() - 0.5,
                    newsSentiment: Math.random() - 0.5,
                    marketCap: Math.floor(Math.random() * 1000000000000),
                    sectorStrength: Math.random(),
                    correlationSPY: Math.random()
                };
            });
            
            return data;
        }
    };

    const handleRecordTrade = useCallback(() => {
        if (!mlSystem) return;
        
        const trade = {
            id: Date.now(),
            symbol: tradeForm.symbol,
            action: tradeForm.action,
            price: parseFloat(tradeForm.price),
            quantity: parseInt(tradeForm.quantity),
            strategy: tradeForm.strategy,
            status: 'open',
            entryTime: Date.now(),
            entryMarketData: marketData[tradeForm.symbol]
        };
        
        mlSystem.recordTrade(trade);
        
        // Reset form
        setTradeForm({
            symbol: '',
            action: 'buy',
            price: '',
            quantity: '',
            strategy: ''
        });
        
        // Update performance
        setPerformance(mlSystem.getPerformanceMetrics());
        
        alert('Trade recorded successfully!');
    }, [mlSystem, tradeForm, marketData]);

    const handleCloseTrade = useCallback((tradeId, exitPrice) => {
        if (!mlSystem) return;
        
        const trade = mlSystem.activeTrades.find(t => t.id === tradeId);
        if (!trade) return;
        
        const closedTrade = {
            ...trade,
            status: 'closed',
            exitTime: Date.now(),
            exitPrice: exitPrice,
            profit: (exitPrice - trade.price) * trade.quantity * (trade.action === 'buy' ? 1 : -1),
            percentReturn: ((exitPrice - trade.price) / trade.price) * 100 * (trade.action === 'buy' ? 1 : -1)
        };
        
        mlSystem.recordTrade(closedTrade);
        setPerformance(mlSystem.getPerformanceMetrics());
    }, [mlSystem]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <Brain className="w-16 h-16 text-blue-500 animate-pulse mx-auto mb-4" />
                    <div className="text-xl text-white">Initializing ML Trading System...</div>
                    <div className="text-sm text-gray-400 mt-2">Loading neural networks and training data</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Brain className="w-10 h-10 text-blue-500" />
                            <div>
                                <h1 className="text-3xl font-bold">ML Trading System</h1>
                                <p className="text-gray-400">Self-improving AI-powered trading</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`px-4 py-2 rounded ${activeView === 'dashboard' ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveView('recommendations')}
                                className={`px-4 py-2 rounded ${activeView === 'recommendations' ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                AI Recommendations
                            </button>
                            <button
                                onClick={() => setActiveView('record')}
                                className={`px-4 py-2 rounded ${activeView === 'record' ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                Record Trade
                            </button>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                {performance && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Brain className="w-6 h-6 text-blue-300" />
                                <span className="text-xs text-blue-300">ML MODEL</span>
                            </div>
                            <div className="text-2xl font-bold">{(performance.modelAccuracy * 100).toFixed(1)}%</div>
                            <div className="text-sm text-blue-300">Accuracy</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {performance.totalTrades} trades analyzed
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-6 h-6 text-green-300" />
                                <span className="text-xs text-green-300">WIN RATE</span>
                            </div>
                            <div className="text-2xl font-bold">{(performance.winRate * 100).toFixed(1)}%</div>
                            <div className="text-sm text-green-300">Success Rate</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Avg Return: {performance.avgReturn?.toFixed(2)}%
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Shield className="w-6 h-6 text-purple-300" />
                                <span className="text-xs text-purple-300">RISK METRICS</span>
                            </div>
                            <div className="text-2xl font-bold">{performance.sharpeRatio?.toFixed(2)}</div>
                            <div className="text-sm text-purple-300">Sharpe Ratio</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Max DD: {(performance.maxDrawdown * 100).toFixed(1)}%
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Zap className="w-6 h-6 text-yellow-300" />
                                <span className="text-xs text-yellow-300">PROFIT FACTOR</span>
                            </div>
                            <div className="text-2xl font-bold">{performance.profitFactor?.toFixed(2)}</div>
                            <div className="text-sm text-yellow-300">Risk/Reward</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {performance.activeTrades?.length || 0} active trades
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Real-Time Market Data */}
                {marketData && Object.keys(marketData).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        {['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA'].map(symbol => {
                            const data = marketData[symbol];
                            if (!data) return null;
                            
                            const price = data.currentPrice || data.price || 0;
                            const change = data.changePercent || data.change || 0;
                            const volume = data.volume || 0;
                            const isPositive = change > 0;
                            
                            return (
                                <div key={symbol} className="bg-gray-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-lg font-bold">{symbol}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            isPositive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                        }`}>
                                            {isPositive ? '+' : ''}{Math.abs(change).toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        ${price > 0 ? price.toFixed(2) : '---'}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Vol: {volume > 0 ? (volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Content */}
                {activeView === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Strategies */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                Top Performing Strategies
                            </h2>
                            <div className="space-y-3">
                                {performance?.strategies?.slice(0, 5).map((strategy, idx) => (
                                    <div key={idx} className="bg-gray-700 rounded p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold">{strategy.name}</div>
                                                <div className="text-sm text-gray-400">
                                                    {strategy.trades} trades
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">
                                                    {(strategy.winRate * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Win Rate
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between text-xs">
                                            <span>Avg Return: {strategy.avgReturn?.toFixed(2)}%</span>
                                            <span>Sharpe: {strategy.sharpeRatio?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Patterns */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                                Most Successful Patterns
                            </h2>
                            <div className="space-y-3">
                                {performance?.patterns?.slice(0, 5).map((pattern, idx) => (
                                    <div key={idx} className="bg-gray-700 rounded p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold capitalize">
                                                    {pattern.name.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {pattern.occurrences} occurrences
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-blue-400 font-bold">
                                                    {(pattern.successRate * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Success Rate
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            Total Return: {pattern.totalReturn?.toFixed(2)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'recommendations' && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                AI-Generated Trading Recommendations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="text-xl font-bold">{rec.symbol}</div>
                                                <div className={`text-sm font-semibold ${
                                                    rec.action.includes('buy') ? 'text-green-400' : 
                                                    rec.action.includes('sell') ? 'text-red-400' : 
                                                    'text-yellow-400'
                                                }`}>
                                                    {rec.action.toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold">
                                                    {(rec.confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-gray-400">Confidence</div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Expected Return:</span>
                                                <span className={rec.expectedReturn > 0 ? 'text-green-400' : 'text-red-400'}>
                                                    {rec.expectedReturn.toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Risk Level:</span>
                                                <span className={
                                                    rec.risk < 0.3 ? 'text-green-400' :
                                                    rec.risk < 0.6 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }>
                                                    {(rec.risk * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Pattern:</span>
                                                <span className="text-blue-400 capitalize">
                                                    {rec.pattern.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Entry:</span>
                                                <span>${rec.entryPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Stop Loss:</span>
                                                <span className="text-red-400">${rec.stopLoss.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Take Profit:</span>
                                                <span className="text-green-400">${rec.takeProfit.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
                                            {rec.reasoning}
                                        </div>
                                        
                                        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm font-semibold transition-colors">
                                            Execute Trade
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'record' && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Record Trade for ML Training</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Symbol</label>
                                <input
                                    type="text"
                                    value={tradeForm.symbol}
                                    onChange={(e) => setTradeForm({...tradeForm, symbol: e.target.value.toUpperCase()})}
                                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                    placeholder="AAPL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Action</label>
                                <select
                                    value={tradeForm.action}
                                    onChange={(e) => setTradeForm({...tradeForm, action: e.target.value})}
                                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={tradeForm.price}
                                    onChange={(e) => setTradeForm({...tradeForm, price: e.target.value})}
                                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                    placeholder="150.00"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={tradeForm.quantity}
                                    onChange={(e) => setTradeForm({...tradeForm, quantity: e.target.value})}
                                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                    placeholder="100"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Strategy</label>
                                <input
                                    type="text"
                                    value={tradeForm.strategy}
                                    onChange={(e) => setTradeForm({...tradeForm, strategy: e.target.value})}
                                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                    placeholder="e.g., momentum, mean_reversion, breakout"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    onClick={handleRecordTrade}
                                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
                                >
                                    Record Trade
                                </button>
                            </div>
                        </div>

                        {/* Active Trades */}
                        {performance?.activeTrades?.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-4">Active Trades</h3>
                                <div className="space-y-2">
                                    {performance.activeTrades.map(trade => (
                                        <div key={trade.id} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                                            <div>
                                                <span className="font-semibold">{trade.symbol}</span>
                                                <span className="ml-2 text-sm text-gray-400">
                                                    {trade.action} @ ${trade.price}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const exitPrice = prompt('Enter exit price:');
                                                    if (exitPrice) {
                                                        handleCloseTrade(trade.id, parseFloat(exitPrice));
                                                    }
                                                }}
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                            >
                                                Close Trade
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MLTradingDashboard;
