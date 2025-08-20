import React, { useState, useEffect } from 'react';
import useTradingStore from '../stores/tradingStore';
import technicalAnalysis from '../services/technicalAnalysis';

const TechnicalAnalysis = ({ symbol = 'AAPL' }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(symbol);
    
    const { marketData } = useTradingStore();
    const symbols = Object.keys(marketData);

    useEffect(() => {
        if (marketData[selectedSymbol]) {
            performAnalysis();
        }
    }, [selectedSymbol, marketData]);

    const performAnalysis = async () => {
        setLoading(true);
        try {
            const stockData = marketData[selectedSymbol];
            if (stockData) {
                const result = technicalAnalysis.performCompleteAnalysis(stockData);
                setAnalysis(result);
                console.log('📈 Technical analysis completed for', selectedSymbol, result);
            }
        } catch (error) {
            console.error('❌ Technical analysis failed:', error);
        }
        setLoading(false);
    };

    const getSignalColor = (signal) => {
        switch (signal?.toLowerCase()) {
            case 'buy':
            case 'strong_buy':
            case 'bullish':
            case 'strong_uptrend':
            case 'oversold':
                return 'text-green-400';
            case 'sell':
            case 'strong_sell':
            case 'bearish':
            case 'strong_downtrend':
            case 'overbought':
                return 'text-red-400';
            case 'neutral':
            case 'hold':
            case 'weak_trend':
                return 'text-yellow-400';
            default:
                return 'text-gray-400';
        }
    };

    const getSignalIcon = (signal) => {
        switch (signal?.toLowerCase()) {
            case 'buy':
            case 'strong_buy':
            case 'bullish':
            case 'oversold':
                return '🟢';
            case 'sell':
            case 'strong_sell':
            case 'bearish':
            case 'overbought':
                return '🔴';
            case 'neutral':
            case 'hold':
                return '🟡';
            default:
                return '⚪';
        }
    };

    const formatValue = (value, decimals = 2) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'number') return value.toFixed(decimals);
        return value;
    };

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-xl p-6">
                <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Analyzing technical indicators...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        📊 Technical Analysis
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        >
                            {symbols.map(sym => (
                                <option key={sym} value={sym}>{sym}</option>
                            ))}
                        </select>
                        <button
                            onClick={performAnalysis}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
                
                {analysis && (
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-lg">
                            <span className="text-gray-400">Overall Signal: </span>
                            <span className={`font-bold ${getSignalColor(analysis.overallSignal.signal)}`}>
                                {getSignalIcon(analysis.overallSignal.signal)} {analysis.overallSignal.signal}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Confidence: {analysis.overallSignal.confidence}%
                        </div>
                    </div>
                )}
            </div>

            {analysis && (
                <>
                    {/* Momentum Indicators */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">📈 Momentum Indicators</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">RSI (14)</span>
                                    <span className={`text-lg font-bold ${
                                        analysis.rsi < 30 ? 'text-green-400' :
                                        analysis.rsi > 70 ? 'text-red-400' : 'text-yellow-400'
                                    }`}>
                                        {formatValue(analysis.rsi)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            analysis.rsi < 30 ? 'bg-green-500' :
                                            analysis.rsi > 70 ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}
                                        style={{ width: `${analysis.rsi}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {analysis.rsi < 30 ? 'Oversold' : 
                                     analysis.rsi > 70 ? 'Overbought' : 'Normal'}
                                </div>
                            </div>

                            {analysis.stochastic && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Stochastic</span>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-400">
                                                %K: {formatValue(analysis.stochastic.k)}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                %D: {formatValue(analysis.stochastic.d)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded text-center ${
                                        analysis.stochastic.signal === 'OVERSOLD' ? 'bg-green-900 text-green-400' :
                                        analysis.stochastic.signal === 'OVERBOUGHT' ? 'bg-red-900 text-red-400' :
                                        'bg-gray-700 text-gray-400'
                                    }`}>
                                        {analysis.stochastic.signal}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Williams %R</span>
                                    <span className={`text-lg font-bold ${
                                        analysis.williamsR < -80 ? 'text-green-400' :
                                        analysis.williamsR > -20 ? 'text-red-400' : 'text-yellow-400'
                                    }`}>
                                        {formatValue(analysis.williamsR)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {analysis.williamsR < -80 ? 'Oversold' : 
                                     analysis.williamsR > -20 ? 'Overbought' : 'Normal'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trend Indicators */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">📊 Trend Indicators</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {analysis.macd && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-2">MACD</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-xs">MACD:</span>
                                            <span className="text-sm font-bold">{formatValue(analysis.macd.macd)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Signal:</span>
                                            <span className="text-sm">{formatValue(analysis.macd.signal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Histogram:</span>
                                            <span className={`text-sm font-bold ${
                                                analysis.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {formatValue(analysis.macd.histogram)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded text-center mt-2 ${
                                        analysis.macd.crossover === 'BULLISH' ? 'bg-green-900 text-green-400' :
                                        'bg-red-900 text-red-400'
                                    }`}>
                                        {analysis.macd.crossover}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">Moving Averages</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-xs">SMA 20:</span>
                                        <span className="text-sm font-bold">${formatValue(analysis.sma20)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs">SMA 50:</span>
                                        <span className="text-sm">${formatValue(analysis.sma50)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs">EMA 12:</span>
                                        <span className="text-sm">${formatValue(analysis.ema12)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs">EMA 26:</span>
                                        <span className="text-sm">${formatValue(analysis.ema26)}</span>
                                    </div>
                                </div>
                            </div>

                            {analysis.adx && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-2">ADX Trend</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-xs">ADX:</span>
                                            <span className="text-lg font-bold text-blue-400">
                                                {formatValue(analysis.adx.adx)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">+DI:</span>
                                            <span className="text-sm text-green-400">
                                                {formatValue(analysis.adx.plusDI)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">-DI:</span>
                                            <span className="text-sm text-red-400">
                                                {formatValue(analysis.adx.minusDI)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded text-center mt-2 ${
                                        analysis.adx.trend === 'STRONG_UPTREND' ? 'bg-green-900 text-green-400' :
                                        analysis.adx.trend === 'STRONG_DOWNTREND' ? 'bg-red-900 text-red-400' :
                                        'bg-gray-700 text-gray-400'
                                    }`}>
                                        {analysis.adx.trend.replace('_', ' ')}
                                    </div>
                                </div>
                            )}

                            {analysis.bollingerBands && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-2">Bollinger Bands</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-xs">Upper:</span>
                                            <span className="text-sm">${formatValue(analysis.bollingerBands.upper)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Middle:</span>
                                            <span className="text-sm">${formatValue(analysis.bollingerBands.middle)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Lower:</span>
                                            <span className="text-sm">${formatValue(analysis.bollingerBands.lower)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Position:</span>
                                            <span className="text-sm font-bold">
                                                {formatValue(analysis.bollingerBands.position)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded text-center mt-2 ${
                                        analysis.bollingerBands.signal === 'OVERSOLD' ? 'bg-green-900 text-green-400' :
                                        analysis.bollingerBands.signal === 'OVERBOUGHT' ? 'bg-red-900 text-red-400' :
                                        'bg-gray-700 text-gray-400'
                                    }`}>
                                        {analysis.bollingerBands.signal}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Volume & Volatility */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">📊 Volume & Volatility</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">Volume Analysis</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs">VWAP:</span>
                                        <span className="text-lg font-bold text-blue-400">
                                            ${formatValue(analysis.vwap)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs">OBV:</span>
                                        <span className="text-sm">{formatValue(analysis.obv, 0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="text-sm text-gray-400 mb-2">Volatility</div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-400">
                                        {formatValue(analysis.atr)}
                                    </div>
                                    <div className="text-xs text-gray-400">Average True Range</div>
                                </div>
                            </div>

                            {analysis.pivotPoints && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-2">Key Levels</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-xs">R1:</span>
                                            <span className="text-sm text-red-400">
                                                ${formatValue(analysis.pivotPoints.r1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Pivot:</span>
                                            <span className="text-sm font-bold text-yellow-400">
                                                ${formatValue(analysis.pivotPoints.pivot)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">S1:</span>
                                            <span className="text-sm text-green-400">
                                                ${formatValue(analysis.pivotPoints.s1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pattern Recognition */}
                    {(analysis.candlestickPatterns.length > 0 || analysis.chartPatterns.length > 0) && (
                        <div className="bg-gray-900 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4">🔍 Pattern Recognition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {analysis.candlestickPatterns.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-3">Candlestick Patterns</h4>
                                        <div className="space-y-2">
                                            {analysis.candlestickPatterns.map((pattern, idx) => (
                                                <div key={idx} className="bg-gray-800 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold">{pattern.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm ${getSignalColor(pattern.signal)}`}>
                                                                {getSignalIcon(pattern.signal)} {pattern.signal}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {pattern.confidence}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {pattern.type}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysis.chartPatterns.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-3">Chart Patterns</h4>
                                        <div className="space-y-2">
                                            {analysis.chartPatterns.map((pattern, idx) => (
                                                <div key={idx} className="bg-gray-800 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold">{pattern.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm ${getSignalColor(pattern.signal)}`}>
                                                                {getSignalIcon(pattern.signal)} {pattern.signal}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {pattern.confidence}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {pattern.type}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!analysis && !loading && (
                <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <div className="text-gray-400 py-8">
                        <span className="text-4xl mb-4 block">📊</span>
                        <p>Select a symbol to view technical analysis</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicalAnalysis;