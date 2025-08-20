import apiService from './apiService';

class MLService {
    constructor() {
        this.model = {
            version: '2.1',
            accuracy: 0.73,
            confidence: 0.68,
            learningRate: 0.01,
            epochs: 0,
            trainingData: []
        };

        this.patterns = new Map([
            ['bullish_breakout', { successRate: 0.78, occurrences: 145 }],
            ['bearish_reversal', { successRate: 0.65, occurrences: 89 }],
            ['consolidation', { successRate: 0.52, occurrences: 203 }],
            ['momentum_surge', { successRate: 0.81, occurrences: 67 }],
            ['mean_reversion', { successRate: 0.69, occurrences: 124 }]
        ]);

        this.strategies = new Map([
            ['momentum', { performance: 0.72, weight: 0.25, trades: 156 }],
            ['meanReversion', { performance: 0.64, weight: 0.20, trades: 98 }],
            ['breakout', { performance: 0.78, weight: 0.30, trades: 134 }],
            ['swing', { performance: 0.61, weight: 0.15, trades: 87 }],
            ['scalping', { performance: 0.55, weight: 0.10, trades: 234 }]
        ]);

        this.marketConditions = {
            volatility: 'medium',
            trend: 'neutral',
            volume: 'normal',
            sentiment: 'neutral'
        };

        console.log('🧠 ML Service initialized');
    }

    // Generate AI-powered trading recommendations
    generateRecommendations(marketData, options = {}) {
        const recommendations = [];
        const symbols = options.symbols || Object.keys(marketData);

        symbols.forEach(symbol => {
            const stockData = marketData[symbol];
            if (!stockData) return;

            const analysis = this.analyzeStock(stockData);
            const pattern = this.detectPattern(stockData);
            const sentiment = this.calculateSentiment(stockData);

            if (analysis.confidence > 65) {
                const recommendation = {
                    symbol,
                    action: analysis.action,
                    confidence: analysis.confidence,
                    strategy: analysis.strategy,
                    entryPrice: stockData.price,
                    targetPrice: this.calculateTarget(stockData.price, analysis.action, analysis.volatility),
                    stopLoss: this.calculateStopLoss(stockData.price, analysis.action, analysis.volatility),
                    reasoning: this.generateReasoning(analysis, pattern, sentiment, stockData),
                    riskReward: this.calculateRiskReward(analysis),
                    timeframe: this.selectTimeframe(analysis.volatility, analysis.momentum),
                    pattern: pattern.name,
                    sentiment: sentiment.score,
                    priority: this.calculatePriority(analysis, pattern, sentiment),
                    timestamp: Date.now()
                };

                recommendations.push(recommendation);
            }
        });

        // Sort by priority and confidence
        return recommendations
            .sort((a, b) => (b.priority * b.confidence) - (a.priority * a.confidence))
            .slice(0, options.limit || 8);
    }

    // Advanced stock analysis using multiple indicators
    analyzeStock(stockData) {
        const features = apiService.extractFeatures(stockData);
        
        // Technical Analysis Score
        let technicalScore = 0;
        
        // RSI Analysis (oversold/overbought)
        if (features.rsi < 30) technicalScore += 0.4;
        else if (features.rsi > 70) technicalScore -= 0.4;
        else if (features.rsi >= 40 && features.rsi <= 60) technicalScore += 0.1;

        // MACD Analysis
        if (features.macd > 0 && features.momentum > 0.3) technicalScore += 0.3;
        else if (features.macd < 0 && features.momentum > 0.3) technicalScore -= 0.3;

        // Volume Analysis
        if (features.volume > 3) technicalScore += 0.2;
        else if (features.volume < 1) technicalScore -= 0.1;

        // Volatility Analysis
        const volatility = features.volatility;
        if (volatility > 0.4) technicalScore += 0.15;
        else if (volatility < 0.1) technicalScore -= 0.05;

        // Trend Analysis
        if (features.trend > 0 && features.momentum > 0.5) {
            technicalScore += 0.35;
        } else if (features.trend < 0 && features.momentum > 0.5) {
            technicalScore -= 0.35;
        }

        // Price Action Analysis
        const priceAction = this.analyzePriceAction(stockData);
        technicalScore += priceAction.score;

        // Determine action and confidence
        const action = technicalScore > 0.15 ? 'BUY' : 
                      technicalScore < -0.15 ? 'SELL' : 'HOLD';
        
        const baseConfidence = Math.min(Math.abs(technicalScore) * 80 + 50, 95);
        const confidence = this.adjustConfidenceByMarket(baseConfidence, stockData);

        return {
            action,
            confidence: parseFloat(confidence.toFixed(1)),
            score: technicalScore,
            strategy: this.selectOptimalStrategy(features, technicalScore),
            volatility: volatility,
            momentum: features.momentum,
            technicalStrength: this.calculateTechnicalStrength(features)
        };
    }

    // Pattern Detection using advanced algorithms
    detectPattern(stockData) {
        const features = apiService.extractFeatures(stockData);
        const patterns = [];

        // Breakout Pattern
        if (features.volatility > 0.3 && features.momentum > 0.6) {
            patterns.push({ name: 'bullish_breakout', strength: 0.8 });
        }

        // Reversal Pattern
        if ((features.rsi > 75 || features.rsi < 25) && features.volume > 2) {
            const type = features.rsi > 75 ? 'bearish_reversal' : 'bullish_reversal';
            patterns.push({ name: type, strength: 0.7 });
        }

        // Momentum Pattern
        if (features.momentum > 0.8 && features.macd > 0) {
            patterns.push({ name: 'momentum_surge', strength: 0.75 });
        }

        // Mean Reversion Pattern
        if (Math.abs(features.change) > 5 && features.rsi !== 50) {
            patterns.push({ name: 'mean_reversion', strength: 0.6 });
        }

        // Consolidation Pattern
        if (features.volatility < 0.15 && Math.abs(features.change) < 2) {
            patterns.push({ name: 'consolidation', strength: 0.5 });
        }

        // Return strongest pattern or default
        const strongestPattern = patterns.sort((a, b) => b.strength - a.strength)[0];
        return strongestPattern || { name: 'no_pattern', strength: 0.1 };
    }

    // Market Sentiment Analysis
    calculateSentiment(stockData) {
        let sentimentScore = 0;
        let factors = [];

        // Price momentum sentiment
        if (stockData.changePercent > 3) {
            sentimentScore += 0.3;
            factors.push('Strong positive momentum');
        } else if (stockData.changePercent < -3) {
            sentimentScore -= 0.3;
            factors.push('Strong negative momentum');
        }

        // Volume sentiment
        const volumeRatio = stockData.volume / (stockData.volume * 0.8); // Simplified
        if (volumeRatio > 1.5) {
            sentimentScore += 0.2;
            factors.push('High volume interest');
        }

        // Price level sentiment
        const priceRange = (stockData.price - stockData.low) / (stockData.high - stockData.low);
        if (priceRange > 0.8) {
            sentimentScore += 0.15;
            factors.push('Trading near highs');
        } else if (priceRange < 0.2) {
            sentimentScore -= 0.15;
            factors.push('Trading near lows');
        }

        return {
            score: Math.max(-1, Math.min(1, sentimentScore)),
            factors,
            label: sentimentScore > 0.2 ? 'Bullish' : 
                   sentimentScore < -0.2 ? 'Bearish' : 'Neutral'
        };
    }

    // Price Action Analysis
    analyzePriceAction(stockData) {
        let score = 0;
        const factors = [];

        // Gap analysis
        const gapPercent = ((stockData.price - stockData.open) / stockData.open) * 100;
        if (Math.abs(gapPercent) > 2) {
            score += gapPercent > 0 ? 0.1 : -0.1;
            factors.push(`${gapPercent > 0 ? 'Positive' : 'Negative'} gap of ${Math.abs(gapPercent).toFixed(1)}%`);
        }

        // Range analysis
        const range = ((stockData.high - stockData.low) / stockData.open) * 100;
        if (range > 4) {
            score += 0.05;
            factors.push(`Wide trading range (${range.toFixed(1)}%)`);
        }

        // Close position in range
        const closePosition = (stockData.price - stockData.low) / (stockData.high - stockData.low);
        if (closePosition > 0.8) {
            score += 0.1;
            factors.push('Closing near session highs');
        } else if (closePosition < 0.2) {
            score -= 0.1;
            factors.push('Closing near session lows');
        }

        return { score, factors };
    }

    // Strategy Selection based on market conditions
    selectOptimalStrategy(features, technicalScore) {
        // High momentum conditions favor momentum strategy
        if (features.momentum > 0.7 && Math.abs(technicalScore) > 0.3) {
            return 'momentum';
        }

        // Overbought/oversold conditions favor mean reversion
        if (features.rsi > 70 || features.rsi < 30) {
            return 'meanReversion';
        }

        // High volatility with strong signals favor breakout
        if (features.volatility > 0.35 && Math.abs(technicalScore) > 0.25) {
            return 'breakout';
        }

        // Low volatility favors swing trading
        if (features.volatility < 0.2) {
            return 'swing';
        }

        // Default to the best performing strategy
        return Array.from(this.strategies.entries())
            .sort((a, b) => b[1].performance - a[1].performance)[0][0];
    }

    // Calculate target price based on strategy and volatility
    calculateTarget(price, action, volatility) {
        const baseMultiplier = action === 'BUY' ? 1 : -1;
        const volatilityFactor = Math.max(0.02, Math.min(0.08, volatility));
        const targetMultiplier = 1 + (baseMultiplier * volatilityFactor * 2);
        
        return parseFloat((price * targetMultiplier).toFixed(2));
    }

    // Calculate stop loss based on volatility and risk management
    calculateStopLoss(price, action, volatility) {
        const baseMultiplier = action === 'BUY' ? -1 : 1;
        const volatilityFactor = Math.max(0.015, Math.min(0.05, volatility));
        const stopMultiplier = 1 + (baseMultiplier * volatilityFactor * 1.5);
        
        return parseFloat((price * stopMultiplier).toFixed(2));
    }

    // Generate comprehensive reasoning for recommendations
    generateReasoning(analysis, pattern, sentiment, stockData) {
        const reasons = [];

        // Technical analysis reasoning
        if (analysis.action === 'BUY') {
            reasons.push('Technical indicators suggest bullish momentum');
        } else if (analysis.action === 'SELL') {
            reasons.push('Technical indicators suggest bearish pressure');
        }

        // Pattern reasoning
        if (pattern.strength > 0.6) {
            reasons.push(`Strong ${pattern.name.replace('_', ' ')} pattern detected`);
        }

        // Sentiment reasoning
        if (sentiment.score > 0.2) {
            reasons.push('Market sentiment is bullish');
        } else if (sentiment.score < -0.2) {
            reasons.push('Market sentiment is bearish');
        }

        // Volume reasoning
        if (stockData.volume > 2000000) {
            reasons.push('High volume supports the move');
        }

        // Price action reasoning
        const priceChange = stockData.changePercent;
        if (Math.abs(priceChange) > 3) {
            reasons.push(`Strong ${priceChange > 0 ? 'upward' : 'downward'} price movement`);
        }

        return reasons.join('. ') + '.';
    }

    // Calculate risk-reward ratio
    calculateRiskReward(analysis) {
        const riskFactor = Math.max(0.5, Math.min(3.0, analysis.volatility * 5));
        const rewardFactor = Math.max(1.0, Math.min(5.0, analysis.confidence / 20));
        const ratio = rewardFactor / riskFactor;
        
        return `1:${ratio.toFixed(1)}`;
    }

    // Select appropriate timeframe based on volatility and momentum
    selectTimeframe(volatility, momentum) {
        if (volatility > 0.4 && momentum > 0.7) return '1-2 days';
        if (volatility > 0.25) return '2-5 days';
        if (momentum < 0.3) return '1-3 weeks';
        return '3-7 days';
    }

    // Calculate priority score for ranking recommendations
    calculatePriority(analysis, pattern, sentiment) {
        let priority = analysis.confidence / 100;
        
        // Boost priority for strong patterns
        priority += pattern.strength * 0.3;
        
        // Boost priority for clear sentiment
        priority += Math.abs(sentiment.score) * 0.2;
        
        // Boost priority for high conviction strategies
        const strategyPerf = this.strategies.get(analysis.strategy)?.performance || 0.5;
        priority += strategyPerf * 0.3;

        return Math.max(0, Math.min(1, priority));
    }

    // Adjust confidence based on current market conditions
    adjustConfidenceByMarket(baseConfidence, stockData) {
        let adjustedConfidence = baseConfidence;

        // Reduce confidence in highly volatile conditions
        if (stockData.changePercent && Math.abs(stockData.changePercent) > 8) {
            adjustedConfidence *= 0.9;
        }

        // Boost confidence for stocks with consistent volume
        if (stockData.volume > 1000000) {
            adjustedConfidence *= 1.05;
        }

        // Market hours adjustment (simplified)
        const now = new Date();
        const hour = now.getHours();
        if (hour < 9 || hour > 16) { // Outside market hours
            adjustedConfidence *= 0.95;
        }

        return Math.max(50, Math.min(95, adjustedConfidence));
    }

    // Calculate overall technical strength
    calculateTechnicalStrength(features) {
        let strength = 0;
        
        // RSI strength
        if (features.rsi >= 45 && features.rsi <= 55) strength += 0.2; // Neutral is strong
        else if (features.rsi < 30 || features.rsi > 70) strength += 0.3; // Extreme is strong signal
        
        // MACD strength
        if (Math.abs(features.macd) > 0.5) strength += 0.2;
        
        // Momentum strength
        if (features.momentum > 0.6) strength += 0.3;
        
        // Volume strength
        if (features.volume > 2) strength += 0.2;
        
        // Volatility provides opportunity
        if (features.volatility > 0.25) strength += 0.1;

        return Math.min(1.0, strength);
    }

    // Learn from trade outcomes to improve model
    learnFromTrade(trade) {
        if (!trade || trade.status !== 'closed') return;

        // Update strategy performance
        const strategy = trade.strategy;
        if (this.strategies.has(strategy)) {
            const strategyStats = this.strategies.get(strategy);
            const isWin = trade.profit > 0;
            
            // Exponential moving average for performance
            strategyStats.performance = strategyStats.performance * 0.95 + (isWin ? 1 : 0) * 0.05;
            strategyStats.trades += 1;
            
            // Adjust weight based on performance
            if (strategyStats.performance > 0.7) {
                strategyStats.weight = Math.min(strategyStats.weight * 1.02, 0.4);
            } else if (strategyStats.performance < 0.5) {
                strategyStats.weight = Math.max(strategyStats.weight * 0.98, 0.05);
            }

            this.strategies.set(strategy, strategyStats);
        }

        // Update model accuracy
        this.model.epochs += 1;
        const recentAccuracy = trade.profit > 0 ? 1 : 0;
        this.model.accuracy = this.model.accuracy * 0.99 + recentAccuracy * 0.01;
        
        console.log(`🧠 ML Model learned from ${strategy} trade. New accuracy: ${(this.model.accuracy * 100).toFixed(1)}%`);

        return {
            strategy,
            modelAccuracy: this.model.accuracy,
            strategyPerformance: this.strategies.get(strategy)?.performance
        };
    }

    // Get model performance metrics
    getModelMetrics() {
        return {
            version: this.model.version,
            accuracy: parseFloat((this.model.accuracy * 100).toFixed(1)),
            confidence: parseFloat((this.model.confidence * 100).toFixed(1)),
            epochs: this.model.epochs,
            totalPatterns: this.patterns.size,
            totalStrategies: this.strategies.size,
            bestStrategy: Array.from(this.strategies.entries())
                .sort((a, b) => b[1].performance - a[1].performance)[0],
            marketConditions: this.marketConditions
        };
    }

    // Update market conditions assessment
    updateMarketConditions(marketData) {
        const stocks = Object.values(marketData);
        if (stocks.length === 0) return;

        // Calculate average volatility
        const avgVolatility = stocks.reduce((sum, stock) => {
            const volatility = Math.abs(stock.changePercent) / 100;
            return sum + volatility;
        }, 0) / stocks.length;

        // Calculate trend
        const positiveStocks = stocks.filter(stock => stock.changePercent > 0).length;
        const trendRatio = positiveStocks / stocks.length;

        // Update conditions
        this.marketConditions = {
            volatility: avgVolatility > 0.03 ? 'high' : avgVolatility > 0.015 ? 'medium' : 'low',
            trend: trendRatio > 0.6 ? 'bullish' : trendRatio < 0.4 ? 'bearish' : 'neutral',
            volume: 'normal', // Simplified
            sentiment: trendRatio > 0.55 ? 'positive' : trendRatio < 0.45 ? 'negative' : 'neutral'
        };
    }
}

// Export singleton instance
export default new MLService();
