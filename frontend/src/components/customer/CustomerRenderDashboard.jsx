import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';

const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

const formatTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const RenderDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    subscribedProducts: 0,
    unreadNews: 0,
    totalNews: 0,
    lastActivity: null
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - replace with actual API calls
        setStats({
          subscribedProducts: 3,
          unreadNews: 5,
          totalNews: 12,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        });

        setRecentNews([
          {
            id: 1,
            title: 'New Product Launch',
            product: 'Premium Smartwatch',
            time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            isRead: false
          },
          {
            id: 2,
            title: 'Summer Sale Announcement',
            product: 'Wireless Earbuds',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            isRead: false
          },
          {
            id: 3,
            title: 'Product Update Available',
            product: 'Smart Home Hub',
            time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            isRead: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.username || 'Customer'}! 👋
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Stay updated with your favorite products and latest news
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Last active: {formatTime(stats.lastActivity)}</span>
              <span>•</span>
              <span>Member since {formatDate(user?.created_at || new Date('2024-01-01'))}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscribed Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.subscribedProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread News</p>
              <p className="text-3xl font-bold text-gray-900">{stats.unreadNews}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total News</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent News</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentNews.map((news) => (
              <div key={news.id} className={`p-4 rounded-lg border ${news.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${news.isRead ? 'text-gray-700' : 'text-blue-800'}`}>
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{news.product}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(news.time)} • {news.isRead ? 'Read' : 'Unread'}
                    </p>
                  </div>
                  {!news.isRead && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">View News</span>
              </div>
            </button>

            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm font-medium text-green-800">My Products</span>
              </div>
            </button>

            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-purple-800">Settings</span>
              </div>
            </button>

            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-orange-800">Help</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Subscribed to <span className="font-medium">Premium Smartwatch</span></p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Read news about <span className="font-medium">Summer Sale</span></p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Unsubscribed from <span className="font-medium">Old Product</span></p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pro Tip</h3>
            <p className="text-gray-700">
              Enable notifications to stay updated with the latest news and product updates from your subscribed stores. 
              You can manage your notification preferences in the settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderDashboard;