import React, { useState } from 'react';
import useTradingStore from '../stores/tradingStore';
import apiService from '../services/apiService';

const TradeRecorder = () => {
    const [tradeForm, setTradeForm] = useState({
        symbol: '',
        action: 'buy',
        quantity: '',
        entryPrice: '',
        exitPrice: '',
        strategy: '',
        notes: '',
        status: 'open'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { addTrade, tradeHistory, getPerformanceMetrics } = useTradingStore();

    const strategies = [
        'momentum', 'meanReversion', 'breakout', 'swing', 
        'scalping', 'aiGenerated', 'custom'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTradeForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateProfit = () => {
        if (!tradeForm.entryPrice || !tradeForm.exitPrice || !tradeForm.quantity) {
            return { profit: 0, percentage: 0 };
        }

        const entry = parseFloat(tradeForm.entryPrice);
        const exit = parseFloat(tradeForm.exitPrice);
        const qty = parseInt(tradeForm.quantity);

        let profit;
        if (tradeForm.action === 'buy') {
            profit = (exit - entry) * qty;
        } else {
            profit = (entry - exit) * qty;
        }

        const percentage = ((exit - entry) / entry) * 100 * (tradeForm.action === 'buy' ? 1 : -1);

        return {
            profit: profit.toFixed(2),
            percentage: percentage.toFixed(2)
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { profit, percentage } = calculateProfit();
            
            const trade = {
                ...tradeForm,
                entryPrice: parseFloat(tradeForm.entryPrice),
                exitPrice: tradeForm.exitPrice ? parseFloat(tradeForm.exitPrice) : null,
                quantity: parseInt(tradeForm.quantity),
                profit: parseFloat(profit),
                profitPercentage: parseFloat(percentage),
                entryTime: Date.now(),
                exitTime: tradeForm.status === 'closed' ? Date.now() : null
            };

            addTrade(trade);

            // Learn from trade if using ML service
            if (trade.status === 'closed') {
                apiService.learnFromTrade(trade);
            }

            setShowSuccess(true);
            setTradeForm({
                symbol: '',
                action: 'buy',
                quantity: '',
                entryPrice: '',
                exitPrice: '',
                strategy: '',
                notes: '',
                status: 'open'
            });

            setTimeout(() => setShowSuccess(false), 3000);
            
        } catch (error) {
            console.error('Error recording trade:', error);
        }

        setIsSubmitting(false);
    };

    const recentTrades = tradeHistory.slice(-5).reverse();
    const performance = getPerformanceMetrics();

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-green-400 text-xl mr-2">✅</span>
                        <span className="text-green-300">Trade recorded successfully!</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trade Entry Form */}
                <div className="bg-gray-900 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        📝 Record Trade
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Symbol
                                </label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={tradeForm.symbol}
                                    onChange={handleInputChange}
                                    placeholder="AAPL"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white uppercase"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Action
                                </label>
                                <select
                                    name="action"
                                    value={tradeForm.action}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={tradeForm.quantity}
                                    onChange={handleInputChange}
                                    placeholder="100"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Entry Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="entryPrice"
                                    value={tradeForm.entryPrice}
                                    onChange={handleInputChange}
                                    placeholder="150.00"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Exit Price (Optional)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="exitPrice"
                                    value={tradeForm.exitPrice}
                                    onChange={handleInputChange}
                                    placeholder="155.00"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={tradeForm.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Strategy
                            </label>
                            <select
                                name="strategy"
                                value={tradeForm.strategy}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                required
                            >
                                <option value="">Select Strategy</option>
                                {strategies.map(strategy => (
                                    <option key={strategy} value={strategy}>
                                        {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={tradeForm.notes}
                                onChange={handleInputChange}
                                placeholder="Trade reasoning, market conditions, etc..."
                                rows="3"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                            />
                        </div>

                        {/* Profit Calculation Display */}
                        {tradeForm.entryPrice && tradeForm.exitPrice && tradeForm.quantity && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Calculated P&L</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-400">Profit: </span>
                                        <span className={`font-semibold ${
                                            parseFloat(calculateProfit().profit) >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            ${calculateProfit().profit}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Return: </span>
                                        <span className={`font-semibold ${
                                            parseFloat(calculateProfit().percentage) >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {calculateProfit().percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition-colors"
                        >
                            {isSubmitting ? '📊 Recording Trade...' : '✅ Record Trade'}
                        </button>
                    </form>
                </div>

                {/* Recent Trades & Performance */}
                <div className="space-y-6">
                    {/* Performance Summary */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">📈 Performance Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-sm text-gray-400">Total Trades</div>
                                <div className="text-xl font-bold">{performance.totalTrades}</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-sm text-gray-400">Win Rate</div>
                                <div className={`text-xl font-bold ${
                                    performance.winRate >= 60 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {performance.winRate}%
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-sm text-gray-400">Total Return</div>
                                <div className={`text-xl font-bold ${
                                    performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    ${performance.totalReturn}
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-sm text-gray-400">Avg Return</div>
                                <div className={`text-xl font-bold ${
                                    performance.avgReturn >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    ${performance.avgReturn}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">🕐 Recent Trades</h3>
                        <div className="space-y-3">
                            {recentTrades.length > 0 ? (
                                recentTrades.map((trade, idx) => (
                                    <div key={trade.id || idx} className="bg-gray-800 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold">
                                                    {trade.symbol} 
                                                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                                        trade.action === 'buy' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                                    }`}>
                                                        {trade.action.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {trade.quantity} @ ${trade.entryPrice}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {trade.strategy} • {new Date(trade.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-semibold ${
                                                    trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    ${trade.profit}
                                                </div>
                                                <div className={`text-sm ${
                                                    trade.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {trade.profitPercentage}%
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded ${
                                                    trade.status === 'open' ? 'bg-yellow-900 text-yellow-400' : 'bg-gray-700 text-gray-400'
                                                }`}>
                                                    {trade.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-8">
                                    No trades recorded yet. Start by recording your first trade above!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeRecorder;
