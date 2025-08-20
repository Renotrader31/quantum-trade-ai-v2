import React, { useState, useEffect } from 'react';
import realDataService from '../services/realDataService';

const OptionsFlow = () => {
    const [optionsData, setOptionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const fetchOptionsFlow = async (symbol = null) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('📊 Fetching options flow data...', symbol || 'all');
            const data = await realDataService.getUnusualWhalesOptionsFlow(symbol);
            setOptionsData(Array.isArray(data) ? data : data.data || []);
            setLastUpdate(new Date());
            console.log('✅ Options flow data fetched successfully');
        } catch (error) {
            console.error('❌ Failed to fetch options flow:', error);
            setError(error.message);
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOptionsFlow();
        
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchOptionsFlow(selectedSymbol);
            }, 60000); // Refresh every minute
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, selectedSymbol]);

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount}`;
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const getFlowIndicator = (type) => {
        switch (type?.toLowerCase()) {
            case 'call':
                return { icon: '📈', color: 'text-green-400', bg: 'bg-green-900/20' };
            case 'put':
                return { icon: '📉', color: 'text-red-400', bg: 'bg-red-900/20' };
            default:
                return { icon: '📊', color: 'text-blue-400', bg: 'bg-blue-900/20' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            🐋 Unusual Whales Options Flow
                        </h2>
                        <div className={`flex items-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-400">
                                {isLoading ? 'Loading...' : autoRefresh ? 'Live' : 'Paused'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Filter by symbol (e.g. AAPL)"
                                value={selectedSymbol}
                                onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
                            />
                            <button
                                onClick={() => fetchOptionsFlow(selectedSymbol)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
                                autoRefresh 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                        >
                            Auto: {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {lastUpdate && (
                    <div className="mt-2 text-sm text-gray-400">
                        Last update: {lastUpdate.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                            <h3 className="text-lg font-semibold text-red-400">Error Loading Options Flow</h3>
                            <p className="text-sm text-gray-400 mt-1">{error}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                This might be due to API rate limits, authentication issues, or network problems.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Options Flow Data */}
            {!error && (
                <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Options Activity</h3>
                    
                    {isLoading && optionsData.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading options flow data...</p>
                        </div>
                    ) : optionsData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <span className="text-4xl mb-4 block">🔍</span>
                            <p>No options flow data available</p>
                            <p className="text-sm mt-2">Try refreshing or check your API configuration</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {optionsData.slice(0, 20).map((flow, index) => {
                                const indicator = getFlowIndicator(flow.type || flow.call_put);
                                
                                return (
                                    <div 
                                        key={index}
                                        className={`${indicator.bg} border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{indicator.icon}</span>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">
                                                            {flow.symbol || flow.ticker}
                                                        </span>
                                                        <span className={`${indicator.color} font-semibold text-sm`}>
                                                            {(flow.type || flow.call_put || '').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        Strike: ${flow.strike || flow.strike_price} | 
                                                        Exp: {flow.expiration || flow.exp_date}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className="font-bold text-lg">
                                                    {formatCurrency(flow.premium || flow.total_premium || 0)}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    Vol: {(flow.volume || 0).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatTime(flow.timestamp || flow.time || Date.now())}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {(flow.sentiment || flow.direction) && (
                                            <div className="mt-2 pt-2 border-t border-gray-700">
                                                <span className="text-sm text-gray-400">
                                                    Sentiment: 
                                                    <span className={`ml-1 font-semibold ${
                                                        (flow.sentiment || flow.direction)?.toLowerCase().includes('bull') 
                                                            ? 'text-green-400' 
                                                            : 'text-red-400'
                                                    }`}>
                                                        {flow.sentiment || flow.direction}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Summary Stats */}
            {optionsData.length > 0 && (
                <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">📈 Flow Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-2">Total Flows</div>
                            <div className="text-2xl font-bold text-blue-400">
                                {optionsData.length}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-2">Calls</div>
                            <div className="text-2xl font-bold text-green-400">
                                {optionsData.filter(f => 
                                    (f.type || f.call_put || '').toLowerCase().includes('call')
                                ).length}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-2">Puts</div>
                            <div className="text-2xl font-bold text-red-400">
                                {optionsData.filter(f => 
                                    (f.type || f.call_put || '').toLowerCase().includes('put')
                                ).length}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-2">Total Premium</div>
                            <div className="text-2xl font-bold text-yellow-400">
                                {formatCurrency(
                                    optionsData.reduce((sum, f) => 
                                        sum + (f.premium || f.total_premium || 0), 0
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptionsFlow;