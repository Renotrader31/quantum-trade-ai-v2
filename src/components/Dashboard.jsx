import React from 'react';
import useTradingStore from '../stores/tradingStore';

const Dashboard = () => {
    const { 
        marketData, 
        aiRecommendations, 
        getPerformanceMetrics 
    } = useTradingStore();
    
    const performance = getPerformanceMetrics();
    
    const topStocks = Object.entries(marketData)
        .sort(([,a], [,b]) => b.changePercent - a.changePercent)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Trades 📊</p>
                            <p className="text-2xl font-bold">{performance.totalTrades}</p>
                            <p className="text-blue-500 text-sm">Analyzed by AI</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Win Rate 🎯</p>
                            <p className="text-2xl font-bold">{performance.winRate}%</p>
                            <p className="text-green-500 text-sm">Success Rate</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Return 💰</p>
                            <p className={`text-2xl font-bold ${
                                performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                ${performance.totalReturn}
                            </p>
                            <p className="text-gray-500 text-sm">Avg: ${performance.avgReturn}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">AI Confidence 🧠</p>
                            <p className="text-2xl font-bold">87.3%</p>
                            <p className="text-purple-500 text-sm">High Accuracy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Overview */}
            <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Market Overview</h2>
                <div className="grid grid-cols-5 gap-4">
                    {topStocks.map(([symbol, data]) => (
                        <div key={symbol} className="bg-gray-800 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold">{symbol}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    data.changePercent >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                }`}>
                                    {data.changePercent >= 0 ? '+' : ''}{data.changePercent}%
                                </span>
                            </div>
                            <div className="text-lg font-bold">${data.price}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Vol: {(data.volume / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs text-blue-400 mt-1">
                                {data.source}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">🤖 AI Recommendations</h2>
                <div className="space-y-4">
                    {aiRecommendations.slice(0, 3).map((rec, idx) => (
                        <div key={idx} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold">{rec.symbol}</h3>
                                    <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                                        rec.action === 'BUY' ? 'bg-green-900 text-green-400' : 
                                        rec.action === 'SELL' ? 'bg-red-900 text-red-400' : 
                                        'bg-yellow-900 text-yellow-400'
                                    }`}>
                                        {rec.action}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold">{rec.confidence}%</div>
                                    <div className="text-xs text-gray-400">confidence</div>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-300 mb-2">
                                Strategy: {rec.strategy} • {rec.timeframe} • R:R {rec.riskReward}
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-3">
                                {rec.reasoning}
                            </p>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-gray-400 text-sm">Entry: </span>
                                    <span className="font-semibold">${rec.entryPrice}</span>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition-colors">
                                    Execute Trade
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
