import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTradingStore = create(
    persist(
        (set, get) => ({
            // Market data
            marketData: {},
            lastUpdate: null,

            // ML System
            mlModel: {
                accuracy: 0.65,
                totalTrades: 0,
                winRate: 0,
                strategies: new Map(),
                patterns: new Map()
            },

            // Trades
            tradeHistory: [],
            activeTrades: [],

            // AI Recommendations
            aiRecommendations: [],

            // Actions
            updateMarketData: (data) => set({
                marketData: data,
                lastUpdate: Date.now()
            }),

            addTrade: (trade) => set((state) => ({
                tradeHistory: [...state.tradeHistory, {
                    ...trade,
                    id: Date.now(),
                    timestamp: Date.now()
                }]
            })),

            updateMLModel: (updates) => set((state) => ({
                mlModel: {
                    ...state.mlModel,
                    ...updates
                }
            })),

            setAIRecommendations: (recommendations) => set({
                aiRecommendations: recommendations
            }),

            // Performance calculations
            getPerformanceMetrics: () => {
                const state = get();
                const trades = state.tradeHistory.filter(t => t.status === 'closed');

                if (trades.length === 0) {
                    return {
                        totalTrades: 0,
                        winRate: 0,
                        totalReturn: 0,
                        avgReturn: 0,
                        bestTrade: 0,
                        worstTrade: 0
                    };
                }

                const wins = trades.filter(t => t.profit > 0).length;
                const totalReturn = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
                const returns = trades.map(t => t.profit || 0);

                return {
                    totalTrades: trades.length,
                    winRate: parseFloat((wins / trades.length * 100).toFixed(1)),
                    totalReturn: parseFloat(totalReturn.toFixed(2)),
                    avgReturn: parseFloat((totalReturn / trades.length).toFixed(2)),
                    bestTrade: Math.max(...returns),
                    worstTrade: Math.min(...returns)
                };
            }
        }),
        {
            name: 'quantum-trade-store',
            partialize: (state) => ({
                tradeHistory: state.tradeHistory,
                mlModel: state.mlModel
            })
        }
    )
);

export default useTradingStore;
