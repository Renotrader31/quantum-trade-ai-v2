import axios from 'axios';

class RealDataService {
    constructor() {
        this.apiKeys = {
            unusualWhales: process.env.REACT_APP_UNUSUAL_WHALES_API_KEY,
            alphaVantage: process.env.REACT_APP_ALPHA_VANTAGE_KEY,
            twelveData: process.env.REACT_APP_TWELVE_DATA_KEY,
            polygon: process.env.REACT_APP_POLYGON_API_KEY,
            fmp: process.env.REACT_APP_FMP_API_KEY,
            ortex: process.env.REACT_APP_ORTEX_API_KEY
        };
        
        this.timeout = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
        
        // API endpoints
        this.endpoints = {
            polygon: 'https://api.polygon.io',
            alphaVantage: 'https://www.alphavantage.co',
            twelveData: 'https://api.twelvedata.com',
            fmp: 'https://financialmodelingprep.com/api/v3',
            unusualWhales: 'https://api.unusualwhales.com',
            ortex: 'https://api.ortex.com'
        };
        
        console.log('🔑 RealDataService initialized with API keys:', {
            unusualWhales: !!this.apiKeys.unusualWhales,
            alphaVantage: !!this.apiKeys.alphaVantage,
            twelveData: !!this.apiKeys.twelveData,
            polygon: !!this.apiKeys.polygon,
            fmp: !!this.apiKeys.fmp,
            ortex: !!this.apiKeys.ortex
        });
    }

    // Cache management
    getCacheKey(endpoint, params) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }

    isCacheValid(timestamp) {
        return Date.now() - timestamp < this.cacheTimeout;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && this.isCacheValid(cached.timestamp)) {
            return cached.data;
        }
        return null;
    }

    // Generic API request handler
    async makeRequest(url, options = {}) {
        try {
            const response = await axios.get(url, {
                timeout: this.timeout,
                ...options
            });
            return response.data;
        } catch (error) {
            console.error(`❌ API Request failed for ${url}:`, error.message);
            throw error;
        }
    }

    // Polygon.io - Real-time stock data
    async getPolygonStockPrice(symbol) {
        if (!this.apiKeys.polygon) {
            throw new Error('Polygon API key not configured');
        }

        const cacheKey = this.getCacheKey('polygon_stock', { symbol });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.endpoints.polygon}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${this.apiKeys.polygon}`;
            const data = await this.makeRequest(url);
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const stockData = {
                    symbol,
                    price: result.c,
                    open: result.o,
                    high: result.h,
                    low: result.l,
                    volume: result.v,
                    change: result.c - result.o,
                    changePercent: ((result.c - result.o) / result.o) * 100,
                    source: 'Polygon',
                    timestamp: Date.now()
                };
                
                this.setCache(cacheKey, stockData);
                return stockData;
            }
        } catch (error) {
            console.error(`❌ Polygon API error for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Alpha Vantage - Market data and indicators
    async getAlphaVantageData(symbol, function_type = 'TIME_SERIES_INTRADAY') {
        if (!this.apiKeys.alphaVantage) {
            throw new Error('Alpha Vantage API key not configured');
        }

        const cacheKey = this.getCacheKey('alphavantage', { symbol, function_type });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.endpoints.alphaVantage}/query?function=${function_type}&symbol=${symbol}&interval=1min&apikey=${this.apiKeys.alphaVantage}`;
            const data = await this.makeRequest(url);
            
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`❌ Alpha Vantage API error for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Twelve Data - Financial data
    async getTwelveDataQuote(symbol) {
        if (!this.apiKeys.twelveData) {
            throw new Error('Twelve Data API key not configured');
        }

        const cacheKey = this.getCacheKey('twelvedata_quote', { symbol });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.endpoints.twelveData}/quote?symbol=${symbol}&apikey=${this.apiKeys.twelveData}`;
            const data = await this.makeRequest(url);
            
            if (data && !data.code) {
                const stockData = {
                    symbol: data.symbol,
                    price: parseFloat(data.close),
                    open: parseFloat(data.open),
                    high: parseFloat(data.high),
                    low: parseFloat(data.low),
                    volume: parseInt(data.volume),
                    change: parseFloat(data.change),
                    changePercent: parseFloat(data.percent_change),
                    source: 'Twelve Data',
                    timestamp: Date.now()
                };
                
                this.setCache(cacheKey, stockData);
                return stockData;
            }
        } catch (error) {
            console.error(`❌ Twelve Data API error for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Financial Modeling Prep - Comprehensive financial data
    async getFMPQuote(symbol) {
        if (!this.apiKeys.fmp) {
            throw new Error('FMP API key not configured');
        }

        const cacheKey = this.getCacheKey('fmp_quote', { symbol });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.endpoints.fmp}/quote/${symbol}?apikey=${this.apiKeys.fmp}`;
            const data = await this.makeRequest(url);
            
            if (data && data.length > 0) {
                const quote = data[0];
                const stockData = {
                    symbol: quote.symbol,
                    price: quote.price,
                    open: quote.open,
                    high: quote.dayHigh,
                    low: quote.dayLow,
                    volume: quote.volume,
                    change: quote.change,
                    changePercent: quote.changesPercentage,
                    marketCap: quote.marketCap,
                    pe: quote.pe,
                    source: 'FMP',
                    timestamp: Date.now()
                };
                
                this.setCache(cacheKey, stockData);
                return stockData;
            }
        } catch (error) {
            console.error(`❌ FMP API error for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Unusual Whales - Options flow data
    async getUnusualWhalesOptionsFlow(symbol = null) {
        if (!this.apiKeys.unusualWhales) {
            throw new Error('Unusual Whales API key not configured');
        }

        const cacheKey = this.getCacheKey('unusual_whales_flow', { symbol });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const baseUrl = `${this.endpoints.unusualWhales}/api/stock_options_flow`;
            const url = symbol ? `${baseUrl}/${symbol}` : baseUrl;
            
            const data = await this.makeRequest(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.unusualWhales}`
                }
            });
            
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`❌ Unusual Whales API error:`, error.message);
            throw error;
        }
    }

    // Ortex - Short interest data
    async getOrtexShortInterest(symbol) {
        if (!this.apiKeys.ortex) {
            throw new Error('Ortex API key not configured');
        }

        const cacheKey = this.getCacheKey('ortex_short', { symbol });
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.endpoints.ortex}/securities/${symbol}/short_interest`;
            const data = await this.makeRequest(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.ortex}`
                }
            });
            
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`❌ Ortex API error for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Unified method to get stock data from multiple sources
    async getStockData(symbol) {
        const results = {};
        const errors = [];

        // Try multiple providers in parallel
        const providers = [
            { name: 'polygon', method: () => this.getPolygonStockPrice(symbol) },
            { name: 'twelveData', method: () => this.getTwelveDataQuote(symbol) },
            { name: 'fmp', method: () => this.getFMPQuote(symbol) }
        ];

        const promises = providers.map(async (provider) => {
            try {
                const data = await provider.method();
                results[provider.name] = data;
                return { provider: provider.name, success: true, data };
            } catch (error) {
                errors.push({ provider: provider.name, error: error.message });
                return { provider: provider.name, success: false, error: error.message };
            }
        });

        const responses = await Promise.allSettled(promises);
        
        // Use the first successful response or combine data
        const successful = responses
            .filter(r => r.status === 'fulfilled' && r.value.success)
            .map(r => r.value.data);

        if (successful.length > 0) {
            // Use the most complete data (prefer FMP > Twelve Data > Polygon)
            const priority = ['fmp', 'twelveData', 'polygon'];
            for (const provider of priority) {
                if (results[provider]) {
                    return {
                        ...results[provider],
                        sources: Object.keys(results),
                        errors: errors.length > 0 ? errors : undefined
                    };
                }
            }
            return successful[0];
        }

        throw new Error(`Failed to fetch data for ${symbol} from all providers: ${errors.map(e => e.error).join(', ')}`);
    }

    // Get market overview with multiple stocks
    async getMarketOverview() {
        const symbols = ['SPY', 'QQQ', 'AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];
        const stocks = {};
        const errors = [];

        console.log('📊 Fetching market overview for symbols:', symbols);

        // Fetch data for all symbols
        const promises = symbols.map(async (symbol) => {
            try {
                const data = await this.getStockData(symbol);
                stocks[symbol] = data;
                return { symbol, success: true, data };
            } catch (error) {
                console.error(`❌ Failed to fetch data for ${symbol}:`, error.message);
                errors.push({ symbol, error: error.message });
                return { symbol, success: false, error: error.message };
            }
        });

        await Promise.allSettled(promises);

        if (Object.keys(stocks).length === 0) {
            throw new Error('Failed to fetch data for any symbols');
        }

        // Calculate market sentiment
        const validStocks = Object.values(stocks).filter(stock => stock.changePercent !== undefined);
        const totalChange = validStocks.reduce((sum, stock) => sum + stock.changePercent, 0);
        const avgChange = totalChange / validStocks.length;

        console.log(`✅ Successfully fetched data for ${Object.keys(stocks).length}/${symbols.length} symbols`);

        return {
            stocks,
            marketSentiment: avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral',
            avgChange: parseFloat(avgChange.toFixed(2)),
            successCount: Object.keys(stocks).length,
            errorCount: errors.length,
            errors: errors.length > 0 ? errors : undefined,
            timestamp: Date.now()
        };
    }

    // Get options flow data
    async getOptionsFlowData() {
        try {
            console.log('📈 Fetching options flow data from Unusual Whales...');
            const data = await this.getUnusualWhalesOptionsFlow();
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch options flow data:', error.message);
            throw error;
        }
    }

    // Get technical indicators
    async getTechnicalIndicators(symbol) {
        try {
            const data = await this.getAlphaVantageData(symbol, 'RSI');
            return data;
        } catch (error) {
            console.error(`❌ Failed to fetch technical indicators for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Health check for all APIs
    async healthCheck() {
        const services = [
            { name: 'Polygon', check: () => this.getPolygonStockPrice('AAPL') },
            { name: 'Twelve Data', check: () => this.getTwelveDataQuote('AAPL') },
            { name: 'FMP', check: () => this.getFMPQuote('AAPL') },
            { name: 'Alpha Vantage', check: () => this.getAlphaVantageData('AAPL') }
        ];

        const results = {};

        for (const service of services) {
            try {
                await service.check();
                results[service.name] = { status: 'OK', timestamp: Date.now() };
                console.log(`✅ ${service.name} API: OK`);
            } catch (error) {
                results[service.name] = { 
                    status: 'ERROR', 
                    error: error.message, 
                    timestamp: Date.now() 
                };
                console.log(`❌ ${service.name} API: ERROR - ${error.message}`);
            }
        }

        return results;
    }
}

export default new RealDataService();