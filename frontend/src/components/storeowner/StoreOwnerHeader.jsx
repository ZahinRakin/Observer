import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import avatar from "/avatar.jpg";

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
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded shadow relative">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">Store Owner Dashboard</h1>
        <span className="text-gray-600 text-sm">Welcome, {user ? user.username : 'Store Owner'}</span>
      </div>
      <div className="flex items-center gap-3 relative">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="focus:outline-none">
            <img
              src={user?.avatar || avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
            />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 animate-fade-in flex flex-col"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                onClick={onViewProfile}
              >
                View Profile
              </button>
              <button
                className="px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                onClick={onEditProfile}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StoreOwnerHeader; 