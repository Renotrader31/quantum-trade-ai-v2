/**
 * 🎯 OPTIONS STRATEGIES SERVICE 
 * Comprehensive options trading strategies with P&L calculations
 */

class OptionsStrategiesService {
    constructor() {
        this.riskFreeRate = 0.05; // 5% risk-free rate
        this.strategies = {
            // Basic Strategies
            'long-call': 'Long Call',
            'short-call': 'Short Call', 
            'long-put': 'Long Put',
            'short-put': 'Short Put',
            
            // Vertical Spreads
            'bull-call-spread': 'Bull Call Spread',
            'bear-call-spread': 'Bear Call Spread',
            'bull-put-spread': 'Bull Put Spread',
            'bear-put-spread': 'Bear Put Spread',
            
            // Horizontal/Calendar Spreads
            'calendar-call': 'Calendar Call Spread',
            'calendar-put': 'Calendar Put Spread',
            
            // Volatility Strategies
            'long-straddle': 'Long Straddle',
            'short-straddle': 'Short Straddle',
            'long-strangle': 'Long Strangle',
            'short-strangle': 'Short Strangle',
            
            // Advanced Strategies
            'iron-condor': 'Iron Condor',
            'iron-butterfly': 'Iron Butterfly',
            'jade-lizard': 'Jade Lizard',
            'big-lizard': 'Big Lizard',
            'broken-wing-butterfly': 'Broken Wing Butterfly',
            
            // Ratio Strategies
            'call-ratio-spread': 'Call Ratio Spread',
            'put-ratio-spread': 'Put Ratio Spread',
            
            // Synthetic Strategies
            'synthetic-long': 'Synthetic Long Stock',
            'synthetic-short': 'Synthetic Short Stock',
            'collar': 'Protective Collar'
        };
    }

    /**
     * 🧮 BLACK-SCHOLES OPTION PRICING
     */
    blackScholes(S, K, T, r, sigma, type = 'call') {
        if (T <= 0) return type === 'call' ? Math.max(S - K, 0) : Math.max(K - S, 0);
        
        const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        const N = this.normalCDF;
        
        if (type === 'call') {
            return S * N(d1) - K * Math.exp(-r * T) * N(d2);
        } else {
            return K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
        }
    }

    /**
     * 🔢 NORMAL CUMULATIVE DISTRIBUTION FUNCTION
     */
    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    /**
     * 🎯 CALCULATE GREEKS
     */
    calculateGreeks(S, K, T, r, sigma, type = 'call') {
        if (T <= 0) {
            return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
        }

        const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        const N = this.normalCDF;
        const n = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); // PDF

        const delta = type === 'call' ? N(d1) : N(d1) - 1;
        const gamma = n(d1) / (S * sigma * Math.sqrt(T));
        const theta = type === 'call' 
            ? (-S * n(d1) * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * N(d2)) / 365
            : (-S * n(d1) * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N(-d2)) / 365;
        const vega = S * n(d1) * Math.sqrt(T) / 100;
        const rho = type === 'call' 
            ? K * T * Math.exp(-r * T) * N(d2) / 100
            : -K * T * Math.exp(-r * T) * N(-d2) / 100;

        return { delta, gamma, theta, vega, rho };
    }

    /**
     * 🎭 STRATEGY BUILDERS
     */

    // Long Call Strategy
    longCall(params) {
        const { strike, premium, stockPrice, daysToExpiry, volatility } = params;
        const T = daysToExpiry / 365;
        
        return {
            strategy: 'long-call',
            name: 'Long Call',
            legs: [{
                type: 'call',
                action: 'buy',
                strike,
                premium,
                quantity: 1
            }],
            maxProfit: 'Unlimited',
            maxLoss: premium * 100,
            breakeven: strike + premium,
            analysis: this.analyzeLongCall(stockPrice, strike, premium, T, volatility),
            greeks: this.calculateGreeks(stockPrice, strike, T, this.riskFreeRate, volatility, 'call')
        };
    }

    // Bull Call Spread Strategy  
    bullCallSpread(params) {
        const { longStrike, shortStrike, longPremium, shortPremium, stockPrice, daysToExpiry, volatility } = params;
        const T = daysToExpiry / 365;
        const netDebit = longPremium - shortPremium;
        
        return {
            strategy: 'bull-call-spread',
            name: 'Bull Call Spread',
            legs: [
                {
                    type: 'call',
                    action: 'buy',
                    strike: longStrike,
                    premium: longPremium,
                    quantity: 1
                },
                {
                    type: 'call',
                    action: 'sell',
                    strike: shortStrike,
                    premium: shortPremium,
                    quantity: 1
                }
            ],
            maxProfit: (shortStrike - longStrike - netDebit) * 100,
            maxLoss: netDebit * 100,
            breakeven: longStrike + netDebit,
            analysis: this.analyzeBullCallSpread(stockPrice, longStrike, shortStrike, netDebit, T)
        };
    }

    // Long Straddle Strategy
    longStraddle(params) {
        const { strike, callPremium, putPremium, stockPrice, daysToExpiry, volatility } = params;
        const T = daysToExpiry / 365;
        const totalPremium = callPremium + putPremium;
        
        return {
            strategy: 'long-straddle',
            name: 'Long Straddle',
            legs: [
                {
                    type: 'call',
                    action: 'buy',
                    strike,
                    premium: callPremium,
                    quantity: 1
                },
                {
                    type: 'put',
                    action: 'buy',
                    strike,
                    premium: putPremium,
                    quantity: 1
                }
            ],
            maxProfit: 'Unlimited',
            maxLoss: totalPremium * 100,
            breakeven: {
                upper: strike + totalPremium,
                lower: strike - totalPremium
            },
            analysis: this.analyzeLongStraddle(stockPrice, strike, totalPremium, T, volatility)
        };
    }

    // Iron Condor Strategy
    ironCondor(params) {
        const { 
            longPutStrike, shortPutStrike, shortCallStrike, longCallStrike,
            longPutPremium, shortPutPremium, shortCallPremium, longCallPremium,
            stockPrice, daysToExpiry 
        } = params;
        
        const netCredit = shortPutPremium + shortCallPremium - longPutPremium - longCallPremium;
        
        return {
            strategy: 'iron-condor',
            name: 'Iron Condor',
            legs: [
                {
                    type: 'put',
                    action: 'buy',
                    strike: longPutStrike,
                    premium: longPutPremium,
                    quantity: 1
                },
                {
                    type: 'put',
                    action: 'sell',
                    strike: shortPutStrike,
                    premium: shortPutPremium,
                    quantity: 1
                },
                {
                    type: 'call',
                    action: 'sell',
                    strike: shortCallStrike,
                    premium: shortCallPremium,
                    quantity: 1
                },
                {
                    type: 'call',
                    action: 'buy',
                    strike: longCallStrike,
                    premium: longCallPremium,
                    quantity: 1
                }
            ],
            maxProfit: netCredit * 100,
            maxLoss: (shortPutStrike - longPutStrike - netCredit) * 100,
            breakeven: {
                lower: shortPutStrike - netCredit,
                upper: shortCallStrike + netCredit
            },
            analysis: this.analyzeIronCondor(stockPrice, shortPutStrike, shortCallStrike, netCredit)
        };
    }

    // Jade Lizard Strategy
    jadeLizard(params) {
        const { 
            shortPutStrike, shortCallStrike, longCallStrike,
            shortPutPremium, shortCallPremium, longCallPremium,
            stockPrice, daysToExpiry 
        } = params;
        
        const netCredit = shortPutPremium + shortCallStrike - longCallPremium;
        
        return {
            strategy: 'jade-lizard',
            name: 'Jade Lizard',
            legs: [
                {
                    type: 'put',
                    action: 'sell',
                    strike: shortPutStrike,
                    premium: shortPutPremium,
                    quantity: 1
                },
                {
                    type: 'call',
                    action: 'sell',
                    strike: shortCallStrike,
                    premium: shortCallPremium,
                    quantity: 1
                },
                {
                    type: 'call',
                    action: 'buy',
                    strike: longCallStrike,
                    premium: longCallPremium,
                    quantity: 1
                }
            ],
            maxProfit: netCredit * 100,
            maxLoss: (shortPutStrike - netCredit) * 100, // Downside risk
            upSideRisk: 'Limited by long call',
            breakeven: shortPutStrike - netCredit,
            analysis: this.analyzeJadeLizard(stockPrice, shortPutStrike, shortCallStrike, longCallStrike, netCredit)
        };
    }

    /**
     * 📊 P&L CALCULATION METHODS
     */

    calculateProfitLoss(strategy, currentStockPrice, timeDecay = 0) {
        const legs = strategy.legs;
        let totalPL = 0;

        legs.forEach(leg => {
            const intrinsicValue = this.getIntrinsicValue(leg.type, leg.strike, currentStockPrice);
            const optionValue = Math.max(intrinsicValue - timeDecay, 0);
            
            if (leg.action === 'buy') {
                totalPL += (optionValue - leg.premium) * 100 * leg.quantity;
            } else {
                totalPL += (leg.premium - optionValue) * 100 * leg.quantity;
            }
        });

        return totalPL;
    }

    getIntrinsicValue(type, strike, stockPrice) {
        if (type === 'call') {
            return Math.max(stockPrice - strike, 0);
        } else {
            return Math.max(strike - stockPrice, 0);
        }
    }

    /**
     * 🎯 STRATEGY ANALYSIS METHODS
     */

    analyzeLongCall(stockPrice, strike, premium, timeToExpiry, volatility) {
        const probability = this.calculateProbability(stockPrice, strike + premium, timeToExpiry, volatility);
        
        return {
            outlook: stockPrice > strike ? 'Bullish - In the Money' : 'Bullish - Out of the Money',
            probabilityOfProfit: probability,
            timeDecayImpact: 'Negative - Theta works against you',
            volatilityImpact: 'Positive - Higher volatility increases value',
            recommendation: probability > 0.5 ? 'Favorable' : 'Risky'
        };
    }

    analyzeBullCallSpread(stockPrice, longStrike, shortStrike, netDebit, timeToExpiry) {
        const maxProfit = shortStrike - longStrike - netDebit;
        const probability = this.calculateProbability(stockPrice, longStrike + netDebit, timeToExpiry, 0.3);
        
        return {
            outlook: 'Moderately Bullish',
            probabilityOfProfit: probability,
            riskRewardRatio: maxProfit / netDebit,
            timeDecayImpact: 'Mixed - Theta helps near expiration if profitable',
            recommendation: probability > 0.4 && maxProfit > netDebit ? 'Good' : 'Neutral'
        };
    }

    analyzeLongStraddle(stockPrice, strike, totalPremium, timeToExpiry, volatility) {
        const moveNeeded = totalPremium / stockPrice;
        
        return {
            outlook: 'High Volatility Expected',
            moveNeeded: `${(moveNeeded * 100).toFixed(1)}%`,
            timeDecayImpact: 'Very Negative - Double theta decay',
            volatilityImpact: 'Very Positive - Benefits from vol expansion',
            recommendation: volatility > 0.4 ? 'Good for earnings/events' : 'High risk'
        };
    }

    analyzeIronCondor(stockPrice, shortPutStrike, shortCallStrike, netCredit) {
        const profitZone = shortCallStrike - shortPutStrike;
        const currentPosition = (stockPrice - shortPutStrike) / profitZone;
        
        return {
            outlook: 'Neutral - Range Bound',
            profitZone: `$${shortPutStrike} - $${shortCallStrike}`,
            currentPositionInZone: `${(currentPosition * 100).toFixed(1)}%`,
            timeDecayImpact: 'Positive - Benefits from theta decay',
            recommendation: currentPosition > 0.2 && currentPosition < 0.8 ? 'Excellent' : 'Risky'
        };
    }

    analyzeJadeLizard(stockPrice, shortPutStrike, shortCallStrike, longCallStrike, netCredit) {
        return {
            outlook: 'Neutral to Bullish',
            profitScenario: 'Profits if stock stays above put strike',
            upSideProtection: `Limited risk above $${longCallStrike}`,
            downSideRisk: `Full risk below $${shortPutStrike - netCredit}`,
            timeDecayImpact: 'Positive - Net credit strategy',
            recommendation: stockPrice > shortPutStrike ? 'Good' : 'Monitor closely'
        };
    }

    calculateProbability(currentPrice, targetPrice, timeToExpiry, volatility) {
        if (timeToExpiry <= 0) return currentPrice >= targetPrice ? 1 : 0;
        
        const drift = 0.1; // Assumed annual return
        const move = Math.log(targetPrice / currentPrice);
        const expectedMove = (drift - 0.5 * volatility * volatility) * timeToExpiry;
        const stdDev = volatility * Math.sqrt(timeToExpiry);
        
        const z = (move - expectedMove) / stdDev;
        return 1 - this.normalCDF(z);
    }

    /**
     * 🎨 STRATEGY VISUALIZATION DATA
     */
    generatePLChart(strategy, priceRange = null) {
        if (!priceRange) {
            const strikes = strategy.legs.map(leg => leg.strike);
            const minStrike = Math.min(...strikes);
            const maxStrike = Math.max(...strikes);
            const range = maxStrike - minStrike;
            priceRange = {
                min: minStrike - range * 0.3,
                max: maxStrike + range * 0.3,
                step: range * 0.05
            };
        }

        const chartData = [];
        for (let price = priceRange.min; price <= priceRange.max; price += priceRange.step) {
            const pl = this.calculateProfitLoss(strategy, price);
            chartData.push({
                stockPrice: parseFloat(price.toFixed(2)),
                profitLoss: parseFloat(pl.toFixed(2))
            });
        }

        return chartData;
    }

    /**
     * 🔍 STRATEGY SCREENER
     */
    recommendStrategies(marketOutlook, volatilityExpectation, riskTolerance) {
        const recommendations = [];

        if (marketOutlook === 'bullish') {
            if (riskTolerance === 'low') {
                recommendations.push('bull-call-spread', 'collar');
            } else {
                recommendations.push('long-call', 'call-ratio-spread');
            }
        } else if (marketOutlook === 'bearish') {
            if (riskTolerance === 'low') {
                recommendations.push('bear-put-spread', 'protective-put');
            } else {
                recommendations.push('long-put', 'put-ratio-spread');
            }
        } else { // neutral
            if (volatilityExpectation === 'high') {
                recommendations.push('long-straddle', 'long-strangle');
            } else {
                recommendations.push('iron-condor', 'jade-lizard', 'short-straddle');
            }
        }

        return recommendations.map(strategy => ({
            strategy,
            name: this.strategies[strategy],
            description: this.getStrategyDescription(strategy)
        }));
    }

    getStrategyDescription(strategy) {
        const descriptions = {
            'long-call': 'Bullish strategy with unlimited upside potential',
            'bull-call-spread': 'Moderately bullish with limited risk and reward',
            'long-straddle': 'Profit from large moves in either direction',
            'iron-condor': 'Profit from low volatility in a specific range',
            'jade-lizard': 'High probability strategy with upside protection'
        };
        
        return descriptions[strategy] || 'Advanced options strategy';
    }
}

export default new OptionsStrategiesService();