import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import { Link } from 'react-router-dom';

const StoreOwnerHeader = ({ user, onViewProfile, onEditProfile }) => {
  const { setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuHideTimeout = React.useRef();

  const handleMouseEnter = () => {
    if (menuHideTimeout.current) clearTimeout(menuHideTimeout.current);
    setShowMenu(true);
  };
  
  const handleMouseLeave = () => {
    menuHideTimeout.current = setTimeout(() => setShowMenu(false), 200); // 200ms delay
  };
  
  const handleLogout = () => {
    setUser(null);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/signin';
  };
  
  React.useEffect(() => {
    return () => { if (menuHideTimeout.current) clearTimeout(menuHideTimeout.current); };
  }, []);
  
  return (
    <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 border-b border-gray-700/50 px-6 py-4 shadow-lg backdrop-blur-sm">
      {/* Left Section - Title and Welcome */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded opacity-90"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent tracking-tight">Store Owner Dashboard</h1>
          </div>
          <span className="text-gray-300 text-sm ml-11 mt-1">Welcome back, {user ? user.username : 'Store Owner'}</span>
        </div>
        
        {/* Quick Stats */}
        {/* <div className="hidden lg:flex items-center gap-6 ml-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Business Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-300">3 Stores Managed</span>
          </div>
        </div> */}
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {/* <div className="hidden md:flex relative">
          <input
            type="text"
            placeholder="Search stores..."
            className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm text-white placeholder-gray-400"
          />
          <div className="absolute left-3 top-2.5 w-4 h-4 bg-gray-400 rounded-full"></div>
        </div> */}

        {/* Notification Bell */}
        {/* <div className="relative">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 relative">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 15V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v4c0 .386-.149.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </button>
        </div> */}

        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="focus:outline-none group">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
              <div className="relative">
                <img
                  src={user?.avatar || "/avatar.jpg"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 group-hover:border-green-500 transition-all duration-200 shadow-sm"
                />
                {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div> */}
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-white">{user?.username || 'Store Owner'}</span>
                {/* <span className="text-xs text-gray-400">Business Manager</span> */}
              </div>
              <div className="w-4 h-4 bg-green-400 rounded-full ml-2"></div>
            </div>
          </button>
          
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg border border-gray-600 z-50 overflow-hidden transform transition-all duration-200 origin-top-right"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Profile Section */}
              <div className="px-4 py-3 border-b border-gray-600 bg-gradient-to-r from-green-900/50 to-blue-900/50">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || "/avatar.jpg"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-500"
                  />
                  <div>
                    <div className="font-medium text-white text-sm">{user?.username || 'Store Owner'}</div>
                    <div className="text-xs text-gray-400">{user?.email || 'storeowner@example.com'}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-300 text-sm transition-colors duration-200 flex items-center gap-3"
                  onClick={onViewProfile}
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  View Profile
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-300 text-sm transition-colors duration-200 flex items-center gap-3"
                  onClick={onEditProfile}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Edit Profile
                </button>
                {/* <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-300 text-sm transition-colors duration-200 flex items-center gap-3"
                >
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  Business Settings
                </button> */}
                <Link to='/help&support'
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-300 text-sm transition-colors duration-200 flex items-center gap-3"
                >
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  Help & Support
                </Link>
              </div>

              {/* Logout Section */}
              <div className="border-t border-gray-600 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-red-900/50 text-red-400 text-sm transition-colors duration-200 flex items-center gap-3 font-medium"
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerHeader; 