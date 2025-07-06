import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';
import LoadingAnimation from '../Loading.jsx';
import axios from 'axios';

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
  console.log('🔍 DEBUG - RenderDashboard component rendered with user:', user);
  console.log('🔍 DEBUG - User ID:', user?.id);
  console.log('🔍 DEBUG - User object keys:', user ? Object.keys(user) : 'No user object');
  
  const [stats, setStats] = useState({
    subscribedProducts: 0,
    unreadNews: 0,
    totalNews: 0,
    lastActivity: null
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug component mount
  useEffect(() => {
    console.log('🔍 DEBUG - RenderDashboard component mounted');
    console.log('🔍 DEBUG - Initial user state:', user);
    // console.log('🔍 DEBUG - VITE_API_URL:', import.meta.env.VITE_API_URL);
    
    return () => {
      console.log('🔍 DEBUG - RenderDashboard component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('🔍 DEBUG - useEffect triggered with user?.id:', user?.id);
    console.log('🔍 DEBUG - User object in useEffect:', user);
    
    const fetchDashboardData = async () => {
      console.log('🔍 DEBUG - fetchDashboardData function called');
      console.log('🔍 DEBUG - Current user ID:', user?.id);
      // console.log('🔍 DEBUG - API URL:', import.meta.env.VITE_API_URL);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 DEBUG - Fetching dashboard data for user:', user?.id);
        
        if (!user?.id) {
          console.log('🔍 DEBUG - No user ID available, returning early');
          setLoading(false);
          return;
        }

        console.log('🔍 DEBUG - About to make API calls...');
        
        // Test API connectivity first
        try {
          console.log('🔍 DEBUG - Testing API connectivity...');
          const testResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/healthcheck`, {
            timeout: 5000
          });
          console.log('🔍 DEBUG - API connectivity test successful:', testResponse.status);
        } catch (testErr) {
          console.error('❌ API connectivity test failed:', testErr.message);
          // console.error('❌ API URL being used:', import.meta.env.VITE_API_URL);
        }
        
        // Fetch dashboard statistics
        
        const statsResponse = await axios.get(`/api/v1/customer/${user.id}/dashboard/stats`, {
          timeout: 10000
        });
        
        console.log('🔍 DEBUG - Stats API call successful:', statsResponse.status);
        console.log('🔍 DEBUG - Stats response data:', statsResponse.data);
        
        // Fetch recent news
        
        const newsResponse = await axios.get(`/api/v1/customer/${user.id}/dashboard/recent-news?limit=10`, {
          timeout: 10000
        });
        
        console.log('🔍 DEBUG - News API call successful:', newsResponse.status);
        console.log('🔍 DEBUG - News response data:', newsResponse.data);

        console.log('🔍 DEBUG - Setting state with real data');
        setStats(statsResponse.data);
        setRecentNews(newsResponse.data);
        
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        console.error('❌ Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config
        });
        
        setError(err.response?.data?.detail || err.message || 'Failed to fetch dashboard data');
        
        // Set fallback data
        console.log('🔍 DEBUG - Setting fallback data due to error');
        setStats({
          subscribedProducts: 0,
          unreadNews: 0,
          totalNews: 0,
          lastActivity: null
        });
        setRecentNews([]);
      } finally {
        console.log('🔍 DEBUG - Setting loading to false');
        setLoading(false);
      }
    };

    console.log('🔍 DEBUG - Calling fetchDashboardData');
    fetchDashboardData();
  }, [user?.id]);

  console.log('🔍 DEBUG - Current component state:', {
    loading,
    error,
    stats,
    recentNewsLength: recentNews.length,
    user: user?.id
  });

  if (loading) {
    console.log('🔍 DEBUG - Rendering loading state');
    return <LoadingAnimation />;
  }

  if (error) {
    console.log('🔍 DEBUG - Rendering error state:', error);
    return (
      <div className="space-y-8">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-200">{error}</p>
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

  console.log('🔍 DEBUG - Rendering main dashboard content');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {/* <div className="bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-700/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.username || 'Customer'}! 👋
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Stay updated with your favorite products and latest news
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
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
      </div> */}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl shadow-lg p-6 border border-blue-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-300">Subscribed Products</p>
              <p className="text-3xl font-bold text-blue-400">{stats.subscribedProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-800/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl shadow-lg p-6 border border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-300">Unread News</p>
              <p className="text-3xl font-bold text-green-400">{stats.unreadNews}</p>
            </div>
            <div className="w-12 h-12 bg-green-800/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div> */}

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl shadow-lg p-6 border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-300">Total News</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalNews}</p>
            </div>
            <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Recent News */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-200">Recent News</h2>
            {/* <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
              View All
            </button> */}
          </div>
          
          <div className="space-y-4">
            {recentNews.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No recent news</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Subscribe to products to see their latest news and updates here.
                </p>
              </div>
            ) : (
              recentNews.map((news) => (
                <div key={news.id} className={`p-4 rounded-lg border transition-all duration-200 ${
                  news.isRead 
                    ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' 
                    : 'bg-blue-900/30 border-blue-700/50 hover:bg-blue-900/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${news.isRead ? 'text-gray-300' : 'text-blue-300'}`}>
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{news.product}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(news.time)} • {news.isRead ? 'Read' : 'Unread'}
                      </p>
                    </div>
                    {!news.isRead && (
                      <div className="w-3 h-3 bg-blue-400 rounded-full ml-2 animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-200 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-700/30 transition-all duration-200 group">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-300">View News</span>
              </div>
            </button>

            <button className="p-4 bg-green-900/30 hover:bg-green-900/50 rounded-lg border border-green-700/30 transition-all duration-200 group">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm font-medium text-green-300">Browse Products</span>
              </div>
            </button>

            <button className="p-4 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg border border-purple-700/30 transition-all duration-200 group">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-purple-300">My Profile</span>
              </div>
            </button>

            <button className="p-4 bg-yellow-900/30 hover:bg-yellow-900/50 rounded-lg border border-yellow-700/30 transition-all duration-200 group">
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-yellow-300">Get Help</span>
              </div>
            </button>
          </div>
        </div> */}
      </div>

      {/* Tips Section */}
      {/* <div className="bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-gray-200 mb-4">💡 Pro Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-300">Enable notifications to stay updated with product launches and news</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-300">Subscribe to products you're interested in to receive updates</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-300">Check your dashboard regularly for personalized recommendations</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RenderDashboard;