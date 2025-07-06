import React from 'react';

const StoreOwnerSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      id: 'stores',
      label: 'Stores',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    // {
    //   id: 'test-connection',
    //   label: 'Test Connection',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    //     </svg>
    //   )
    // }
  ];

  return (
    <nav className="h-full bg-gradient-to-b from-slate-900 via-gray-800 to-slate-900 text-white">
      {/* Header */}
      {/* <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Store Owner Portal
            </h2>
            <p className="text-xs text-gray-400">Store Management</p>
          </div>
        </div>
      </div> */}

      {/* Navigation Menu */}
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className={`transition-colors duration-200 ${
                    activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Stats */}
        {/* <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Store Stats
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Active Stores</span>
              <span className="text-sm font-semibold text-green-400">3 Stores</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Products</span>
              <span className="text-sm font-semibold text-blue-400">12 Items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">News Published</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-400">5 Posts</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Section */}
      {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Store Owner</p>
            <p className="text-xs text-gray-400">Business Manager</p>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-800 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div> */}
    </nav>
  );
};

export default StoreOwnerSidebar; 