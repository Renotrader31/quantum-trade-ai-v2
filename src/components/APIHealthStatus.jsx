import React, { useState, useEffect } from 'react';
import realDataService from '../services/realDataService';

const APIHealthStatus = ({ compact = false }) => {
    const [healthStatus, setHealthStatus] = useState({});
    const [isChecking, setIsChecking] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    const checkAPIHealth = async () => {
        setIsChecking(true);
        try {
            console.log('🔍 Running API health check...');
            const status = await realDataService.healthCheck();
            setHealthStatus(status);
            setLastCheck(new Date());
            console.log('✅ API health check completed');
        } catch (error) {
            console.error('❌ Health check failed:', error);
        }
        setIsChecking(false);
    };

    useEffect(() => {
        // Run initial health check
        checkAPIHealth();
        
        // Set up periodic health checks every 5 minutes
        const interval = setInterval(checkAPIHealth, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OK':
                return 'bg-green-500';
            case 'ERROR':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'OK':
                return '✅';
            case 'ERROR':
                return '❌';
            default:
                return '⏳';
        }
    };

    const apis = [
        { key: 'Polygon', name: 'Polygon', description: 'Stock prices & market data' },
        { key: 'Twelve Data', name: '12Data', description: 'Financial quotes' },
        { key: 'FMP', name: 'FMP', description: 'Financial modeling prep' },
        { key: 'Alpha Vantage', name: 'AlphaV', description: 'Technical indicators' }
    ];

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">APIs:</span>
                {apis.map(api => {
                    const status = healthStatus[api.key];
                    return (
                        <div 
                            key={api.key}
                            className="flex items-center gap-1"
                            title={`${api.name}: ${status?.status || 'Checking...'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(status?.status)}`}></div>
                            <span className="text-xs text-gray-400">{api.name}</span>
                        </div>
                    );
                })}
                {isChecking && (
                    <div className="animate-spin w-3 h-3 border border-blue-500 border-t-transparent rounded-full"></div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    🔧 API Health Status
                </h3>
                <button
                    onClick={checkAPIHealth}
                    disabled={isChecking}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    {isChecking ? (
                        <>
                            <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
                            Checking...
                        </>
                    ) : (
                        <>🔄 Check Now</>
                    )}
                </button>
            </div>

            {lastCheck && (
                <div className="text-sm text-gray-400 mb-4">
                    Last checked: {lastCheck.toLocaleString()}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apis.map(api => {
                    const status = healthStatus[api.key];
                    const isOK = status?.status === 'OK';
                    
                    return (
                        <div 
                            key={api.key}
                            className={`border rounded-lg p-4 ${
                                isOK ? 'border-green-500/20 bg-green-900/10' : 
                                status?.status === 'ERROR' ? 'border-red-500/20 bg-red-900/10' : 
                                'border-gray-700 bg-gray-800'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getStatusIcon(status?.status)}</span>
                                    <span className="font-semibold">{api.name}</span>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    isOK ? 'bg-green-600 text-white' : 
                                    status?.status === 'ERROR' ? 'bg-red-600 text-white' : 
                                    'bg-gray-600 text-gray-300'
                                }`}>
                                    {status?.status || 'PENDING'}
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-400 mb-1">
                                {api.description}
                            </div>
                            
                            {status?.error && (
                                <div className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded">
                                    {status.error}
                                </div>
                            )}
                            
                            {status?.timestamp && (
                                <div className="text-xs text-gray-500 mt-2">
                                    {new Date(status.timestamp).toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* API Key Status */}
            <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold mb-3">🔑 API Key Configuration</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { name: 'Polygon', configured: !!process.env.REACT_APP_POLYGON_API_KEY },
                        { name: 'FMP', configured: !!process.env.REACT_APP_FMP_API_KEY },
                        { name: 'Twelve Data', configured: !!process.env.REACT_APP_TWELVE_DATA_KEY },
                        { name: 'Alpha Vantage', configured: !!process.env.REACT_APP_ALPHA_VANTAGE_KEY },
                        { name: 'Unusual Whales', configured: !!process.env.REACT_APP_UNUSUAL_WHALES_API_KEY },
                        { name: 'Ortex', configured: !!process.env.REACT_APP_ORTEX_API_KEY }
                    ].map(api => (
                        <div 
                            key={api.name}
                            className={`flex items-center gap-2 px-3 py-2 rounded ${
                                api.configured ? 'bg-green-900/20 border border-green-500/20' : 'bg-red-900/20 border border-red-500/20'
                            }`}
                        >
                            <span className="text-sm">{api.configured ? '🟢' : '🔴'}</span>
                            <span className="text-sm">{api.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default APIHealthStatus;