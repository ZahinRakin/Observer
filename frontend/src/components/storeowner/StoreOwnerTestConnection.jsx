// import React, { useState, useContext } from 'react';
// import { UserContext } from '../../contexts/UserContext.jsx';
// import storeOwnerService from '../../services/storeOwnerService.js';

// const StoreOwnerTestConnection = () => {
//   const { user } = useContext(UserContext);
//   const [testResult, setTestResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleTestConnection = async () => {
//     setLoading(true);
//     try {
//       const result = await storeOwnerService.testConnection();
//       setTestResult(result);
//     } catch (error) {
//       setTestResult({
//         success: false,
//         message: 'Connection test failed',
//         error: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* User Information Debug */}
//       <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-semibold text-white text-lg">User Information</h3>
//             <p className="text-gray-400 text-sm">Current user details for debugging</p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="text-gray-400">User ID:</span>
//               <span className="text-white ml-2">{user?.id || 'undefined'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Username:</span>
//               <span className="text-white ml-2">{user?.username || 'undefined'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Email:</span>
//               <span className="text-white ml-2">{user?.email || 'undefined'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Role:</span>
//               <span className="text-white ml-2">{user?.role || 'undefined'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Account Type:</span>
//               <span className="text-white ml-2">{user?.account_type || 'undefined'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">User Object:</span>
//               <span className="text-white ml-2">{user ? 'Present' : 'null'}</span>
//             </div>
//           </div>
          
//           {user && (
//             <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
//               <div className="text-xs text-gray-300">
//                 <pre>{JSON.stringify(user, null, 2)}</pre>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Backend Connection Test */}
//       <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="font-semibold text-white text-lg">Backend Connection Test</h3>
//             <p className="text-gray-400 text-sm">Test your connection to the store owner backend</p>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <button
//             onClick={handleTestConnection}
//             disabled={loading}
//             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Testing...
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//                 Test Connection
//               </>
//             )}
//           </button>

//           {testResult && (
//             <div className={`p-4 rounded-lg border ${
//               testResult.success 
//                 ? 'bg-green-900/50 border-green-700' 
//                 : 'bg-red-900/50 border-red-700'
//             }`}>
//               <div className="flex items-center gap-2 mb-2">
//                 <div className={`w-3 h-3 rounded-full ${
//                   testResult.success ? 'bg-green-400' : 'bg-red-400'
//                 }`}></div>
//                 <span className={`font-medium ${
//                   testResult.success ? 'text-green-300' : 'text-red-300'
//                 }`}>
//                   {testResult.success ? 'Success' : 'Failed'}
//                 </span>
//               </div>
//               <p className={`text-sm ${
//                 testResult.success ? 'text-green-200' : 'text-red-200'
//               }`}>
//                 {testResult.message}
//               </p>
//               {testResult.error && (
//                 <p className="text-xs text-red-300 mt-2">
//                   Error: {testResult.error}
//                 </p>
//               )}
//               {testResult.data && (
//                 <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-300">
//                   <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="text-xs text-gray-400 space-y-1">
//             <p>• Tests connection to backend API</p>
//             <p>• Verifies authentication setup</p>
//             <p>• Checks API endpoint availability</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreOwnerTestConnection; 