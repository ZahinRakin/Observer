import React, { useState, useEffect } from 'react';
import { dashboardService, handleAPIError } from '../../services/adminService.js';

const AdminRenderDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStores: 0,
    totalProducts: 0,
    // recentActivity: []
  });
  // const [systemHealth, setSystemHealth] = useState({
  //   status: 'loading',
  //   uptime: '--',
  //   apiResponseTime: '--',
  //   database: '--',
  //   services: {}
  // });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats and system health in parallel
        const [statsData, healthData] = await Promise.all([
          dashboardService.getStats(),
          // systemService.getHealth()
        ]);

        setStats(statsData);
        // setSystemHealth(healthData);
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'operational':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'operational':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'error':
      case 'down':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 border border-red-700/50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-red-400 text-xl">⚠️</div>
            <div>
              <h3 className="text-red-300 font-semibold">Error Loading Dashboard</h3>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">Admin Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-4 rounded-lg border border-blue-700/30">
            <h3 className="text-lg font-semibold text-blue-300">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-blue-300">+12% from last month</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-4 rounded-lg border border-green-700/30">
            <h3 className="text-lg font-semibold text-green-300">Active Stores</h3>
            <p className="text-3xl font-bold text-green-400">{stats.activeStores.toLocaleString()}</p>
            <p className="text-sm text-green-300">+5% from last month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
            <h3 className="text-lg font-semibold text-purple-300">Total Products</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.totalProducts.toLocaleString()}</p>
            <p className="text-sm text-purple-300">+8% from last month</p>
          </div>
        </div>
        
        {/* System Health & Recent Activity */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          {/* System Health */}
          {/* <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Overall Status</span>
                <div className="flex items-center gap-2">
                  <span className={getStatusColor(systemHealth.status)}>{getStatusIcon(systemHealth.status)}</span>
                  <span className={`text-sm font-medium ${getStatusColor(systemHealth.status)}`}>
                    {systemHealth.status || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Uptime</span>
                <span className="text-sm text-gray-200">{systemHealth.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">API Response</span>
                <span className="text-sm text-gray-200">{systemHealth.apiResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Database</span>
                <div className="flex items-center gap-2">
                  <span className={getStatusColor(systemHealth.database)}>{getStatusIcon(systemHealth.database)}</span>
                  <span className={`text-sm ${getStatusColor(systemHealth.database)}`}>
                    {systemHealth.database || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Recent Activity */}
          {/* <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Recent Activity</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'warning' ? 'bg-yellow-400' :
                      activity.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="text-gray-300 flex-1">{activity.message}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No recent activity</div>
              )}
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="mt-6 bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium">
              View All Users
            </button>
            <button className="w-full text-left px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium">
              Manage Stores
            </button>
            <button className="w-full text-left px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-medium">
              System Settings
            </button>
          </div>
        </div> */}
      </div>
      
      {/* Current Session Info */}
      {user && (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">Logged in as: <span className="font-semibold text-white">{user.username}</span></p>
              <p className="text-gray-300">Role: <span className="font-semibold text-white">{user.role || user.account_type}</span></p>
            </div>
            {/* <div>
              <p className="text-gray-300">Session ID: <span className="font-mono text-sm text-gray-400">{user.id || 'N/A'}</span></p>
              <p className="text-gray-300">Last Login: <span className="text-sm text-gray-400">
                {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
              </span></p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRenderDashboard; 