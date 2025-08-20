import React, { useState, useEffect } from 'react';
import useTradingStore from '../stores/tradingStore';
import apiService from '../services/apiService';

const LiveDataFeed = () => {
    const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [priceHistory, setPriceHistory] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { marketData, updateMarketData } = useTradingStore();

    const symbols = ['AAPL', 'NVDA', 'TSLA', 'SPY', 'QQQ', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD'];
    const intervals = [
        { value: 10, label: '10 seconds' },
        { value: 30, label: '30 seconds' },
        { value: 60, label: '1 minute' },
        { value: 300, label: '5 minutes' }
    ];

    // Auto-refresh data
    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            if (isLoading) return;
            
            setIsLoading(true);
            try {
                const overview = await apiService.getMarketOverview();
                updateMarketData(overview.stocks);
                setLastUpdate(new Date());

                // Update price history for charts
                setPriceHistory(prev => {
                    const newHistory = { ...prev };
                    Object.entries(overview.stocks).forEach(([symbol, data]) => {
                        if (!newHistory[symbol]) {
                            newHistory[symbol] = [];
                        }
                        newHistory[symbol].push({
                            price: data.price,
                            timestamp: Date.now(),
                            volume: data.volume
                        });
                        // Keep only last 50 data points
                        if (newHistory[symbol].length > 50) {
                            newHistory[symbol] = newHistory[symbol].slice(-50);
                        }
                    });
                    return newHistory;
                });
            } catch (error) {
                console.error('Error fetching market data:', error);
            }
            setIsLoading(false);
        };

        // Initial fetch
        fetchData();

        // Set up interval if auto-refresh is enabled
        if (autoRefresh) {
            intervalId = setInterval(fetchData, refreshInterval * 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [autoRefresh, refreshInterval, updateMarketData, isLoading]);

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
    };

    const formatVolume = (volume) => {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        return volume.toString();
    };

    const getPriceChangeIndicator = (symbol) => {
        const history = priceHistory[symbol];
        if (!history || history.length < 2) return '●';
        
        const current = history[history.length - 1].price;
        const previous = history[history.length - 2].price;
        
        if (current > previous) return '▲';
        if (current < previous) return '▼';
        return '●';
    };

    const selectedStock = marketData[selectedSymbol];
    const selectedHistory = priceHistory[selectedSymbol] || [];

    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            📈 Live Market Data
                        </h2>
                        <div className={`flex items-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-400">
                                {autoRefresh ? 'Live' : 'Paused'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-400">Auto Refresh:</label>
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                    autoRefresh 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                            >
                                {autoRefresh ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-400">Interval:</label>
                            <select
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            >
                                {intervals.map(interval => (
                                    <option key={interval.value} value={interval.value}>
                                        {interval.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {lastUpdate && (
                            <div className="text-sm text-gray-400">
                                Last update: {lastUpdate.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market Overview */}
                <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Market Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                        {symbols.map(symbol => {
                            const stock = marketData[symbol];
                            if (!stock) return null;

                            const isSelected = symbol === selectedSymbol;
                            const indicator = getPriceChangeIndicator(symbol);

                            return (
                                <div
                                    key={symbol}
                                    onClick={() => setSelectedSymbol(symbol)}
                                    className={`bg-gray-800 rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-700 ${
                                        isSelected ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm">{symbol}</span>
                                        <span className={`text-xs ${
                                            stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {indicator}
                                        </span>
                                    </div>
                                    
                                    <div className="text-lg font-bold">
                                        ${formatPrice(stock.price)}
                                    </div>
                                    
                                    <div className={`text-xs ${
                                        stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </div>
                                    
                                    <div className="text-xs text-gray-400 mt-1">
                                        Vol: {formatVolume(stock.volume)}
                                    </div>
                                    
                                    <div className="text-xs text-blue-400">
                                        {stock.source}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Stock Details */}
                <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">
                        {selectedSymbol} Details
                    </h3>
                    
                    {selectedStock ? (
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="text-2xl font-bold mb-2">
                                    ${formatPrice(selectedStock.price)}
                                </div>
                                <div className={`text-sm font-semibold ${
                                    selectedStock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {selectedStock.changePercent >= 0 ? '+' : ''}
                                    ${selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Open:</span>
                                    <span>${formatPrice(selectedStock.open)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">High:</span>
                                    <span className="text-green-400">${formatPrice(selectedStock.high)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Low:</span>
                                    <span className="text-red-400">${formatPrice(selectedStock.low)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Volume:</span>
                                    <span>{formatVolume(selectedStock.volume)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Source:</span>
                                    <span className="text-blue-400">{selectedStock.source}</span>
                                </div>
                            </div>

                            {/* Mini Price Chart */}
                            {selectedHistory.length > 1 && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Price Trend</h4>
                                    <div className="h-20 flex items-end space-x-1">
                                        {selectedHistory.slice(-20).map((point, idx) => {
                                            const maxPrice = Math.max(...selectedHistory.slice(-20).map(p => p.price));
                                            const minPrice = Math.min(...selectedHistory.slice(-20).map(p => p.price));
                                            const range = maxPrice - minPrice || 1;
                                            const height = ((point.price - minPrice) / range) * 60 + 10;
                                            
                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-blue-500 w-2 rounded-t"
                                                    style={{ height: `${height}px` }}
                                                    title={`$${point.price.toFixed(2)}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        Last {Math.min(20, selectedHistory.length)} updates
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            Select a symbol to view details
                        </div>
                    )}
                </div>
            </div>

            {/* Market Statistics */}
            <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">📊 Market Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Symbols Tracked</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {Object.keys(marketData).length}
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Gainers</div>
                        <div className="text-2xl font-bold text-green-400">
                            {Object.values(marketData).filter(stock => stock.changePercent > 0).length}
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Losers</div>
                        <div className="text-2xl font-bold text-red-400">
                            {Object.values(marketData).filter(stock => stock.changePercent < 0).length}
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Avg Change</div>
                        <div className={`text-2xl font-bold ${
                            Object.values(marketData).length > 0 && 
                            (Object.values(marketData).reduce((sum, stock) => sum + stock.changePercent, 0) / Object.values(marketData).length) >= 0 
                                ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {Object.values(marketData).length > 0 
                                ? (Object.values(marketData).reduce((sum, stock) => sum + stock.changePercent, 0) / Object.values(marketData).length).toFixed(2)
                                : '0.00'
                            }%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveDataFeed;
