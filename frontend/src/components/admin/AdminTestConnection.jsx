import React, { useState } from 'react';
import { dashboardService, handleAPIError } from '../../services/adminService.js';

const AdminTestConnection = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults({});

    const tests = [
      {
        name: 'Dashboard Stats',
        test: async () => {
          try {
            const result = await dashboardService.getStats();
            return { success: true, data: result };
          } catch (error) {
            return { success: false, error: handleAPIError(error) };
          }
        }
      },
      // {
      //   name: 'System Settings',
      //   test: async () => {
      //     try {
      //       const result = await settingsService.getSettings();
      //       return { success: true, data: result };
      //     } catch (error) {
      //       return { success: false, error: handleAPIError(error) };
      //     }
      //   }
      // },
      // {
      //   name: 'System Health',
      //   test: async () => {
      //     try {
      //       const result = await systemService.getHealth();
      //       return { success: true, data: result };
      //     } catch (error) {
      //       return { success: false, error: handleAPIError(error) };
      //     }
      //   }
      // }
    ];

    const results = {};
    
    for (const test of tests) {
      console.log(`Running test: ${test.name}`);
      const result = await test.test();
      results[test.name] = result;
      setTestResults(prev => ({ ...prev, [test.name]: result }));
    }

    setLoading(false);
    console.log('All test results:', results);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">API Connection Test</h2>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 mb-6"
        >
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </button>

        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-900/20 border-green-700/50' 
                : 'bg-red-900/20 border-red-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${
                  result.success ? 'text-green-300' : 'text-red-300'
                }`}>
                  {testName}
                </h3>
                <span className={`text-xl ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.success ? '✅' : '❌'}
                </span>
              </div>
              
              {result.success ? (
                <div className="mt-2">
                  <p className="text-green-400 text-sm">Success!</p>
                  <details className="mt-2">
                    <summary className="text-green-300 text-sm cursor-pointer">View Response</summary>
                    <pre className="mt-2 text-xs text-green-400 bg-green-900/30 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-red-400 text-sm">Error: {result.error.message}</p>
                  <details className="mt-2">
                    <summary className="text-red-300 text-sm cursor-pointer">View Error Details</summary>
                    <pre className="mt-2 text-xs text-red-400 bg-red-900/30 p-2 rounded overflow-auto">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(testResults).length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <p>Click "Run API Tests" to test the backend connection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestConnection; 