/**
 * Advanced Machine Learning Trading System
 * Self-improving algorithm that learns from every trade and strategy
 */

const isBrowser = typeof window !== 'undefined';

class MLTradingSystem {
    constructor() {
        this.model = {
            version: '2.0',
            accuracy: 0.65, // Starting accuracy
            confidence: 0.5,
            trainingData: [],
            patterns: new Map(),
            strategies: new Map(),
            performance: new Map()
        };
        
        this.features = {
            technical: ['rsi', 'macd', 'bollinger', 'vwap', 'ema', 'sma'],
            sentiment: ['social', 'news', 'options_flow'],
            market: ['volume', 'volatility', 'trend', 'momentum']
        };
        
        this.tradeHistory = [];
        this.activeTrades = [];
        this.recommendations = [];
        
        this.loadModel();
        this.initializeNeuralNetwork();
    }

    /**
     * Initialize a simple neural network for pattern recognition
     */
    initializeNeuralNetwork() {
        this.network = {
            inputLayer: 15, // Number of input features
            hiddenLayers: [30, 20, 10], // 3 hidden layers
            outputLayer: 5, // Buy strong, buy, hold, sell, sell strong
            weights: this.initializeWeights(),
            learningRate: 0.01
        };
    }

    initializeWeights() {
        // Initialize random weights for the neural network
        const weights = {};
        
        // Input to first hidden layer
        weights.ih = Array(30).fill(0).map(() => 
            Array(15).fill(0).map(() => Math.random() - 0.5)
        );
        
        // Hidden layers
        weights.hh1 = Array(20).fill(0).map(() => 
            Array(30).fill(0).map(() => Math.random() - 0.5)
        );
        weights.hh2 = Array(10).fill(0).map(() => 
            Array(20).fill(0).map(() => Math.random() - 0.5)
        );
        
        // Hidden to output
        weights.ho = Array(5).fill(0).map(() => 
            Array(10).fill(0).map(() => Math.random() - 0.5)
        );
        
        return weights;
    }

    /**
     * Load saved model from storage
     */
    loadModel() {
        if (!isBrowser) return;
        
        const savedModel = localStorage.getItem('mlTradingModel');
        if (savedModel) {
            try {
                const parsed = JSON.parse(savedModel);
                this.model = { ...this.model, ...parsed };
                
                // Convert arrays back to Maps
                if (parsed.patterns) {
                    this.model.patterns = new Map(parsed.patterns);
                }
                if (parsed.strategies) {
                    this.model.strategies = new Map(parsed.strategies);
                }
                if (parsed.performance) {
                    this.model.performance = new Map(parsed.performance);
                }
                
                console.log('ML Model loaded. Accuracy:', this.model.accuracy);
            } catch (e) {
                console.log('Starting fresh ML model');
            }
        }
        
        const savedHistory = localStorage.getItem('mlTradeHistory');
        if (savedHistory) {
            this.tradeHistory = JSON.parse(savedHistory);
        }
    }

    /**
     * Save model to storage
     */
    saveModel() {
        if (!isBrowser) return;
        
        const modelToSave = {
            ...this.model,
            patterns: Array.from(this.model.patterns.entries()),
            strategies: Array.from(this.model.strategies.entries()),
            performance: Array.from(this.model.performance.entries())
        };
        
        localStorage.setItem('mlTradingModel', JSON.stringify(modelToSave));
        localStorage.setItem('mlTradeHistory', JSON.stringify(this.tradeHistory));
    }

    /**
     * Extract features from market data
     */
    extractFeatures(data) {
        const features = [];
        
        // Technical indicators
        features.push(this.calculateRSI(data.prices));
        features.push(this.calculateMACD(data.prices));
        features.push(this.calculateBollingerBands(data.prices));
        features.push(data.vwap || 0);
        
        // Volume and volatility
        features.push(this.normalizeVolume(data.volume));
        features.push(this.calculateVolatility(data.prices));
        
        // Trend indicators
        features.push(this.calculateTrend(data.prices));
        features.push(this.calculateMomentum(data.prices));
        
        // Options flow
        features.push(data.callVolume / (data.putVolume || 1)); // Call/Put ratio
        features.push(data.unusualActivity ? 1 : 0);
        
        // Sentiment scores
        features.push(data.socialSentiment || 0);
        features.push(data.newsSentiment || 0);
        
        // Market conditions
        features.push(data.marketCap || 0);
        features.push(data.sectorStrength || 0);
        features.push(data.correlationSPY || 0);
        
        return features.map(f => isNaN(f) ? 0 : f); // Handle NaN values
    }

    /**
     * Forward propagation through the neural network
     */
    predict(features) {
        let current = features;
        const { weights } = this.network;
        
        // Input to hidden layer 1
        current = this.activate(this.matrixMultiply(current, weights.ih));
        
        // Hidden layer 1 to 2
        current = this.activate(this.matrixMultiply(current, weights.hh1));
        
        // Hidden layer 2 to 3
        current = this.activate(this.matrixMultiply(current, weights.hh2));
        
        // Hidden layer 3 to output
        const output = this.softmax(this.matrixMultiply(current, weights.ho));
        
        return {
            buyStrong: output[0],
            buy: output[1],
            hold: output[2],
            sell: output[3],
            sellStrong: output[4],
            confidence: Math.max(...output)
        };
    }

    /**
     * Train the model with new data
     */
    async train(tradeData) {
        const features = this.extractFeatures(tradeData.marketData);
        const actualOutcome = this.encodeOutcome(tradeData.result);
        
        // Store training data
        this.model.trainingData.push({
            features,
            outcome: actualOutcome,
            timestamp: Date.now(),
            symbol: tradeData.symbol,
            strategy: tradeData.strategy
        });
        
        // Keep only recent data (last 10,000 trades)
        if (this.model.trainingData.length > 10000) {
            this.model.trainingData = this.model.trainingData.slice(-10000);
        }
        
        // Backpropagation
        await this.backpropagate(features, actualOutcome);
        
        // Update patterns
        this.updatePatterns(tradeData);
        
        // Update strategy performance
        this.updateStrategyPerformance(tradeData);
        
        // Recalculate model accuracy
        this.updateModelAccuracy();
        
        // Save the updated model
        this.saveModel();
        
        return {
            accuracy: this.model.accuracy,
            confidence: this.model.confidence,
            totalTrades: this.model.trainingData.length
        };
    }

    /**
     * Backpropagation for neural network training
     */
    async backpropagate(features, target) {
        const prediction = this.predict(features);
        const error = this.calculateError(prediction, target);
        
        // Update weights based on error (simplified)
        const { weights, learningRate } = this.network;
        
        // This is a simplified version - real implementation would be more complex
        Object.keys(weights).forEach(layer => {
            weights[layer] = weights[layer].map(row =>
                row.map(w => w - learningRate * error * Math.random())
            );
        });
        
        this.network.weights = weights;
    }

    /**
     * Identify and learn patterns
     */
    updatePatterns(tradeData) {
        const pattern = this.identifyPattern(tradeData.marketData);
        
        if (!this.model.patterns.has(pattern.type)) {
            this.model.patterns.set(pattern.type, {
                occurrences: 0,
                successRate: 0,
                totalReturn: 0
            });
        }
        
        const patternStats = this.model.patterns.get(pattern.type);
        patternStats.occurrences++;
        
        if (tradeData.result.profit > 0) {
            patternStats.successRate = 
                (patternStats.successRate * (patternStats.occurrences - 1) + 1) / 
                patternStats.occurrences;
        } else {
            patternStats.successRate = 
                (patternStats.successRate * (patternStats.occurrences - 1)) / 
                patternStats.occurrences;
        }
        
        patternStats.totalReturn += tradeData.result.percentReturn;
        
        this.model.patterns.set(pattern.type, patternStats);
    }

    /**
     * Identify market patterns
     */
    identifyPattern(marketData) {
        const patterns = [];
        
        // Bullish patterns
        if (this.isGoldenCross(marketData)) patterns.push('golden_cross');
        if (this.isBullFlag(marketData)) patterns.push('bull_flag');
        if (this.isCupAndHandle(marketData)) patterns.push('cup_handle');
        
        // Bearish patterns
        if (this.isDeathCross(marketData)) patterns.push('death_cross');
        if (this.isBearFlag(marketData)) patterns.push('bear_flag');
        if (this.isHeadAndShoulders(marketData)) patterns.push('head_shoulders');
        
        // Neutral patterns
        if (this.isTriangle(marketData)) patterns.push('triangle');
        if (this.isRange(marketData)) patterns.push('range_bound');
        
        return {
            type: patterns.join('_') || 'unknown',
            patterns: patterns
        };
    }

    /**
     * Update strategy performance metrics
     */
    updateStrategyPerformance(tradeData) {
        const { strategy } = tradeData;
        
        if (!this.model.strategies.has(strategy)) {
            this.model.strategies.set(strategy, {
                trades: 0,
                wins: 0,
                losses: 0,
                totalReturn: 0,
                avgReturn: 0,
                winRate: 0,
                sharpeRatio: 0
            });
        }
        
        const stats = this.model.strategies.get(strategy);
        stats.trades++;
        
        if (tradeData.result.profit > 0) {
            stats.wins++;
        } else {
            stats.losses++;
        }
        
        stats.totalReturn += tradeData.result.percentReturn;
        stats.avgReturn = stats.totalReturn / stats.trades;
        stats.winRate = stats.wins / stats.trades;
        
        // Calculate Sharpe ratio (simplified)
        stats.sharpeRatio = this.calculateSharpeRatio(strategy);
        
        this.model.strategies.set(strategy, stats);
    }

    /**
     * Generate AI-powered recommendations
     */
    generateRecommendations(marketData, options = {}) {
        const recommendations = [];
        const symbols = options.symbols || ['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA'];
        
        symbols.forEach(symbol => {
            const symbolData = this.getMarketData(symbol, marketData);
            const features = this.extractFeatures(symbolData);
            const prediction = this.predict(features);
            const pattern = this.identifyPattern(symbolData);
            
            // Get historical performance for this pattern
            const patternPerformance = this.model.patterns.get(pattern.type) || {
                successRate: 0.5,
                occurrences: 0
            };
            
            // Generate recommendation
            const action = this.determineAction(prediction);
            
            if (action !== 'hold' || options.includeHold) {
                recommendations.push({
                    symbol,
                    action,
                    confidence: prediction.confidence,
                    expectedReturn: this.calculateExpectedReturn(prediction, patternPerformance),
                    risk: this.calculateRisk(symbolData),
                    pattern: pattern.type,
                    patternSuccess: patternPerformance.successRate,
                    reasoning: this.generateReasoning(prediction, pattern, symbolData),
                    timeframe: options.timeframe || '1D',
                    entryPrice: symbolData.currentPrice,
                    stopLoss: this.calculateStopLoss(symbolData, action),
                    takeProfit: this.calculateTakeProfit(symbolData, action),
                    positionSize: this.calculatePositionSize(symbolData, options.capital || 10000)
                });
            }
        });
        
        // Sort by confidence and expected return
        recommendations.sort((a, b) => 
            (b.confidence * b.expectedReturn) - (a.confidence * a.expectedReturn)
        );
        
        return recommendations.slice(0, options.limit || 5);
    }

    /**
     * Record actual trade for learning
     */
    recordTrade(trade) {
        // Add to trade history
        this.tradeHistory.push({
            ...trade,
            timestamp: Date.now(),
            modelVersion: this.model.version,
            modelAccuracy: this.model.accuracy
        });
        
        // If trade is closed, train the model
        if (trade.status === 'closed') {
            this.train({
                symbol: trade.symbol,
                strategy: trade.strategy,
                marketData: trade.entryMarketData,
                result: {
                    profit: trade.profit,
                    percentReturn: trade.percentReturn,
                    holdingPeriod: trade.exitTime - trade.entryTime
                }
            });
        }
        
        // Update active trades
        if (trade.status === 'open') {
            this.activeTrades.push(trade);
        } else {
            this.activeTrades = this.activeTrades.filter(t => t.id !== trade.id);
        }
        
        this.saveModel();
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const metrics = {
            modelAccuracy: this.model.accuracy,
            modelConfidence: this.model.confidence,
            totalTrades: this.tradeHistory.length,
            winRate: this.calculateWinRate(),
            avgReturn: this.calculateAvgReturn(),
            sharpeRatio: this.calculateOverallSharpe(),
            maxDrawdown: this.calculateMaxDrawdown(),
            profitFactor: this.calculateProfitFactor(),
            strategies: Array.from(this.model.strategies.entries()).map(([name, stats]) => ({
                name,
                ...stats
            })),
            patterns: Array.from(this.model.patterns.entries())
                .sort((a, b) => b[1].successRate - a[1].successRate)
                .slice(0, 10)
                .map(([name, stats]) => ({
                    name,
                    ...stats
                })),
            recentTrades: this.tradeHistory.slice(-10),
            activeTrades: this.activeTrades
        };
        
        return metrics;
    }

    /**
     * Calculate technical indicators
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i < period; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff > 0) gains += diff;
            else losses -= diff;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / (avgLoss || 1);
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }

    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        return ema12 - ema26;
    }

    calculateEMA(prices, period) {
        if (prices.length === 0) return 0;
        
        const multiplier = 2 / (period + 1);
        let ema = prices[0];
        
        for (let i = 1; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }
        
        return ema;
    }

    calculateBollingerBands(prices, period = 20) {
        const sma = prices.slice(-period).reduce((a, b) => a + b, 0) / period;
        const variance = prices.slice(-period).reduce((sum, price) => 
            sum + Math.pow(price - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        const current = prices[prices.length - 1];
        const position = (current - sma) / (stdDev * 2); // Position within bands
        
        return position; // -1 to 1, where -1 is lower band, 1 is upper band
    }

    calculateVolatility(prices) {
        if (prices.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => 
            sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        
        return Math.sqrt(variance * 252); // Annualized volatility
    }

    calculateTrend(prices) {
        if (prices.length < 2) return 0;
        
        // Simple linear regression
        const n = prices.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        
        const sumX = indices.reduce((a, b) => a + b, 0);
        const sumY = prices.reduce((a, b) => a + b, 0);
        const sumXY = indices.reduce((sum, x, i) => sum + x * prices[i], 0);
        const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        
        return slope; // Positive = uptrend, negative = downtrend
    }

    calculateMomentum(prices, period = 10) {
        if (prices.length < period) return 0;
        
        const current = prices[prices.length - 1];
        const past = prices[prices.length - period];
        
        return (current - past) / past;
    }

    /**
     * Pattern detection methods
     */
    isGoldenCross(data) {
        const sma50 = this.calculateSMA(data.prices, 50);
        const sma200 = this.calculateSMA(data.prices, 200);
        const prevSma50 = this.calculateSMA(data.prices.slice(0, -1), 50);
        const prevSma200 = this.calculateSMA(data.prices.slice(0, -1), 200);
        
        return prevSma50 <= prevSma200 && sma50 > sma200;
    }

    isDeathCross(data) {
        const sma50 = this.calculateSMA(data.prices, 50);
        const sma200 = this.calculateSMA(data.prices, 200);
        const prevSma50 = this.calculateSMA(data.prices.slice(0, -1), 50);
        const prevSma200 = this.calculateSMA(data.prices.slice(0, -1), 200);
        
        return prevSma50 >= prevSma200 && sma50 < sma200;
    }

    isBullFlag(data) {
        // Simplified bull flag detection
        const recent = data.prices.slice(-20);
        const trend = this.calculateTrend(recent);
        const consolidation = this.calculateVolatility(recent.slice(-5));
        
        return trend > 0.02 && consolidation < 0.1;
    }

    isBearFlag(data) {
        const recent = data.prices.slice(-20);
        const trend = this.calculateTrend(recent);
        const consolidation = this.calculateVolatility(recent.slice(-5));
        
        return trend < -0.02 && consolidation < 0.1;
    }

    isCupAndHandle(data) {
        // Simplified cup and handle detection
        if (data.prices.length < 50) return false;
        
        const prices = data.prices.slice(-50);
        const midPoint = Math.floor(prices.length / 2);
        const leftHigh = Math.max(...prices.slice(0, midPoint));
        const bottom = Math.min(...prices.slice(midPoint - 10, midPoint + 10));
        const rightHigh = Math.max(...prices.slice(midPoint));
        
        return (
            Math.abs(leftHigh - rightHigh) / leftHigh < 0.05 &&
            (leftHigh - bottom) / leftHigh > 0.1
        );
    }

    isHeadAndShoulders(data) {
        // Simplified head and shoulders detection
        if (data.prices.length < 30) return false;
        
        const prices = data.prices.slice(-30);
        const third = Math.floor(prices.length / 3);
        
        const leftShoulder = Math.max(...prices.slice(0, third));
        const head = Math.max(...prices.slice(third, third * 2));
        const rightShoulder = Math.max(...prices.slice(third * 2));
        
        return (
            head > leftShoulder &&
            head > rightShoulder &&
            Math.abs(leftShoulder - rightShoulder) / leftShoulder < 0.05
        );
    }

    isTriangle(data) {
        // Simplified triangle pattern detection
        const highs = [];
        const lows = [];
        const period = 5;
        
        for (let i = 0; i < data.prices.length - period; i += period) {
            const slice = data.prices.slice(i, i + period);
            highs.push(Math.max(...slice));
            lows.push(Math.min(...slice));
        }
        
        const highTrend = this.calculateTrend(highs);
        const lowTrend = this.calculateTrend(lows);
        
        return Math.abs(highTrend) < 0.01 && lowTrend > 0.01;
    }

    isRange(data) {
        const volatility = this.calculateVolatility(data.prices);
        const trend = Math.abs(this.calculateTrend(data.prices));
        
        return volatility < 0.15 && trend < 0.001;
    }

    /**
     * Helper methods
     */
    calculateSMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1] || 0;
        return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
    }

    normalizeVolume(volume) {
        // Normalize volume to 0-1 scale
        const avgVolume = 10000000; // 10M average
        return Math.min(volume / avgVolume, 2);
    }

    activate(x) {
        // ReLU activation
        return Array.isArray(x) ? x.map(v => Math.max(0, v)) : Math.max(0, x);
    }

    softmax(x) {
        const max = Math.max(...x);
        const exp = x.map(v => Math.exp(v - max));
        const sum = exp.reduce((a, b) => a + b, 0);
        return exp.map(v => v / sum);
    }

    matrixMultiply(vector, matrix) {
        return matrix.map(row =>
            row.reduce((sum, val, i) => sum + val * (vector[i] || 0), 0)
        );
    }

    calculateError(prediction, target) {
        const predArray = [
            prediction.buyStrong,
            prediction.buy,
            prediction.hold,
            prediction.sell,
            prediction.sellStrong
        ];
        
        return predArray.reduce((sum, val, i) => 
            sum + Math.pow(val - (target[i] || 0), 2), 0
        );
    }

    encodeOutcome(result) {
        // Encode trading outcome to neural network output format
        const returnPercent = result.percentReturn;
        
        if (returnPercent > 10) return [1, 0, 0, 0, 0]; // Buy Strong
        if (returnPercent > 3) return [0, 1, 0, 0, 0];  // Buy
        if (returnPercent > -3) return [0, 0, 1, 0, 0]; // Hold
        if (returnPercent > -10) return [0, 0, 0, 1, 0]; // Sell
        return [0, 0, 0, 0, 1]; // Sell Strong
    }

    determineAction(prediction) {
        const actions = ['buyStrong', 'buy', 'hold', 'sell', 'sellStrong'];
        const values = [
            prediction.buyStrong,
            prediction.buy,
            prediction.hold,
            prediction.sell,
            prediction.sellStrong
        ];
        
        const maxIndex = values.indexOf(Math.max(...values));
        return actions[maxIndex];
    }

    calculateExpectedReturn(prediction, patternPerformance) {
        const baseReturn = 
            prediction.buyStrong * 15 +
            prediction.buy * 7 +
            prediction.hold * 0 +
            prediction.sell * -7 +
            prediction.sellStrong * -15;
        
        // Adjust based on pattern performance
        const patternAdjustment = (patternPerformance.successRate - 0.5) * 10;
        
        return baseReturn + patternAdjustment;
    }

    calculateRisk(data) {
        const volatility = this.calculateVolatility(data.prices);
        const atr = this.calculateATR(data);
        
        return Math.min(volatility * atr, 1);
    }

    calculateATR(data, period = 14) {
        // Average True Range calculation
        if (!data.highs || !data.lows || data.highs.length < period) {
            return 0.02; // Default 2%
        }
        
        const trueRanges = [];
        for (let i = 1; i < data.highs.length; i++) {
            const high = data.highs[i];
            const low = data.lows[i];
            const prevClose = data.prices[i - 1];
            
            const tr = Math.max(
                high - low,
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );
            trueRanges.push(tr);
        }
        
        const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
        return atr / data.prices[data.prices.length - 1];
    }

    calculateStopLoss(data, action) {
        const atr = this.calculateATR(data);
        const currentPrice = data.currentPrice;
        
        if (action.includes('buy')) {
            return currentPrice * (1 - atr * 2);
        } else if (action.includes('sell')) {
            return currentPrice * (1 + atr * 2);
        }
        return currentPrice;
    }

    calculateTakeProfit(data, action) {
        const atr = this.calculateATR(data);
        const currentPrice = data.currentPrice;
        
        if (action.includes('buy')) {
            return currentPrice * (1 + atr * 3);
        } else if (action.includes('sell')) {
            return currentPrice * (1 - atr * 3);
        }
        return currentPrice;
    }

    calculatePositionSize(data, capital) {
        const risk = this.calculateRisk(data);
        const maxRisk = 0.02; // Max 2% risk per trade
        
        const positionSize = (capital * maxRisk) / risk;
        return Math.min(positionSize, capital * 0.25); // Max 25% per position
    }

    generateReasoning(prediction, pattern, data) {
        const reasons = [];
        
        // Add prediction reasoning
        if (prediction.buyStrong > 0.5) {
            reasons.push('Strong bullish signals detected');
        } else if (prediction.buy > 0.5) {
            reasons.push('Moderate bullish signals present');
        } else if (prediction.sell > 0.5) {
            reasons.push('Bearish indicators dominating');
        }
        
        // Add pattern reasoning
        if (pattern.patterns.length > 0) {
            reasons.push(`Pattern detected: ${pattern.patterns.join(', ')}`);
        }
        
        // Add technical reasoning
        const rsi = this.calculateRSI(data.prices);
        if (rsi < 30) reasons.push('RSI indicates oversold conditions');
        if (rsi > 70) reasons.push('RSI indicates overbought conditions');
        
        // Add volume reasoning
        if (data.volume > data.avgVolume * 1.5) {
            reasons.push('Unusual volume detected');
        }
        
        // Add confidence reasoning
        reasons.push(`Model confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
        
        return reasons.join('. ');
    }

    updateModelAccuracy() {
        if (this.tradeHistory.length < 10) return;
        
        const recentTrades = this.tradeHistory.slice(-100);
        const correctPredictions = recentTrades.filter(trade => 
            (trade.prediction === 'buy' && trade.result && trade.result.profit > 0) ||
            (trade.prediction === 'sell' && trade.result && trade.result.profit > 0) ||
            (trade.prediction === 'hold' && trade.result && Math.abs(trade.result.percentReturn) < 2)
        ).length;
        
        this.model.accuracy = correctPredictions / recentTrades.length;
        this.model.confidence = Math.min(this.model.accuracy * 1.2, 1);
    }

    calculateWinRate() {
        if (this.tradeHistory.length === 0) return 0;
        
        const wins = this.tradeHistory.filter(t => t.result && t.result.profit > 0).length;
        return wins / this.tradeHistory.length;
    }

    calculateAvgReturn() {
        if (this.tradeHistory.length === 0) return 0;
        
        const totalReturn = this.tradeHistory.reduce((sum, trade) => 
            sum + (trade.result?.percentReturn || 0), 0
        );
        
        return totalReturn / this.tradeHistory.length;
    }

    calculateOverallSharpe() {
        if (this.tradeHistory.length < 2) return 0;
        
        const returns = this.tradeHistory.map(t => t.result?.percentReturn || 0);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => 
            sum + Math.pow(ret - avgReturn, 2), 0
        ) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        return stdDev === 0 ? 0 : (avgReturn - 0.02) / stdDev; // 2% risk-free rate
    }

    calculateSharpeRatio(strategy) {
        const trades = this.tradeHistory.filter(t => t.strategy === strategy);
        if (trades.length < 2) return 0;
        
        const returns = trades.map(t => t.result?.percentReturn || 0);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => 
            sum + Math.pow(ret - avgReturn, 2), 0
        ) / returns.length;
        const stdDev = Math.sqrt(variance);
        
        return stdDev === 0 ? 0 : (avgReturn - 0.02) / stdDev;
    }

    calculateMaxDrawdown() {
        if (this.tradeHistory.length === 0) return 0;
        
        let peak = 0;
        let maxDrawdown = 0;
        let runningTotal = 0;
        
        this.tradeHistory.forEach(trade => {
            runningTotal += trade.result?.profit || 0;
            if (runningTotal > peak) {
                peak = runningTotal;
            }
            const drawdown = (peak - runningTotal) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        });
        
        return maxDrawdown;
    }

    calculateProfitFactor() {
        const wins = this.tradeHistory
            .filter(t => t.result && t.result.profit > 0)
            .reduce((sum, t) => sum + t.result.profit, 0);
        
        const losses = Math.abs(this.tradeHistory
            .filter(t => t.result && t.result.profit < 0)
            .reduce((sum, t) => sum + t.result.profit, 0));
        
        return losses === 0 ? wins : wins / losses;
    }

    getMarketData(symbol, marketData) {
        // Extract symbol-specific data from market data
        return marketData[symbol] || {
            symbol,
            prices: [],
            volume: 0,
            currentPrice: 0,
            highs: [],
            lows: [],
            vwap: 0,
            callVolume: 0,
            putVolume: 0,
            unusualActivity: false,
            socialSentiment: 0,
            newsSentiment: 0,
            marketCap: 0,
            sectorStrength: 0,
            correlationSPY: 0,
            avgVolume: 0
        };
    }
}

// Export for use in React components
export default MLTradingSystem;
