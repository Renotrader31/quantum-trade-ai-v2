import React, { useState } from 'react';
import useTradingStore from '../stores/tradingStore';
import apiService from '../services/apiService';

const AIStrategyGenerator = () => {
    const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
    const [timeframe, setTimeframe] = useState('1D');
    const [riskLevel, setRiskLevel] = useState('medium');
    const [strategyType, setStrategyType] = useState('auto');
    const [generatedStrategy, setGeneratedStrategy] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const { marketData, aiRecommendations } = useTradingStore();

    const symbols = ['AAPL', 'NVDA', 'TSLA', 'SPY', 'QQQ', 'MSFT', 'GOOGL', 'AMZN'];
    const timeframes = ['1H', '4H', '1D', '1W'];
    const riskLevels = ['low', 'medium', 'high'];
    const strategyTypes = ['auto', 'momentum', 'meanReversion', 'breakout', 'swing'];

    const generateStrategy = async () => {
        setIsGenerating(true);
        
        // Simulate AI strategy generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const stockData = marketData[selectedSymbol] || apiService.generateMockData(selectedSymbol);
        const features = apiService.extractFeatures(stockData);
        
        const strategy = {
            symbol: selectedSymbol,
            type: strategyType === 'auto' ? apiService.selectStrategy(features) : strategyType,
            timeframe,
            riskLevel,
            confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
            entry: {
                price: stockData.price,
                conditions: generateEntryConditions(features, strategyType),
                indicators: generateIndicators(features)
            },
            exit: {
                takeProfit: apiService.calculateTarget(stockData.price, 'BUY'),
                stopLoss: apiService.calculateStopLoss(stockData.price, 'BUY'),
                conditions: generateExitConditions(riskLevel)
            },
            position: {
                size: calculatePositionSize(riskLevel),
                maxRisk: getRiskPercentage(riskLevel)
            },
            backtest: generateBacktestResults(),
            reasoning: generateStrategyReasoning(features, strategyType, riskLevel)
        };

        setGeneratedStrategy(strategy);
        setIsGenerating(false);
    };

    const generateEntryConditions = (features, type) => {
        const conditions = [];
        
        if (features.rsi < 40) conditions.push('RSI oversold (< 40)');
        if (features.macd > 0) conditions.push('MACD bullish crossover');
        if (features.volume > 5) conditions.push('High volume confirmation');
        if (features.trend > 0) conditions.push('Upward trend detected');
        
        return conditions;
    };

    const generateIndicators = (features) => ({
        rsi: features.rsi.toFixed(1),
        macd: features.macd.toFixed(3),
        volatility: (features.volatility * 100).toFixed(1) + '%',
        momentum: (features.momentum * 100).toFixed(1) + '%'
    });

    const generateExitConditions = (risk) => {
        const conditions = {
            low: ['RSI > 70', 'Price hits resistance', '2% profit target'],
            medium: ['RSI > 75', 'Volume decreasing', '5% profit target'], 
            high: ['Momentum reversal', 'Break of support', '10% profit target']
        };
        return conditions[risk] || conditions.medium;
    };

    const calculatePositionSize = (risk) => {
        const sizes = { low: '1-2%', medium: '2-5%', high: '5-10%' };
        return sizes[risk] || '2-5%';
    };

    const getRiskPercentage = (risk) => {
        const percentages = { low: '1%', medium: '2%', high: '5%' };
        return percentages[risk] || '2%';
    };

    const generateBacktestResults = () => ({
        winRate: Math.floor(Math.random() * 30) + 60, // 60-89%
        totalTrades: Math.floor(Math.random() * 100) + 50,
        avgReturn: (Math.random() * 4 + 1).toFixed(2) + '%',
        maxDrawdown: (Math.random() * 10 + 5).toFixed(1) + '%',
        sharpeRatio: (Math.random() * 2 + 1).toFixed(2)
    });

    const generateStrategyReasoning = (features, type, risk) => {
        let reasoning = `Based on ${type} analysis with ${risk} risk tolerance: `;
        
        if (features.rsi < 40) reasoning += 'Stock appears oversold with potential for reversal. ';
        if (features.momentum > 0.5) reasoning += 'Strong momentum suggests continued movement. ';
        if (features.volatility > 0.3) reasoning += 'High volatility provides good profit opportunities. ';
        
        reasoning += `Current market conditions favor ${type} strategies.`;
        return reasoning;
    };

    return (
        <div className="space-y-6">
            {/* Strategy Generator Form */}
            <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    🤖 AI Strategy Generator
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Symbol
                        </label>
                        <select 
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        >
                            {symbols.map(symbol => (
                                <option key={symbol} value={symbol}>{symbol}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Timeframe
                        </label>
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        >
                            {timeframes.map(tf => (
                                <option key={tf} value={tf}>{tf}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Risk Level
                        </label>
                        <select 
                            value={riskLevel}
                            onChange={(e) => setRiskLevel(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        >
                            {riskLevels.map(level => (
                                <option key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Strategy Type
                        </label>
                        <select 
                            value={strategyType}
                            onChange={(e) => setStrategyType(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        >
                            {strategyTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'auto' ? 'Auto Select' : 
                                     type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={generateStrategy}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                    {isGenerating ? '🧠 Generating Strategy...' : '✨ Generate AI Strategy'}
                </button>
            </div>

            {/* Generated Strategy Display */}
            {generatedStrategy && (
                <div className="bg-gray-900 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Generated Strategy</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Confidence:</span>
                            <span className="text-lg font-bold text-green-400">
                                {generatedStrategy.confidence}%
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Strategy Details */}
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-blue-400">Strategy Overview</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-400">Symbol:</span> {generatedStrategy.symbol}</div>
                                    <div><span className="text-gray-400">Type:</span> {generatedStrategy.type}</div>
                                    <div><span className="text-gray-400">Timeframe:</span> {generatedStrategy.timeframe}</div>
                                    <div><span className="text-gray-400">Risk Level:</span> {generatedStrategy.riskLevel}</div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-green-400">Entry Conditions</h4>
                                <div className="space-y-2">
                                    <div><span className="text-gray-400">Price:</span> ${generatedStrategy.entry.price}</div>
                                    <div className="text-sm">
                                        <span className="text-gray-400">Conditions:</span>
                                        <ul className="mt-1 ml-4 list-disc text-xs text-gray-300">
                                            {generatedStrategy.entry.conditions.map((condition, idx) => (
                                                <li key={idx}>{condition}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-red-400">Exit Strategy</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-400">Take Profit:</span> ${generatedStrategy.exit.takeProfit}</div>
                                    <div><span className="text-gray-400">Stop Loss:</span> ${generatedStrategy.exit.stopLoss}</div>
                                    <div>
                                        <span className="text-gray-400">Exit Conditions:</span>
                                        <ul className="mt-1 ml-4 list-disc text-xs text-gray-300">
                                            {generatedStrategy.exit.conditions.map((condition, idx) => (
                                                <li key={idx}>{condition}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Indicators & Backtest */}
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-purple-400">Technical Indicators</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-400">RSI:</span> {generatedStrategy.entry.indicators.rsi}</div>
                                    <div><span className="text-gray-400">MACD:</span> {generatedStrategy.entry.indicators.macd}</div>
                                    <div><span className="text-gray-400">Volatility:</span> {generatedStrategy.entry.indicators.volatility}</div>
                                    <div><span className="text-gray-400">Momentum:</span> {generatedStrategy.entry.indicators.momentum}</div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-yellow-400">Position Sizing</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-400">Position Size:</span> {generatedStrategy.position.size}</div>
                                    <div><span className="text-gray-400">Max Risk:</span> {generatedStrategy.position.maxRisk}</div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-orange-400">Backtest Results</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-gray-400">Win Rate:</span> {generatedStrategy.backtest.winRate}%</div>
                                    <div><span className="text-gray-400">Total Trades:</span> {generatedStrategy.backtest.totalTrades}</div>
                                    <div><span className="text-gray-400">Avg Return:</span> {generatedStrategy.backtest.avgReturn}</div>
                                    <div><span className="text-gray-400">Max Drawdown:</span> {generatedStrategy.backtest.maxDrawdown}</div>
                                    <div className="col-span-2"><span className="text-gray-400">Sharpe Ratio:</span> {generatedStrategy.backtest.sharpeRatio}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategy Reasoning */}
                    <div className="mt-6 bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 text-cyan-400">AI Reasoning</h4>
                        <p className="text-sm text-gray-300">{generatedStrategy.reasoning}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                            📊 Implement Strategy
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                            💾 Save Strategy
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                            🔄 Generate Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIStrategyGenerator;
