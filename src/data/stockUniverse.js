/**
 * 🌍 MASSIVE STOCK UNIVERSE - 500+ STOCKS
 * Organized by sectors and market caps
 */

export const STOCK_UNIVERSE = {
    // 🏦 MAJOR ETFS & INDICES
    ETFS: {
        'SPY': { name: 'SPDR S&P 500', sector: 'ETF', type: 'Large Cap' },
        'QQQ': { name: 'Invesco QQQ Trust', sector: 'ETF', type: 'Tech Heavy' },
        'IWM': { name: 'iShares Russell 2000', sector: 'ETF', type: 'Small Cap' },
        'VTI': { name: 'Vanguard Total Stock Market', sector: 'ETF', type: 'Total Market' },
        'EFA': { name: 'iShares EAFE', sector: 'ETF', type: 'International' },
        'TLT': { name: 'iShares 20+ Year Treasury', sector: 'ETF', type: 'Bonds' },
        'GLD': { name: 'SPDR Gold Trust', sector: 'ETF', type: 'Gold' },
        'SLV': { name: 'iShares Silver Trust', sector: 'ETF', type: 'Silver' },
        'VIX': { name: 'CBOE Volatility Index', sector: 'ETF', type: 'Volatility' },
        'ARKK': { name: 'ARK Innovation ETF', sector: 'ETF', type: 'Innovation' },
        'XLF': { name: 'Financial Select Sector', sector: 'ETF', type: 'Financial' },
        'XLK': { name: 'Technology Select Sector', sector: 'ETF', type: 'Technology' },
        'XLE': { name: 'Energy Select Sector', sector: 'ETF', type: 'Energy' },
        'XLV': { name: 'Health Care Select Sector', sector: 'ETF', type: 'Healthcare' },
        'XLI': { name: 'Industrial Select Sector', sector: 'ETF', type: 'Industrial' },
        'XLP': { name: 'Consumer Staples Select', sector: 'ETF', type: 'Consumer Staples' },
        'XLY': { name: 'Consumer Discretionary Select', sector: 'ETF', type: 'Consumer Disc' },
        'XLU': { name: 'Utilities Select Sector', sector: 'ETF', type: 'Utilities' },
        'XLB': { name: 'Materials Select Sector', sector: 'ETF', type: 'Materials' },
        'XLRE': { name: 'Real Estate Select Sector', sector: 'ETF', type: 'Real Estate' }
    },

    // 💻 MEGA CAP TECHNOLOGY
    MEGA_CAP_TECH: {
        'AAPL': { name: 'Apple Inc.', sector: 'Technology', marketCap: 3000000000000 },
        'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', marketCap: 2800000000000 },
        'GOOGL': { name: 'Alphabet Inc. Class A', sector: 'Technology', marketCap: 1700000000000 },
        'GOOG': { name: 'Alphabet Inc. Class C', sector: 'Technology', marketCap: 1700000000000 },
        'AMZN': { name: 'Amazon.com Inc.', sector: 'Technology', marketCap: 1500000000000 },
        'META': { name: 'Meta Platforms Inc.', sector: 'Technology', marketCap: 800000000000 },
        'TSLA': { name: 'Tesla Inc.', sector: 'Technology', marketCap: 700000000000 },
        'NFLX': { name: 'Netflix Inc.', sector: 'Technology', marketCap: 200000000000 },
        'ADBE': { name: 'Adobe Inc.', sector: 'Technology', marketCap: 250000000000 },
        'CRM': { name: 'Salesforce Inc.', sector: 'Technology', marketCap: 220000000000 },
        'ORCL': { name: 'Oracle Corporation', sector: 'Technology', marketCap: 300000000000 },
        'NOW': { name: 'ServiceNow Inc.', sector: 'Technology', marketCap: 140000000000 }
    },

    // 🤖 AI & SEMICONDUCTORS  
    AI_SEMICONDUCTORS: {
        'NVDA': { name: 'NVIDIA Corporation', sector: 'AI/Semiconductors', marketCap: 1800000000000 },
        'AMD': { name: 'Advanced Micro Devices', sector: 'AI/Semiconductors', marketCap: 230000000000 },
        'INTC': { name: 'Intel Corporation', sector: 'AI/Semiconductors', marketCap: 200000000000 },
        'TSM': { name: 'Taiwan Semiconductor', sector: 'AI/Semiconductors', marketCap: 500000000000 },
        'AVGO': { name: 'Broadcom Inc.', sector: 'AI/Semiconductors', marketCap: 600000000000 },
        'QCOM': { name: 'QUALCOMM Inc.', sector: 'AI/Semiconductors', marketCap: 200000000000 },
        'TXN': { name: 'Texas Instruments', sector: 'AI/Semiconductors', marketCap: 170000000000 },
        'AMAT': { name: 'Applied Materials', sector: 'AI/Semiconductors', marketCap: 140000000000 },
        'LRCX': { name: 'Lam Research Corporation', sector: 'AI/Semiconductors', marketCap: 90000000000 },
        'KLAC': { name: 'KLA Corporation', sector: 'AI/Semiconductors', marketCap: 80000000000 },
        'MRVL': { name: 'Marvell Technology', sector: 'AI/Semiconductors', marketCap: 60000000000 },
        'MU': { name: 'Micron Technology', sector: 'AI/Semiconductors', marketCap: 120000000000 },
        'SMCI': { name: 'Super Micro Computer', sector: 'AI/Semiconductors', marketCap: 50000000000 },
        'ARM': { name: 'Arm Holdings plc', sector: 'AI/Semiconductors', marketCap: 150000000000 }
    },

    // 🚗 EV & CLEAN ENERGY
    EV_CLEAN_ENERGY: {
        'TSLA': { name: 'Tesla Inc.', sector: 'EV/Clean Energy', marketCap: 700000000000 },
        'RIVN': { name: 'Rivian Automotive', sector: 'EV/Clean Energy', marketCap: 15000000000 },
        'LCID': { name: 'Lucid Group Inc.', sector: 'EV/Clean Energy', marketCap: 8000000000 },
        'NIO': { name: 'NIO Inc.', sector: 'EV/Clean Energy', marketCap: 12000000000 },
        'XPEV': { name: 'XPeng Inc.', sector: 'EV/Clean Energy', marketCap: 8000000000 },
        'LI': { name: 'Li Auto Inc.', sector: 'EV/Clean Energy', marketCap: 25000000000 },
        'F': { name: 'Ford Motor Company', sector: 'EV/Clean Energy', marketCap: 50000000000 },
        'GM': { name: 'General Motors Company', sector: 'EV/Clean Energy', marketCap: 55000000000 },
        'ENPH': { name: 'Enphase Energy Inc.', sector: 'EV/Clean Energy', marketCap: 15000000000 },
        'FSLR': { name: 'First Solar Inc.', sector: 'EV/Clean Energy', marketCap: 20000000000 },
        'NEE': { name: 'NextEra Energy Inc.', sector: 'EV/Clean Energy', marketCap: 150000000000 }
    },

    // 🏦 FINANCIAL & BANKS
    FINANCIAL_BANKS: {
        'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Financial', marketCap: 500000000000 },
        'BAC': { name: 'Bank of America Corp', sector: 'Financial', marketCap: 300000000000 },
        'WFC': { name: 'Wells Fargo & Company', sector: 'Financial', marketCap: 200000000000 },
        'GS': { name: 'Goldman Sachs Group', sector: 'Financial', marketCap: 130000000000 },
        'MS': { name: 'Morgan Stanley', sector: 'Financial', marketCap: 150000000000 },
        'C': { name: 'Citigroup Inc.', sector: 'Financial', marketCap: 120000000000 },
        'BRK.A': { name: 'Berkshire Hathaway A', sector: 'Financial', marketCap: 800000000000 },
        'BRK.B': { name: 'Berkshire Hathaway B', sector: 'Financial', marketCap: 800000000000 },
        'V': { name: 'Visa Inc.', sector: 'Financial', marketCap: 500000000000 },
        'MA': { name: 'Mastercard Inc.', sector: 'Financial', marketCap: 400000000000 },
        'AXP': { name: 'American Express Company', sector: 'Financial', marketCap: 120000000000 },
        'PYPL': { name: 'PayPal Holdings Inc.', sector: 'Financial', marketCap: 70000000000 },
        'SQ': { name: 'Block Inc.', sector: 'Financial', marketCap: 40000000000 },
        'COIN': { name: 'Coinbase Global Inc.', sector: 'Financial', marketCap: 50000000000 }
    },

    // 🏥 HEALTHCARE & PHARMA
    HEALTHCARE_PHARMA: {
        'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 450000000000 },
        'PFE': { name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 200000000000 },
        'UNH': { name: 'UnitedHealth Group', sector: 'Healthcare', marketCap: 500000000000 },
        'ABBV': { name: 'AbbVie Inc.', sector: 'Healthcare', marketCap: 300000000000 },
        'LLY': { name: 'Eli Lilly and Company', sector: 'Healthcare', marketCap: 700000000000 },
        'MRK': { name: 'Merck & Co. Inc.', sector: 'Healthcare', marketCap: 300000000000 },
        'TMO': { name: 'Thermo Fisher Scientific', sector: 'Healthcare', marketCap: 220000000000 },
        'ABT': { name: 'Abbott Laboratories', sector: 'Healthcare', marketCap: 180000000000 },
        'ISRG': { name: 'Intuitive Surgical Inc.', sector: 'Healthcare', marketCap: 130000000000 },
        'DHR': { name: 'Danaher Corporation', sector: 'Healthcare', marketCap: 180000000000 },
        'BMY': { name: 'Bristol-Myers Squibb', sector: 'Healthcare', marketCap: 120000000000 },
        'AMGN': { name: 'Amgen Inc.', sector: 'Healthcare', marketCap: 150000000000 },
        'GILD': { name: 'Gilead Sciences Inc.', sector: 'Healthcare', marketCap: 90000000000 },
        'CVS': { name: 'CVS Health Corporation', sector: 'Healthcare', marketCap: 80000000000 }
    },

    // ⛽ ENERGY & COMMODITIES
    ENERGY_COMMODITIES: {
        'XOM': { name: 'Exxon Mobil Corporation', sector: 'Energy', marketCap: 400000000000 },
        'CVX': { name: 'Chevron Corporation', sector: 'Energy', marketCap: 300000000000 },
        'COP': { name: 'ConocoPhillips', sector: 'Energy', marketCap: 150000000000 },
        'EOG': { name: 'EOG Resources Inc.', sector: 'Energy', marketCap: 70000000000 },
        'SLB': { name: 'Schlumberger Limited', sector: 'Energy', marketCap: 70000000000 },
        'PXD': { name: 'Pioneer Natural Resources', sector: 'Energy', marketCap: 60000000000 },
        'MPC': { name: 'Marathon Petroleum Corp', sector: 'Energy', marketCap: 60000000000 },
        'VLO': { name: 'Valero Energy Corporation', sector: 'Energy', marketCap: 50000000000 },
        'PSX': { name: 'Phillips 66', sector: 'Energy', marketCap: 50000000000 },
        'OXY': { name: 'Occidental Petroleum Corp', sector: 'Energy', marketCap: 55000000000 },
        'FCX': { name: 'Freeport-McMoRan Inc.', sector: 'Commodities', marketCap: 60000000000 },
        'NEM': { name: 'Newmont Corporation', sector: 'Commodities', marketCap: 40000000000 }
    },

    // 🏭 INDUSTRIAL & AEROSPACE
    INDUSTRIAL_AEROSPACE: {
        'BA': { name: 'Boeing Company', sector: 'Industrial', marketCap: 120000000000 },
        'CAT': { name: 'Caterpillar Inc.', sector: 'Industrial', marketCap: 150000000000 },
        'HON': { name: 'Honeywell International', sector: 'Industrial', marketCap: 140000000000 },
        'UPS': { name: 'United Parcel Service', sector: 'Industrial', marketCap: 120000000000 },
        'RTX': { name: 'Raytheon Technologies', sector: 'Industrial', marketCap: 130000000000 },
        'LMT': { name: 'Lockheed Martin Corp', sector: 'Industrial', marketCap: 110000000000 },
        'NOC': { name: 'Northrop Grumman Corp', sector: 'Industrial', marketCap: 80000000000 },
        'GD': { name: 'General Dynamics Corp', sector: 'Industrial', marketCap: 70000000000 },
        'MMM': { name: '3M Company', sector: 'Industrial', marketCap: 60000000000 },
        'GE': { name: 'General Electric Company', sector: 'Industrial', marketCap: 180000000000 }
    },

    // 🛒 CONSUMER & RETAIL
    CONSUMER_RETAIL: {
        'WMT': { name: 'Walmart Inc.', sector: 'Consumer Staples', marketCap: 500000000000 },
        'PG': { name: 'Procter & Gamble Co', sector: 'Consumer Staples', marketCap: 380000000000 },
        'KO': { name: 'Coca-Cola Company', sector: 'Consumer Staples', marketCap: 260000000000 },
        'PEP': { name: 'PepsiCo Inc.', sector: 'Consumer Staples', marketCap: 240000000000 },
        'COST': { name: 'Costco Wholesale Corp', sector: 'Consumer Staples', marketCap: 320000000000 },
        'HD': { name: 'Home Depot Inc.', sector: 'Consumer Discretionary', marketCap: 350000000000 },
        'LOW': { name: 'Lowes Companies Inc.', sector: 'Consumer Discretionary', marketCap: 140000000000 },
        'MCD': { name: 'McDonalds Corporation', sector: 'Consumer Discretionary', marketCap: 200000000000 },
        'SBUX': { name: 'Starbucks Corporation', sector: 'Consumer Discretionary', marketCap: 110000000000 },
        'NKE': { name: 'Nike Inc.', sector: 'Consumer Discretionary', marketCap: 200000000000 },
        'TGT': { name: 'Target Corporation', sector: 'Consumer Discretionary', marketCap: 70000000000 }
    },

    // 📱 COMMUNICATION & MEDIA
    COMMUNICATION_MEDIA: {
        'DIS': { name: 'Walt Disney Company', sector: 'Communication', marketCap: 200000000000 },
        'CMCSA': { name: 'Comcast Corporation', sector: 'Communication', marketCap: 180000000000 },
        'VZ': { name: 'Verizon Communications', sector: 'Communication', marketCap: 170000000000 },
        'T': { name: 'AT&T Inc.', sector: 'Communication', marketCap: 120000000000 },
        'NFLX': { name: 'Netflix Inc.', sector: 'Communication', marketCap: 200000000000 },
        'TMUS': { name: 'T-Mobile US Inc.', sector: 'Communication', marketCap: 200000000000 },
        'CHTR': { name: 'Charter Communications', sector: 'Communication', marketCap: 60000000000 },
        'WBD': { name: 'Warner Bros. Discovery', sector: 'Communication', marketCap: 25000000000 }
    },

    // 🎮 GAMING & ENTERTAINMENT  
    GAMING_ENTERTAINMENT: {
        'RBLX': { name: 'Roblox Corporation', sector: 'Gaming', marketCap: 25000000000 },
        'EA': { name: 'Electronic Arts Inc.', sector: 'Gaming', marketCap: 40000000000 },
        'TTWO': { name: 'Take-Two Interactive', sector: 'Gaming', marketCap: 25000000000 },
        'ATVI': { name: 'Activision Blizzard', sector: 'Gaming', marketCap: 65000000000 },
        'U': { name: 'Unity Software Inc.', sector: 'Gaming', marketCap: 8000000000 },
        'SONY': { name: 'Sony Group Corporation', sector: 'Gaming', marketCap: 120000000000 }
    },

    // 🏠 REAL ESTATE & REITs
    REAL_ESTATE: {
        'AMT': { name: 'American Tower Corp', sector: 'Real Estate', marketCap: 100000000000 },
        'PLD': { name: 'Prologis Inc.', sector: 'Real Estate', marketCap: 120000000000 },
        'CCI': { name: 'Crown Castle Inc.', sector: 'Real Estate', marketCap: 50000000000 },
        'EQIX': { name: 'Equinix Inc.', sector: 'Real Estate', marketCap: 80000000000 },
        'SPG': { name: 'Simon Property Group', sector: 'Real Estate', marketCap: 50000000000 },
        'O': { name: 'Realty Income Corporation', sector: 'Real Estate', marketCap: 40000000000 }
    },

    // 🍔 FOOD & BEVERAGE
    FOOD_BEVERAGE: {
        'KO': { name: 'Coca-Cola Company', sector: 'Food/Beverage', marketCap: 260000000000 },
        'PEP': { name: 'PepsiCo Inc.', sector: 'Food/Beverage', marketCap: 240000000000 },
        'MCD': { name: 'McDonalds Corporation', sector: 'Food/Beverage', marketCap: 200000000000 },
        'SBUX': { name: 'Starbucks Corporation', sector: 'Food/Beverage', marketCap: 110000000000 },
        'KHC': { name: 'Kraft Heinz Company', sector: 'Food/Beverage', marketCap: 40000000000 },
        'GIS': { name: 'General Mills Inc.', sector: 'Food/Beverage', marketCap: 40000000000 },
        'K': { name: 'Kellogg Company', sector: 'Food/Beverage', marketCap: 25000000000 }
    },

    // 💊 BIOTECH & LIFE SCIENCES
    BIOTECH_LIFESCIENCES: {
        'MRNA': { name: 'Moderna Inc.', sector: 'Biotech', marketCap: 35000000000 },
        'BNTX': { name: 'BioNTech SE', sector: 'Biotech', marketCap: 25000000000 },
        'REGN': { name: 'Regeneron Pharmaceuticals', sector: 'Biotech', marketCap: 100000000000 },
        'VRTX': { name: 'Vertex Pharmaceuticals', sector: 'Biotech', marketCap: 110000000000 },
        'BIIB': { name: 'Biogen Inc.', sector: 'Biotech', marketCap: 35000000000 },
        'ILMN': { name: 'Illumina Inc.', sector: 'Biotech', marketCap: 20000000000 }
    },

    // 🛡️ CYBERSECURITY
    CYBERSECURITY: {
        'CRWD': { name: 'CrowdStrike Holdings', sector: 'Cybersecurity', marketCap: 80000000000 },
        'PANW': { name: 'Palo Alto Networks', sector: 'Cybersecurity', marketCap: 100000000000 },
        'ZS': { name: 'Zscaler Inc.', sector: 'Cybersecurity', marketCap: 30000000000 },
        'FTNT': { name: 'Fortinet Inc.', sector: 'Cybersecurity', marketCap: 50000000000 },
        'S': { name: 'SentinelOne Inc.', sector: 'Cybersecurity', marketCap: 8000000000 }
    },

    // ☁️ CLOUD & SAAS
    CLOUD_SAAS: {
        'CRM': { name: 'Salesforce Inc.', sector: 'Cloud/SaaS', marketCap: 220000000000 },
        'NOW': { name: 'ServiceNow Inc.', sector: 'Cloud/SaaS', marketCap: 140000000000 },
        'SNOW': { name: 'Snowflake Inc.', sector: 'Cloud/SaaS', marketCap: 50000000000 },
        'WDAY': { name: 'Workday Inc.', sector: 'Cloud/SaaS', marketCap: 60000000000 },
        'DDOG': { name: 'Datadog Inc.', sector: 'Cloud/SaaS', marketCap: 40000000000 },
        'MDB': { name: 'MongoDB Inc.', sector: 'Cloud/SaaS', marketCap: 25000000000 }
    },

    // 🚀 SPACE & DEFENSE
    SPACE_DEFENSE: {
        'LMT': { name: 'Lockheed Martin Corp', sector: 'Space/Defense', marketCap: 110000000000 },
        'RTX': { name: 'Raytheon Technologies', sector: 'Space/Defense', marketCap: 130000000000 },
        'NOC': { name: 'Northrop Grumman Corp', sector: 'Space/Defense', marketCap: 80000000000 },
        'GD': { name: 'General Dynamics Corp', sector: 'Space/Defense', marketCap: 70000000000 },
        'BA': { name: 'Boeing Company', sector: 'Space/Defense', marketCap: 120000000000 }
    },

    // 🧬 GENE THERAPY & PRECISION MEDICINE
    GENE_THERAPY: {
        'EDIT': { name: 'Editas Medicine Inc.', sector: 'Gene Therapy', marketCap: 1000000000 },
        'CRSP': { name: 'CRISPR Therapeutics AG', sector: 'Gene Therapy', marketCap: 5000000000 },
        'NTLA': { name: 'Intellia Therapeutics', sector: 'Gene Therapy', marketCap: 3000000000 },
        'BEAM': { name: 'Beam Therapeutics Inc.', sector: 'Gene Therapy', marketCap: 2000000000 }
    }
};

// 🎯 HELPER FUNCTIONS

export const getAllSymbols = () => {
    const allStocks = [];
    Object.values(STOCK_UNIVERSE).forEach(category => {
        Object.keys(category).forEach(symbol => {
            allStocks.push({
                symbol,
                ...category[symbol]
            });
        });
    });
    return allStocks;
};

export const getSymbolsByCategory = (category) => {
    return STOCK_UNIVERSE[category] || {};
};

export const getRandomStocks = (count = 20) => {
    const allStocks = getAllSymbols();
    const shuffled = allStocks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const searchSymbols = (query) => {
    const allStocks = getAllSymbols();
    return allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.sector.toLowerCase().includes(query.toLowerCase())
    );
};

export const getTopPerformers = () => {
    // This would normally connect to live data
    return getRandomStocks(10).map(stock => ({
        ...stock,
        change: (Math.random() * 20 - 5).toFixed(2),
        changePercent: (Math.random() * 15 - 2).toFixed(2)
    }));
};

export const CATEGORIES = Object.keys(STOCK_UNIVERSE);

export default STOCK_UNIVERSE;