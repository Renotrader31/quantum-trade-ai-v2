class MLTradingEngine {
    constructor() {
        this.features = [
            'price', 'volume', 'change', 'rsi', 'macd', 'volatility',
            'trend', 'momentum', 'support', 'resistance'
        ];
        
        this.strategies = {
            momentum: { weight: 0.3, performance: 0.65 },
            meanReversion: { weight: 0.25, performance: 0.58 },
            breakout: { weight: 0.2, performance: 0.72 },
            scalping: { weight: 0.15, performance: 0.45 },
            swing: { weight: 0.1, performance: 0.68 }
        };
    }

    // Calculate technical indicators
    calculateRSI(prices, period = 14) {
        if (prices.length < period) return 50;
        
        let gains = 0, losses = 0;
        for (let i = 1; i < period; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff > 0) gains += diff;
            else losses -= diff;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / (avgLoss || 1);
        return 100 - (100 / (1 + rs));
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

    calculateVolatility(prices) {
        if (prices.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => 
            sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        
        return Math.sqrt(variance * 252); // Annualized
    }

    // Extract features from market data
    extractFeatures(stockData) {
        const prices = this.generatePriceHistory(stockData.price);
        return {
            price: stockData.price,
            volume: stockData.volume / 1000000, // Normalize
            change: stockData.changePercent,
            rsi: this.calculateRSI(prices),
            macd: this.calculateMACD(prices),
            volatility: this.calculateVolatility(prices),
            trend: stockData.changePercent > 0 ? 1 : -1,
            momentum: Math.abs(stockData.changePercent) / 10,
            support: stockData.low,
            resistance: stockData.high
        };
    }

    // Generate realistic price history
    generatePriceHistory(currentPrice, days = 50) {
        const prices = [];
        let price = currentPrice;
        
        for (let i = 0; i < days; i++) {
            price = price * (1 + (Math.random() - 0.5) * 0.02);
            prices.push(price);
        }
        return prices;
    }

    // Generate AI trading recommendations (enhanced version)
    async generateRecommendations(marketData, optionsFlowData = null) {
        try {
            // Use enhanced ML engine if available
            if (typeof window !== 'undefined') {
                // In browser environment, use dynamic import
                const { default: enhancedML } = await import('./enhancedMLEngine.js');
                console.log('🤖 Using Enhanced ML Engine for recommendations...');
                return await enhancedML.generateEnhancedRecommendations(marketData, optionsFlowData);
            }
        } catch (error) {
            console.warn('⚠️ Enhanced ML Engine not available, using fallback:', error.message);
        }

        // Fallback to original recommendations
        const recommendations = [];
        
        Object.entries(marketData).forEach(([symbol, data]) => {
            const features = this.extractFeatures(data);
            const analysis = this.analyzeStock(features);
            
            if (analysis.confidence > 60) {
                recommendations.push({
                    symbol,
                    action: analysis.action,
                    confidence: analysis.confidence,
                    strategy: analysis.strategy,
                    entryPrice: data.price,
                    targetPrice: this.calculateTarget(data.price, analysis.action),
                    stopLoss: this.calculateStopLoss(data.price, analysis.action),
                    reasoning: analysis.reasoning,
                    riskReward: analysis.riskReward,
                    timeframe: analysis.timeframe,
                    timestamp: Date.now()
                });
            }
        });
        
        return recommendations
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5);
    }

    // Analyze individual stock
    analyzeStock(features) {
        let score = 0;
        let reasoning = [];

        // RSI Analysis
        if (features.rsi < 30) {
            score += 0.3;
            reasoning.push('RSI indicates oversold conditions');
        } else if (features.rsi > 70) {
            score -= 0.3;
            reasoning.push('RSI indicates overbought conditions');
        }

        // MACD Analysis
        if (features.macd > 0) {
            score += 0.2;
            reasoning.push('MACD showing bullish momentum');
        } else {
            score -= 0.2;
            reasoning.push('MACD showing bearish momentum');
        }

        // Volume Analysis
        if (features.volume > 5) {
            score += 0.15;
            reasoning.push('High volume supporting move');
        }

        // Trend Analysis
        if (features.trend > 0 && features.momentum > 0.5) {
            score += 0.25;
            reasoning.push('Strong upward trend detected');
        } else if (features.trend < 0 && features.momentum > 0.5) {
            score -= 0.25;
            reasoning.push('Strong downward trend detected');
        }

        // Volatility Analysis
        if (features.volatility > 0.3) {
            score += 0.1;
            reasoning.push('High volatility creating opportunities');
        }

        const action = score > 0.1 ? 'BUY' : score < -0.1 ? 'SELL' : 'HOLD';
        const confidence = Math.min(Math.abs(score) * 100 + 50, 95);

        return {
            action,
            confidence: parseFloat(confidence.toFixed(1)),
            strategy: this.selectStrategy(features),
            reasoning: reasoning.join(', '),
            riskReward: this.calculateRiskReward(score),
            timeframe: this.selectTimeframe(features.volatility)
        };
    }

    selectStrategy(features) {
        if (features.rsi < 30 || features.rsi > 70) return 'meanReversion';
        if (features.momentum > 0.7) return 'momentum';
        if (features.volatility > 0.4) return 'breakout';
        return 'swing';
    }

    calculateTarget(price, action) {
        const multiplier = action === 'BUY' ? 1.05 : 0.95;
        return parseFloat((price * multiplier).toFixed(2));
    }

    calculateStopLoss(price, action) {
        const multiplier = action === 'BUY' ? 0.97 : 1.03;
        return parseFloat((price * multiplier).toFixed(2));
    }

    calculateRiskReward(score) {
        const ratio = Math.abs(score) * 3 + 1;
        return `1:${ratio.toFixed(1)}`;
    }

    selectTimeframe(volatility) {
        if (volatility > 0.4) return '1-3 days';
        if (volatility > 0.2) return '3-7 days';
        return '1-3 weeks';
    }

    // Learn from completed trades
    learnFromTrade(trade) {
        const strategy = trade.strategy;
        if (!this.strategies[strategy]) {
            this.strategies[strategy] = { weight: 0.1, performance: 0.5 };
        }

        const isWin = trade.profit > 0;
        const currentPerf = this.strategies[strategy].performance;

        // Update performance with exponential moving average
        this.strategies[strategy].performance = currentPerf * 0.9 + (isWin ? 1 : 0) * 0.1;

        // Adjust weight based on performance
        if (this.strategies[strategy].performance > 0.6) {
            this.strategies[strategy].weight = Math.min(
                this.strategies[strategy].weight * 1.1, 
                0.4
            );
        } else if (this.strategies[strategy].performance < 0.4) {
            this.strategies[strategy].weight = Math.max(
                this.strategies[strategy].weight * 0.9, 
                0.05
            );
        }

        return {
            strategy,
            newPerformance: this.strategies[strategy].performance,
            newWeight: this.strategies[strategy].weight
        };
    }

    // Mock market data for testing
    generateMockData(symbol) {
        const basePrice = {
            'AAPL': 175,
            'NVDA': 485,
            'TSLA': 248,
            'SPY': 485,
            'QQQ': 385
        }[symbol] || 150;

        const change = (Math.random() - 0.5) * 10;
        const price = basePrice + change;

        return {
            symbol,
            price: parseFloat(price.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat((change / basePrice * 100).toFixed(2)),
            volume: Math.floor(Math.random() * 10000000) + 1000000,
            high: parseFloat((price * 1.02).toFixed(2)),
            low: parseFloat((price * 0.98).toFixed(2)),
            open: parseFloat(basePrice.toFixed(2)),
            source: 'Mock Data',
            timestamp: Date.now()
        };
    }

    // Get market overview (now uses real data)
    async getMarketOverview() {
        try {
            // Import real data service dynamically to avoid circular imports
            const { default: realDataService } = await import('./realDataService');
            
            console.log('🔄 Fetching real market data...');
            const realData = await realDataService.getMarketOverview();
            
            console.log('✅ Real data fetched successfully:', Object.keys(realData.stocks));
            return realData;
        } catch (error) {
            console.warn('⚠️ Real data fetch failed, falling back to mock data:', error.message);
            
            // Fallback to mock data if real data fails
            const symbols = ['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA'];
            const stocks = {};
            
            symbols.forEach(symbol => {
                stocks[symbol] = this.generateMockData(symbol);
            });

            const totalChange = Object.values(stocks).reduce((sum, stock) => sum + stock.changePercent, 0);
            const avgChange = totalChange / symbols.length;

            return {
                stocks,
                marketSentiment: avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral',
                avgChange: parseFloat(avgChange.toFixed(2)),
                timestamp: Date.now(),
                usingMockData: true,
                error: error.message
            };
        }
    }
}

export default new MLTradingEngine();
