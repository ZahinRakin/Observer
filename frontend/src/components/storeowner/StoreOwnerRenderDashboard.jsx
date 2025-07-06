import React, { useState, useEffect } from 'react';
import storeOwnerService from '../../services/storeOwnerService.js';

const StoreOwnerRenderDashboard = ({ user }) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id) {
        setLoading(false);
        setError('User ID not found. Please log in again.');
        return;
      }

      try {
        setLoading(true);
        const stats = await storeOwnerService.getDashboardStats(user.id);
        setDashboardStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics: ' + (err.response?.data?.detail || err.message));
        // Use fallback data if API fails
        setDashboardStats({
          total_stores: 3,
          total_products: 12,
          total_news: 5,
          stores_this_month: 1,
          products_this_week: 3,
          news_this_week: 2,
          business_status: "active",
          stores_managed: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user?.id]);

  // Use fallback data if stats are not loaded
  const stats = dashboardStats || {
    total_stores: 3,
    total_products: 12,
    total_news: 5,
    stores_this_month: 1,
    products_this_week: 3,
    news_this_week: 2,
    business_status: "active",
    stores_managed: 3
  };

  if (loading) {
    return (
      <div className="p-6 w-full flex flex-col gap-8">
        <div className="animate-pulse">
          <div className="bg-gray-700/50 rounded-2xl h-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-700/50 rounded-xl h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-700/50 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-2xl shadow-lg border border-gray-700/50 p-8 backdrop-blur-sm">
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3 drop-shadow">
            Welcome, {user?.username || 'Store Owner'}!
          </h2>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            Here's a comprehensive overview of your business performance and recent activity across all your stores.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${stats.business_status === 'active' ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`}></div>
              <span className="text-sm text-gray-300">Business {stats.business_status}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-300">{stats.stores_managed} Stores Managed</span>
            </div>
          </div>
          {/* Debug section - remove in production */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
            <div className="text-xs text-gray-400 space-y-1">
              <div>User ID: {user?.id || 'undefined'}</div>
              {/* <div>User Role: {user?.role || 'undefined'}</div> */}
              <div>Account Type: {user?.account_type || 'undefined'}</div>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {/* Store Illustration */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-gray-600/50">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="url(#gradient)" stroke="#374151" strokeWidth="2"/>
                <rect x="25" y="40" width="50" height="30" rx="6" fill="#10B981"/>
                <rect x="35" y="55" width="30" height="15" rx="3" fill="#3B82F6"/>
                <rect x="40" y="45" width="20" height="10" rx="2" fill="#F59E0B"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 flex flex-col items-center backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2">{stats.total_stores}</span>
          <span className="text-gray-300 font-medium">Active Stores</span>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-400">+{stats.stores_this_month} this month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 flex flex-col items-center backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">{stats.total_products}</span>
          <span className="text-gray-300 font-medium">Total Products</span>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-gray-400">+{stats.products_this_week} this week</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 flex flex-col items-center backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2">{stats.total_news}</span>
          <span className="text-gray-300 font-medium">News Published</span>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-xs text-gray-400">+{stats.news_this_week} this week</span>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Sales Trend</h3>
              <p className="text-gray-400 text-sm">Monthly revenue overview</p>
            </div>
          </div>
          <div className="w-full h-40 flex items-end gap-2 mb-4">
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-12" />
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-24" />
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-16" />
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-32" />
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-20" />
            <div className="bg-gradient-to-t from-green-600 to-green-400 rounded w-6 h-28" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">(Demo data)</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-300">+15% vs last month</span>
            </div>
          </div>
        </div>
        
        {/* Customer Growth Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Customer Growth</h3>
              <p className="text-gray-400 text-sm">New customer acquisition</p>
            </div>
          </div>
          <div className="w-full h-40 flex items-end gap-2 mb-4">
            <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,70 40,60 80,50 120,30 160,40 200,20" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="0" cy="70" r="3" fill="#3B82F6" />
              <circle cx="40" cy="60" r="3" fill="#3B82F6" />
              <circle cx="80" cy="50" r="3" fill="#3B82F6" />
              <circle cx="120" cy="30" r="3" fill="#3B82F6" />
              <circle cx="160" cy="40" r="3" fill="#3B82F6" />
              <circle cx="200" cy="20" r="3" fill="#3B82F6" />
            </svg>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">(Demo data)</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-300">+8% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      {/* <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/50">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Add New Store</div>
              <div className="text-xs text-gray-400">Create a new business location</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Add Product</div>
              <div className="text-xs text-gray-400">List a new product</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Publish News</div>
              <div className="text-xs text-gray-400">Share business updates</div>
            </div>
          </button>
        </div>
      </div> */}

      {/* Business Overview Illustration */}
      <div className="flex flex-col items-center mt-8">
        <div className="relative">
          <div className="w-48 h-32 bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl border border-gray-700/50 flex items-center justify-center">
            <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="90" cy="90" rx="80" ry="10" fill="url(#shadow)" />
              <rect x="60" y="40" width="60" height="40" rx="8" fill="#F59E0B"/>
              <rect x="80" y="60" width="20" height="20" rx="4" fill="#3B82F6"/>
              <circle cx="90" cy="60" r="6" fill="#10B981"/>
              <defs>
                <linearGradient id="shadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#374151" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="text-gray-400 mt-4 text-center">
          <div className="font-medium text-white">Your Business at a Glance</div>
          <div className="text-sm">Comprehensive overview of all your stores and operations</div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerRenderDashboard; 