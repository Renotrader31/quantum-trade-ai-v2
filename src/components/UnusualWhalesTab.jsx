import React, { useState, useEffect } from 'react';
import liveDataService from '../services/liveDataService';

const UnusualWhalesTab = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedSymbol, setSelectedSymbol] = useState('SPY');
    const [activeView, setActiveView] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const symbols = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL'];

    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const data = await liveDataService.getUnusualWhalesDashboard(symbols);
            setDashboardData(data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error loading UW dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOverview = () => {
        if (!dashboardData) return null;

        const { summary } = dashboardData;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">🌊 Dark Pool Volume</h3>
                    <p className="text-3xl font-bold">{(summary.totalDarkPoolVolume / 1000000).toFixed(1)}M</p>
                    <p className="text-blue-100 text-sm">Total across all symbols</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">📊 Options Volume</h3>
                    <p className="text-3xl font-bold">{(summary.totalOptionsVolume / 1000).toFixed(0)}K</p>
                    <p className="text-green-100 text-sm">Unusual activity detected</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">🎯 Flow Sentiment</h3>
                    <p className="text-2xl font-bold">
                        🟢 {summary.bullishFlow} / 🔴 {summary.bearishFlow}
                    </p>
                    <p className="text-purple-100 text-sm">Bullish vs Bearish</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">📈 Avg IV</h3>
                    <p className="text-3xl font-bold">{(summary.averageIV * 100).toFixed(1)}%</p>
                    <p className="text-orange-100 text-sm">Implied Volatility</p>
                </div>
            </div>
        );
    };

    const renderDarkPools = () => {
        const symbolData = dashboardData?.symbols[selectedSymbol];
        const darkPools = symbolData?.darkPools || [];

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">🌊 Dark Pool Activity - {selectedSymbol}</h3>
                
                {darkPools.length === 0 ? (
                    <p className="text-gray-500">No dark pool data available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Center</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {darkPools.slice(0, 20).map((trade, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(trade.executed_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${trade.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trade.size?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trade.volume?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                            ${parseFloat(trade.premium).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {trade.market_center}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderOptionsFlow = () => {
        const symbolData = dashboardData?.symbols[selectedSymbol];
        const optionsFlow = symbolData?.optionsFlow || [];

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Options Flow - {selectedSymbol}</h3>
                
                {optionsFlow.length === 0 ? (
                    <p className="text-gray-500">No options flow data available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strike</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IV</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {optionsFlow.slice(0, 20).map((option, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(option.executed_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                option.option_type === 'call' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {option.option_type?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${option.strike}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {option.expiry}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                            ${parseFloat(option.premium).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(parseFloat(option.implied_volatility) * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(option.delta).toFixed(3)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {option.tags?.map(tag => (
                                                <span key={tag} className={`inline-block px-2 py-1 text-xs rounded mr-1 ${
                                                    tag === 'bullish' ? 'bg-green-100 text-green-800' : 
                                                    tag === 'bearish' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderGEX = () => {
        const symbolData = dashboardData?.symbols[selectedSymbol];
        const gexData = symbolData?.gexData || [];

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">⚡ Gamma Exposure (GEX) - {selectedSymbol}</h3>
                
                {gexData.length === 0 ? (
                    <p className="text-gray-500">No GEX data available</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {gexData.slice(0, 4).map((gex, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Price Level: ${gex.price}</h4>
                                    <span className="text-sm text-gray-500">
                                        {new Date(gex.time).toLocaleTimeString()}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Gamma (1% move)</p>
                                        <p className="font-medium text-blue-600">
                                            {parseFloat(gex.gamma_per_one_percent_move_dir).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Charm (1% move)</p>
                                        <p className="font-medium text-green-600">
                                            {parseFloat(gex.charm_per_one_percent_move_dir).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Vanna (1% move)</p>
                                        <p className="font-medium text-purple-600">
                                            {parseFloat(gex.vanna_per_one_percent_move_dir).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Gamma OI</p>
                                        <p className="font-medium text-indigo-600">
                                            {parseFloat(gex.gamma_per_one_percent_move_oi).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderGreeks = () => {
        const symbolData = dashboardData?.symbols[selectedSymbol];
        const greeksData = symbolData?.greeksData || [];

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">🔢 Greeks Analysis - {selectedSymbol}</h3>
                
                {greeksData.length === 0 ? (
                    <p className="text-gray-500">No Greeks data available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Delta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Delta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Gamma</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Gamma</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Vanna</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Vanna</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {greeksData.slice(0, 10).map((greeks, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {greeks.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                            {parseFloat(greeks.call_delta).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                            {parseFloat(greeks.put_delta).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                            {parseFloat(greeks.call_gamma).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                                            {parseFloat(greeks.put_gamma).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                                            {parseFloat(greeks.call_vanna).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                                            {parseFloat(greeks.put_vanna).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderVolatility = () => {
        const symbolData = dashboardData?.symbols[selectedSymbol];
        const volatility = symbolData?.volatility;

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Volatility Analysis - {selectedSymbol}</h3>
                
                {!volatility ? (
                    <p className="text-gray-500">No volatility data available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Implied Volatility</h4>
                            <p className="text-2xl font-bold text-blue-600">
                                {(parseFloat(volatility.iv) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-blue-600">
                                Range: {(parseFloat(volatility.iv_low) * 100).toFixed(1)}% - {(parseFloat(volatility.iv_high) * 100).toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Realized Volatility</h4>
                            <p className="text-2xl font-bold text-green-600">
                                {(parseFloat(volatility.rv) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-green-600">
                                Range: {(parseFloat(volatility.rv_low) * 100).toFixed(1)}% - {(parseFloat(volatility.rv_high) * 100).toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-800 mb-2">IV Rank</h4>
                            <p className="text-2xl font-bold text-purple-600">
                                {(parseFloat(volatility.iv_rank) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-purple-600">
                                Percentile ranking
                            </p>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-800 mb-2">Updated</h4>
                            <p className="text-lg font-bold text-orange-600">
                                {volatility.date}
                            </p>
                            <p className="text-sm text-orange-600">
                                Last update
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                return renderOverview();
            case 'darkpools':
                return renderDarkPools();
            case 'options':
                return renderOptionsFlow();
            case 'gex':
                return renderGEX();
            case 'greeks':
                return renderGreeks();
            case 'volatility':
                return renderVolatility();
            default:
                return renderOverview();
        }
    };

    if (loading && !dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🐋 Unusual Whales Premium Data
                        </h1>
                        <p className="text-gray-600">
                            Real-time dark pools, options flow, GEX, Greeks, and volatility analysis
                        </p>
                        {lastUpdate && (
                            <p className="text-sm text-gray-500 mt-1">
                                Last updated: {lastUpdate.toLocaleString()}
                            </p>
                        )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <select 
                            value={selectedSymbol} 
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {symbols.map(symbol => (
                                <option key={symbol} value={symbol}>{symbol}</option>
                            ))}
                        </select>
                        
                        <button 
                            onClick={loadDashboardData}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow">
                    {[
                        { key: 'overview', label: '📊 Overview', desc: 'Summary metrics' },
                        { key: 'darkpools', label: '🌊 Dark Pools', desc: 'Hidden liquidity' },
                        { key: 'options', label: '📈 Options Flow', desc: 'Unusual activity' },
                        { key: 'gex', label: '⚡ GEX', desc: 'Gamma exposure' },
                        { key: 'greeks', label: '🔢 Greeks', desc: 'Risk metrics' },
                        { key: 'volatility', label: '📉 Volatility', desc: 'IV analysis' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveView(tab.key)}
                            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                                activeView === tab.key
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            <div>{tab.label}</div>
                            <div className="text-xs opacity-75">{tab.desc}</div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
};

export default UnusualWhalesTab;