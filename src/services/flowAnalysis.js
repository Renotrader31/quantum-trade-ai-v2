/**
 * Advanced Options Flow Analysis Engine
 * Sophisticated analysis of unusual options activity and market sentiment
 */

class FlowAnalysis {
    constructor() {
        this.flowPatterns = {};
        this.whaleThresholds = {
            premium: 50000,    // $50K+ premium
            volume: 100,       // 100+ contracts
            unusualVolume: 5   // 5x average volume
        };
        
        this.sentimentWeights = {
            callPutRatio: 0.3,
            volumeProfile: 0.25,
            premiumFlow: 0.25,
            timeDecay: 0.2
        };
    }

    // ==================== FLOW PATTERN ANALYSIS ====================

    /**
     * Analyze options flow patterns and identify whale activity
     */
    analyzeFlowPatterns(flowData) {
        if (!flowData || flowData.length === 0) {
            return this.getEmptyAnalysis();
        }

        const analysis = {
            whaleActivity: this.detectWhaleActivity(flowData),
            sentimentAnalysis: this.analyzeSentiment(flowData),
            volumeAnalysis: this.analyzeVolume(flowData),
            premiumFlow: this.analyzePremiumFlow(flowData),
            timeAnalysis: this.analyzeTimePatterns(flowData),
            unusualActivity: this.detectUnusualActivity(flowData),
            gamma: this.analyzeGammaExposure(flowData),
            strategies: this.identifyStrategies(flowData)
        };

        analysis.overallSignal = this.calculateOverallFlowSignal(analysis);
        return analysis;
    }

    /**
     * Detect whale activity (large premium trades)
     */
    detectWhaleActivity(flowData) {
        const whaleFlows = flowData.filter(flow => {
            const premium = flow.premium || flow.total_premium || 0;
            const volume = flow.volume || 0;
            
            return premium >= this.whaleThresholds.premium || 
                   volume >= this.whaleThresholds.volume;
        });

        const totalWhalePremium = whaleFlows.reduce((sum, flow) => 
            sum + (flow.premium || flow.total_premium || 0), 0);
        
        const whaleCallPremium = whaleFlows
            .filter(f => (f.type || f.call_put || '').toLowerCase().includes('call'))
            .reduce((sum, flow) => sum + (flow.premium || flow.total_premium || 0), 0);
        
        const whalePutPremium = whaleFlows
            .filter(f => (f.type || f.call_put || '').toLowerCase().includes('put'))
            .reduce((sum, flow) => sum + (flow.premium || flow.total_premium || 0), 0);

        return {
            totalWhaleFlows: whaleFlows.length,
            totalWhalePremium: totalWhalePremium,
            whaleCallPremium: whaleCallPremium,
            whalePutPremium: whalePutPremium,
            whaleCallPutRatio: whalePutPremium > 0 ? whaleCallPremium / whalePutPremium : 
                              whaleCallPremium > 0 ? 999 : 0,
            averageWhalePremium: whaleFlows.length > 0 ? totalWhalePremium / whaleFlows.length : 0,
            largestFlow: whaleFlows.reduce((max, flow) => 
                Math.max(max, flow.premium || flow.total_premium || 0), 0),
            whaleFlows: whaleFlows.slice(0, 10) // Top 10 whale flows
        };
    }

    /**
     * Analyze overall market sentiment from flow
     */
    analyzeSentiment(flowData) {
        const calls = flowData.filter(f => (f.type || f.call_put || '').toLowerCase().includes('call'));
        const puts = flowData.filter(f => (f.type || f.call_put || '').toLowerCase().includes('put'));
        
        const callVolume = calls.reduce((sum, f) => sum + (f.volume || 0), 0);
        const putVolume = puts.reduce((sum, f) => sum + (f.volume || 0), 0);
        
        const callPremium = calls.reduce((sum, f) => sum + (f.premium || f.total_premium || 0), 0);
        const putPremium = puts.reduce((sum, f) => sum + (f.premium || f.total_premium || 0), 0);
        
        const callPutRatio = putVolume > 0 ? callVolume / putVolume : callVolume > 0 ? 999 : 1;
        const premiumRatio = putPremium > 0 ? callPremium / putPremium : callPremium > 0 ? 999 : 1;
        
        // Calculate sentiment score (0-100, 50 = neutral)
        let sentimentScore = 50;
        
        // Call/Put ratio influence (higher ratio = more bullish)
        if (callPutRatio > 1.5) sentimentScore += 15;
        else if (callPutRatio > 1.2) sentimentScore += 10;
        else if (callPutRatio > 1.0) sentimentScore += 5;
        else if (callPutRatio < 0.7) sentimentScore -= 15;
        else if (callPutRatio < 0.8) sentimentScore -= 10;
        else if (callPutRatio < 0.9) sentimentScore -= 5;
        
        // Premium flow influence
        if (premiumRatio > 2.0) sentimentScore += 10;
        else if (premiumRatio < 0.5) sentimentScore -= 10;
        
        return {
            callCount: calls.length,
            putCount: puts.length,
            callVolume: callVolume,
            putVolume: putVolume,
            callPremium: callPremium,
            putPremium: putPremium,
            callPutRatio: callPutRatio,
            premiumRatio: premiumRatio,
            sentimentScore: Math.max(0, Math.min(100, sentimentScore)),
            sentiment: sentimentScore > 70 ? 'VERY_BULLISH' :
                      sentimentScore > 60 ? 'BULLISH' :
                      sentimentScore > 40 ? 'NEUTRAL' :
                      sentimentScore > 30 ? 'BEARISH' : 'VERY_BEARISH'
        };
    }

    /**
     * Analyze volume patterns
     */
    analyzeVolume(flowData) {
        const totalVolume = flowData.reduce((sum, f) => sum + (f.volume || 0), 0);
        const totalContracts = flowData.length;
        const avgVolumePerContract = totalContracts > 0 ? totalVolume / totalContracts : 0;
        
        // Group by strike ranges for volume distribution
        const strikes = flowData.map(f => f.strike || f.strike_price || 0).filter(s => s > 0);
        const strikeVolumes = {};
        
        flowData.forEach(flow => {
            const strike = flow.strike || flow.strike_price || 0;
            if (strike > 0) {
                strikeVolumes[strike] = (strikeVolumes[strike] || 0) + (flow.volume || 0);
            }
        });
        
        const maxVolumeStrike = Object.keys(strikeVolumes).reduce((maxStrike, strike) => 
            strikeVolumes[strike] > (strikeVolumes[maxStrike] || 0) ? strike : maxStrike, '0');
        
        return {
            totalVolume: totalVolume,
            totalContracts: totalContracts,
            avgVolumePerContract: avgVolumePerContract,
            maxVolumeStrike: parseFloat(maxVolumeStrike),
            maxVolumeAmount: strikeVolumes[maxVolumeStrike] || 0,
            strikeDistribution: Object.keys(strikeVolumes).length,
            volumeConcentration: totalVolume > 0 ? (strikeVolumes[maxVolumeStrike] || 0) / totalVolume : 0
        };
    }

    /**
     * Analyze premium flow patterns
     */
    analyzePremiumFlow(flowData) {
        const totalPremium = flowData.reduce((sum, f) => 
            sum + (f.premium || f.total_premium || 0), 0);
        
        const premiumByStrike = {};
        flowData.forEach(flow => {
            const strike = flow.strike || flow.strike_price || 0;
            const premium = flow.premium || flow.total_premium || 0;
            if (strike > 0 && premium > 0) {
                premiumByStrike[strike] = (premiumByStrike[strike] || 0) + premium;
            }
        });
        
        const largestPremiumFlow = flowData.reduce((max, flow) => {
            const premium = flow.premium || flow.total_premium || 0;
            return premium > (max.premium || max.total_premium || 0) ? flow : max;
        }, flowData[0] || {});
        
        return {
            totalPremium: totalPremium,
            avgPremiumPerFlow: flowData.length > 0 ? totalPremium / flowData.length : 0,
            largestPremiumFlow: largestPremiumFlow,
            premiumDistribution: premiumByStrike,
            highPremiumFlows: flowData.filter(f => 
                (f.premium || f.total_premium || 0) > this.whaleThresholds.premium
            ).length
        };
    }

    /**
     * Analyze time-based patterns
     */
    analyzeTimePatterns(flowData) {
        const now = Date.now();
        const recentFlows = flowData.filter(flow => {
            const flowTime = flow.timestamp || flow.time || now;
            return (now - flowTime) < 3600000; // Last hour
        });
        
        // Group by expiration dates
        const expirationGroups = {};
        flowData.forEach(flow => {
            const exp = flow.expiration || flow.exp_date || 'unknown';
            expirationGroups[exp] = (expirationGroups[exp] || 0) + 1;
        });
        
        const mostPopularExpiration = Object.keys(expirationGroups).reduce((maxExp, exp) => 
            expirationGroups[exp] > (expirationGroups[maxExp] || 0) ? exp : maxExp, 'unknown');
        
        return {
            totalFlows: flowData.length,
            recentFlows: recentFlows.length,
            recentActivity: flowData.length > 0 ? recentFlows.length / flowData.length : 0,
            expirationDistribution: expirationGroups,
            mostPopularExpiration: mostPopularExpiration,
            shortTermFlows: Object.keys(expirationGroups).filter(exp => 
                this.isShortTermExpiration(exp)).length
        };
    }

    /**
     * Detect unusual activity patterns
     */
    detectUnusualActivity(flowData) {
        const unusualPatterns = [];
        
        // Large single trades
        const largeTrades = flowData.filter(f => 
            (f.premium || f.total_premium || 0) > this.whaleThresholds.premium * 2);
        if (largeTrades.length > 0) {
            unusualPatterns.push({
                type: 'LARGE_TRADES',
                count: largeTrades.length,
                description: `${largeTrades.length} trades with premium > $${this.whaleThresholds.premium * 2}`,
                significance: 'HIGH'
            });
        }
        
        // Concentrated strikes
        const strikes = {};
        flowData.forEach(f => {
            const strike = f.strike || f.strike_price || 0;
            strikes[strike] = (strikes[strike] || 0) + 1;
        });
        
        const maxStrikes = Math.max(...Object.values(strikes));
        if (maxStrikes > flowData.length * 0.3) {
            unusualPatterns.push({
                type: 'STRIKE_CONCENTRATION',
                count: maxStrikes,
                description: `Heavy concentration at single strike level`,
                significance: 'MEDIUM'
            });
        }
        
        // Time concentration
        const hourGroups = {};
        flowData.forEach(f => {
            const time = new Date(f.timestamp || f.time || Date.now());
            const hour = time.getHours();
            hourGroups[hour] = (hourGroups[hour] || 0) + 1;
        });
        
        const maxHourActivity = Math.max(...Object.values(hourGroups));
        if (maxHourActivity > flowData.length * 0.5) {
            unusualPatterns.push({
                type: 'TIME_CONCENTRATION',
                count: maxHourActivity,
                description: `Heavy activity concentrated in single hour`,
                significance: 'MEDIUM'
            });
        }
        
        return unusualPatterns;
    }

    /**
     * Analyze gamma exposure implications
     */
    analyzeGammaExposure(flowData) {
        // Simplified gamma analysis
        const callFlows = flowData.filter(f => (f.type || f.call_put || '').toLowerCase().includes('call'));
        const putFlows = flowData.filter(f => (f.type || f.call_put || '').toLowerCase().includes('put'));
        
        const totalCallVolume = callFlows.reduce((sum, f) => sum + (f.volume || 0), 0);
        const totalPutVolume = putFlows.reduce((sum, f) => sum + (f.volume || 0), 0);
        
        // Estimate net gamma exposure (simplified)
        const netGammaExposure = totalCallVolume - totalPutVolume;
        
        return {
            callGamma: totalCallVolume,
            putGamma: totalPutVolume,
            netGamma: netGammaExposure,
            gammaImplication: netGammaExposure > 1000 ? 'POSITIVE_GAMMA' :
                            netGammaExposure < -1000 ? 'NEGATIVE_GAMMA' : 'NEUTRAL_GAMMA',
            volatilityImpact: Math.abs(netGammaExposure) > 2000 ? 'HIGH' : 
                            Math.abs(netGammaExposure) > 500 ? 'MEDIUM' : 'LOW'
        };
    }

    /**
     * Identify potential trading strategies from flow
     */
    identifyStrategies(flowData) {
        const strategies = [];
        
        // Group by symbol and analyze
        const symbolGroups = {};
        flowData.forEach(flow => {
            const symbol = flow.symbol || flow.ticker || 'UNKNOWN';
            if (!symbolGroups[symbol]) symbolGroups[symbol] = [];
            symbolGroups[symbol].push(flow);
        });
        
        Object.keys(symbolGroups).forEach(symbol => {
            const flows = symbolGroups[symbol];
            if (flows.length < 2) return;
            
            const calls = flows.filter(f => (f.type || f.call_put || '').toLowerCase().includes('call'));
            const puts = flows.filter(f => (f.type || f.call_put || '').toLowerCase().includes('put'));
            
            // Straddle/Strangle detection
            if (calls.length > 0 && puts.length > 0) {
                const callStrikes = calls.map(f => f.strike || f.strike_price || 0);
                const putStrikes = puts.map(f => f.strike || f.strike_price || 0);
                
                // Check for same strikes (straddle)
                const commonStrikes = callStrikes.filter(strike => putStrikes.includes(strike));
                if (commonStrikes.length > 0) {
                    strategies.push({
                        type: 'LONG_STRADDLE',
                        symbol: symbol,
                        strikes: commonStrikes,
                        confidence: 80,
                        implication: 'VOLATILITY_PLAY'
                    });
                }
                
                // Check for different strikes (strangle)
                if (commonStrikes.length === 0 && calls.length > 0 && puts.length > 0) {
                    strategies.push({
                        type: 'STRANGLE',
                        symbol: symbol,
                        callStrikes: [...new Set(callStrikes)],
                        putStrikes: [...new Set(putStrikes)],
                        confidence: 70,
                        implication: 'VOLATILITY_PLAY'
                    });
                }
            }
            
            // Sweep detection (large volume at specific strike)
            flows.forEach(flow => {
                const volume = flow.volume || 0;
                const premium = flow.premium || flow.total_premium || 0;
                
                if (volume > 500 || premium > 100000) {
                    strategies.push({
                        type: 'SWEEP',
                        symbol: symbol,
                        strike: flow.strike || flow.strike_price,
                        volume: volume,
                        premium: premium,
                        confidence: 90,
                        implication: 'DIRECTIONAL_BET'
                    });
                }
            });
        });
        
        return strategies;
    }

    /**
     * Calculate overall flow signal
     */
    calculateOverallFlowSignal(analysis) {
        let bullishScore = 0;
        let bearishScore = 0;
        let totalWeight = 0;
        
        // Sentiment analysis weight
        const sentimentWeight = this.sentimentWeights.callPutRatio;
        if (analysis.sentimentAnalysis.sentimentScore > 60) {
            bullishScore += sentimentWeight * (analysis.sentimentAnalysis.sentimentScore - 50) / 50;
        } else if (analysis.sentimentAnalysis.sentimentScore < 40) {
            bearishScore += sentimentWeight * (50 - analysis.sentimentAnalysis.sentimentScore) / 50;
        }
        totalWeight += sentimentWeight;
        
        // Whale activity weight
        const whaleWeight = this.sentimentWeights.premiumFlow;
        if (analysis.whaleActivity.whaleCallPutRatio > 1.5) {
            bullishScore += whaleWeight * 0.8;
        } else if (analysis.whaleActivity.whaleCallPutRatio < 0.7) {
            bearishScore += whaleWeight * 0.8;
        }
        totalWeight += whaleWeight;
        
        // Volume analysis weight
        const volumeWeight = this.sentimentWeights.volumeProfile;
        if (analysis.volumeAnalysis.volumeConcentration > 0.7) {
            // High concentration might indicate strong conviction
            if (analysis.sentimentAnalysis.sentimentScore > 50) {
                bullishScore += volumeWeight * 0.6;
            } else {
                bearishScore += volumeWeight * 0.6;
            }
        }
        totalWeight += volumeWeight;
        
        const finalScore = totalWeight > 0 ? (bullishScore - bearishScore) / totalWeight : 0;
        const confidence = Math.abs(finalScore) * 100;
        
        return {
            signal: finalScore > 0.3 ? 'BULLISH' :
                   finalScore > 0.1 ? 'SLIGHTLY_BULLISH' :
                   finalScore < -0.3 ? 'BEARISH' :
                   finalScore < -0.1 ? 'SLIGHTLY_BEARISH' : 'NEUTRAL',
            confidence: Math.min(confidence, 95),
            score: finalScore,
            components: {
                sentimentContribution: (bullishScore - bearishScore) * sentimentWeight,
                whaleContribution: analysis.whaleActivity.whaleCallPutRatio,
                volumeContribution: analysis.volumeAnalysis.volumeConcentration
            }
        };
    }

    // ==================== HELPER METHODS ====================

    isShortTermExpiration(expiration) {
        if (!expiration || expiration === 'unknown') return false;
        
        try {
            const expDate = new Date(expiration);
            const now = new Date();
            const daysToExp = (expDate - now) / (1000 * 60 * 60 * 24);
            return daysToExp <= 7; // 7 days or less
        } catch {
            return false;
        }
    }

    getEmptyAnalysis() {
        return {
            whaleActivity: {
                totalWhaleFlows: 0,
                totalWhalePremium: 0,
                whaleCallPremium: 0,
                whalePutPremium: 0,
                whaleCallPutRatio: 0,
                averageWhalePremium: 0,
                largestFlow: 0,
                whaleFlows: []
            },
            sentimentAnalysis: {
                callCount: 0,
                putCount: 0,
                callVolume: 0,
                putVolume: 0,
                callPremium: 0,
                putPremium: 0,
                callPutRatio: 1,
                premiumRatio: 1,
                sentimentScore: 50,
                sentiment: 'NEUTRAL'
            },
            overallSignal: {
                signal: 'NO_DATA',
                confidence: 0,
                score: 0
            }
        };
    }
}

export default new FlowAnalysis();