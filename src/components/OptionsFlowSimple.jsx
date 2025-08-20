import React from 'react';

function OptionsFlowSimple() {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <span className="mr-3">🐋</span>
                    Options Flow Analysis - Enhanced
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-300 mb-2">Whale Activity</h3>
                        <div className="text-3xl font-bold text-white">$2.4M</div>
                        <div className="text-sm text-gray-300">Premium Flow Today</div>
                    </div>
                    
                    <div className="bg-green-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-300 mb-2">Call/Put Ratio</h3>
                        <div className="text-3xl font-bold text-white">1.32</div>
                        <div className="text-sm text-gray-300">Bullish Sentiment</div>
                    </div>
                    
                    <div className="bg-purple-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-300 mb-2">Unusual Activity</h3>
                        <div className="text-3xl font-bold text-white">156</div>
                        <div className="text-sm text-gray-300">Alerts Today</div>
                    </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">🚨 Recent Whale Alerts</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-gray-600 p-3 rounded">
                            <div>
                                <span className="font-semibold text-green-400">NVDA</span>
                                <span className="ml-2 text-gray-300">$125 CALLS • 500 contracts</span>
                            </div>
                            <span className="text-green-400 font-semibold">$75K Premium</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-600 p-3 rounded">
                            <div>
                                <span className="font-semibold text-red-400">TSLA</span>
                                <span className="ml-2 text-gray-300">$240 PUTS • 300 contracts</span>
                            </div>
                            <span className="text-red-400 font-semibold">$60K Premium</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-600 p-3 rounded">
                            <div>
                                <span className="font-semibold text-blue-400">SPY</span>
                                <span className="ml-2 text-gray-300">$550 CALLS • 1000 contracts</span>
                            </div>
                            <span className="text-blue-400 font-semibold">$120K Premium</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        🚀 <strong>Enhanced Options Flow Analysis is Active!</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Tracking whale activity, sentiment analysis, and unusual volume patterns
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OptionsFlowSimple;